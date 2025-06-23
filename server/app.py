import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from passlib.hash import pbkdf2_sha256
from flask_dance.contrib.google import make_google_blueprint, google
from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)

load_dotenv()
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emoji.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = False

db = SQLAlchemy(app)
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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, default=0)

    def set_password(self, pw):
        self.password_hash = pbkdf2_sha256.hash(pw)
    def check_password(self, pw):
        return pbkdf2_sha256.verify(pw, self.password_hash)

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("email") or not data.get("password") or not data.get("username"):
        return jsonify(message="Missing required fields"), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify(message="Email already registered"), 400

    user = User(
        email=data['email'],
        username=data['username']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify(
        user={"id": user.id, "email": user.email, "username": user.username, "points": user.points},
        token=token
    ), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify(message='Invalid credentials'), 401
    token = create_access_token(identity=user.id)
    return jsonify(user={'id': user.id, 'email': user.email, 'username': user.username, 'points': user.points}, token=token), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    return jsonify(id=user.id, email=user.email, username=user.username, points=user.points), 200

@app.route('/api/update-points', methods=['POST'])
@jwt_required()
def update_points():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    pts = request.get_json().get('points', 0)
    user.points += pts
    db.session.commit()
    return jsonify(points=user.points), 200

@app.route('/login/google/authorized')
def google_authorized():
    print("🔁 Google redirected here")
    if not google.authorized:
        return redirect(url_for('google.login'))

    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return jsonify(message="Failed to get user info"), 400

    data = resp.json()
    email = data.get("email")
    username = data.get("name", email.split('@')[0])

    # Check if user exists or create
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, username=username)
        user.set_password("oauth")  # dummy pass
        db.session.add(user)
        db.session.commit()

    # Create token
    token = create_access_token(identity=user.id)

    # 🟢 Redirect to frontend with token as query param
    return redirect(f"http://localhost:5173/oauth-success?token={token}&user={username}")


if __name__ == '__main__':
    app.run(debug=True)
