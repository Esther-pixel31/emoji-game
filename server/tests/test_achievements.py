# tests/test_achievements.py

import pytest
from app import app, db, User, Achievement, GameHistory
from flask_jwt_extended import create_access_token
from datetime import datetime

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

@pytest.fixture
def test_user():
    user = User(email='test@example.com', username='tester')
    user.set_password('pass')
    db.session.add(user)

    titles = [
        'Perfect Score', '5 Games Played', '10 Games Played', '15 Games Played',
        '20 Games Played', '25 Games Played', '30 Games Played',
        '500 Points Club', 'Streak Master'
    ]
    for title in titles:
        db.session.add(Achievement(title=title))

    db.session.commit()
    return user

def auth_headers(user_id):
    token = create_access_token(identity=user_id)
    return {'Authorization': f'Bearer {token}'}

def post_game(client, headers, score, total):
    payload = {
        'genre': 'quiz',
        'score': score,
        'total': total,
        'date': datetime.utcnow().isoformat(),
    }
    return client.post('/api/add-history', json=payload, headers=headers)

def test_perfect_score_award(client, test_user):
    headers = auth_headers(test_user.id)
    res = post_game(client, headers, 10, 10)
    assert res.status_code == 201
    assert 'Perfect Score' in [a.title for a in User.query.get(test_user.id).achievements]

def test_game_milestones(client, test_user):
    headers = auth_headers(test_user.id)
    for i in range(30):
        res = post_game(client, headers, 7, 10)
        assert res.status_code == 201

    user = User.query.get(test_user.id)
    titles = [a.title for a in user.achievements]
    for badge in ['5 Games Played', '10 Games Played', '15 Games Played', '20 Games Played', '25 Games Played', '30 Games Played']:
        assert badge in titles

def test_no_duplicate_badges(client, test_user):
    headers = auth_headers(test_user.id)
    for _ in range(5):
        post_game(client, headers, 5, 10)
    user = User.query.get(test_user.id)
    before = len(user.achievements)

    post_game(client, headers, 5, 10)
    after = len(User.query.get(test_user.id).achievements)

    assert before == after  # should not increase

def test_missing_fields(client, test_user):
    headers = auth_headers(test_user.id)
    bad_payload = {
        'genre': 'movie',
        'score': 7
    }
    res = client.post('/api/add-history', json=bad_payload, headers=headers)
    assert res.status_code in (400, 500)

def test_invalid_user(client):
    fake_token = create_access_token(identity=9999)
    res = post_game(client, {'Authorization': f'Bearer {fake_token}'}, 5, 5)
    assert res.status_code == 404
