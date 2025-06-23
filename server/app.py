import os
from datetime import datetime, timedelta
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

# Allow HTTP for OAuth (not recommended in production)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5173"}}, supports_credentials=True)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emoji.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = False

# JWT Config
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/refresh'

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Google OAuth Setup
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

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, default=0)
    history = db.relationship('GameHistory', backref='user', lazy=True)

    def set_password(self, pw):
        self.password_hash = pbkdf2_sha256.hash(pw)

    def check_password(self, pw):
        return pbkdf2_sha256.verify(pw, self.password_hash)

class GameHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    date_played = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

with app.app_context():
    db.create_all()

# Auth Routes
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
    print(f"User {user.username} committed to DB")

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
        user={
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
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

# Protected Routes
@app.route('/api/user', methods=['GET'])
@jwt_required(locations=["cookies"])
def profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    return jsonify(id=user.id, email=user.email, username=user.username, points=user.points), 200

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

    data = request.get_json()
    history = GameHistory(
        genre=data['genre'],
        score=data['score'],
        total=data['total'],
        date_played=datetime.fromisoformat(data['date']),
        user_id=user.id
    )
    db.session.add(history)
    db.session.commit()
    print("📥 Incoming history:", data)

    return jsonify({'message': 'History added'}), 201

@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify(message="User not found"), 404

    history = [
        {
            "genre": h.genre,
            "score": h.score,
            "total": h.total,
            "date": h.date_played.isoformat(),
        }
        for h in user.history  # This assumes a relationship is defined
    ]

    return jsonify({
        "id": user.id,
        "username": user.username,
        "points": user.points,
        "history": history,
    }), 200

# Run Server
if __name__ == '__main__':
    app.run(debug=True)
