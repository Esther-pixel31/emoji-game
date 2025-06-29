import os
from datetime import timedelta
from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from flask_migrate import Migrate
from flask_cors import CORS
from passlib.hash import pbkdf2_sha256
from flask_dance.contrib.google import make_google_blueprint, google
from dotenv import load_dotenv
from dateutil.parser import isoparse
from sqlalchemy_serializer import SerializerMixin

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5173"}}, supports_credentials=True)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emoji.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/refresh'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_url="/login/google/authorized",
    scope=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid"
    ]
)
app.register_blueprint(google_bp, url_prefix="/login")


class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(120))
    password_hash = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, default=0)

    history = db.relationship('GameHistory', backref='user', lazy=True, cascade="all, delete-orphan")
    achievements = db.relationship('Achievement', secondary='user_achievements', back_populates='users')
    profile = db.relationship('Profile', uselist=False, back_populates='user')

    serialize_rules = ('-password_hash', '-achievements.users', '-history.user', '-profile.user')

    def set_password(self, pw):
        self.password_hash = pbkdf2_sha256.hash(pw)

    def check_password(self, pw):
        return pbkdf2_sha256.verify(pw, self.password_hash)

class GameHistory(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    date_played = db.Column(db.DateTime, nullable=False)
    streak = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    serialize_rules = ('-user',)

    def to_dict(self, **kwargs):
        data = super().to_dict(**kwargs)
        # Add an ISO-formatted 'date' key for frontend compatibility
        if self.date_played:
            data['date'] = self.date_played.isoformat()
        else:
            data['date'] = None
        return data


user_achievements = db.Table(
    'user_achievements',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('achievement_id', db.Integer, db.ForeignKey('achievement.id'), primary_key=True)
)

class Profile(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.String(255))
    avatar_url = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True)
    user = db.relationship('User', back_populates='profile')

    serialize_rules = ('-user',)

class Achievement(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    users = db.relationship('User', secondary='user_achievements', back_populates='achievements')

    serialize_rules = ('-users',)

with app.app_context():
    db.create_all()



@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("email") or not data.get("password") or not data.get("username"):
        return jsonify(message="Missing required fields"), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify(message="Email already registered"), 400

    user = User(email=data['email'], username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    resp = jsonify(message="Registered successfully")
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify(message='Missing email or password'), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify(message='Invalid credentials'), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    resp = jsonify(
        message="Login successful",
        user=user.to_dict()
    )
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200

@app.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)

    resp = jsonify(message="Token refreshed")
    set_access_cookies(resp, access_token)
    return resp, 200

@app.route('/api/logout', methods=['POST'])
def logout():
    resp = jsonify(message="Logged out")
    unset_jwt_cookies(resp)
    return resp, 200

@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404
    return jsonify(user.to_dict()), 200

@app.route('/api/leaderboard')
def leaderboard():
    top_users = User.query.order_by(User.points.desc()).limit(10).all()
    return jsonify([
        {"username": u.username, "points": u.points}
        for u in top_users
    ])

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    return jsonify(user.to_dict()), 200

@app.route('/api/update-profile', methods=['POST'])
@jwt_required()
def update_profile_post():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    user.name = data.get('name', user.name)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)

    db.session.commit()
    return jsonify({"msg": "Profile updated"}), 200

@app.route('/api/update-points', methods=['POST'])
@jwt_required()
def update_points():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify(message="User not found"), 404

    pts = request.get_json().get('points', 0)
    user.points += pts
    db.session.commit()

    return jsonify(points=user.points), 200

@app.route('/api/add-history', methods=['POST'])
@jwt_required()
def add_history():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify(message="User not found"), 404

    try:
        data = request.get_json()
        history = GameHistory(
            genre=data['genre'],
            score=data['score'],
            total=data['total'],
            date_played=isoparse(data['date']),
            streak=data.get('streak', 0),
            user_id=user.id
        )
        db.session.add(history)
        user.points += data['score']

        new_achievements = []

        def award(title, description):
            achievement = Achievement.query.filter_by(title=title).first()
            if achievement and achievement not in user.achievements:
                user.achievements.append(achievement)
                new_achievements.append({'title': title, 'description': description})

        if len(user.history) == 0:
            award('First Quiz', 'Completed your first quiz')

        if history.score == history.total:
            award('Perfect Score', 'Scored perfectly on a quiz')

        if history.streak >= 3:
            award('Streak Master', 'Got 3+ correct answers in a row')

        if user.points >= 500:
            award('500 Points Club', 'Earned 500+ total points')

        total_games = len(user.history) + 1
        milestones = {
            5: '5 Games Played',
            10: '10 Games Played',
            15: '15 Games Played',
            20: '20 Games Played',
            25: '25 Games Played',
            30: '30 Games Played'
        }
        if total_games in milestones:
            award(milestones[total_games], f"Completed {total_games} quizzes")

        db.session.commit()

        return jsonify({
            'message': 'History added',
            'newAchievements': new_achievements
        }), 201

    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

@app.route('/api/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted"}), 200

@app.route('/login/google/authorized')
def google_authorized():
    if not google.authorized:
        return redirect(url_for('google.login'))

    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return jsonify(message="Failed to get user info"), 400

    data = resp.json()
    email = data.get("email")
    username = data.get("name", email.split('@')[0])

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, username=username)
        user.set_password("oauth")
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    resp = redirect(f"http://localhost:5173/oauth-success?user={username}")
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp

if __name__ == '__main__':
    app.run(debug=True)
