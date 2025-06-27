from app import app, db, Achievement


BADGES = [
    {"title": "Perfect Score", "description": "Scored 100% on a quiz"},
    {"title": "5 Games Played", "description": "Completed 5 quizzes"},
    {"title": "10 Games Played", "description": "Completed 10 quizzes"},
    {"title": "15 Games Played", "description": "Completed 15 quizzes"},
    {"title": "20 Games Played", "description": "Completed 20 quizzes"},
    {"title": "25 Games Played", "description": "Completed 25 quizzes"},
    {"title": "30 Games Played", "description": "Completed 30 quizzes"},
    {"title": "500 Points Club", "description": "Scored over 500 total points"},
    {"title": "Streak Master", "description": "Earned a 3-question streak"},
]

with app.app_context():
    for badge in BADGES:
        existing = Achievement.query.filter_by(title=badge["title"]).first()
        if not existing:
            db.session.add(Achievement(**badge))
            print(f"✅ Added: {badge['title']}")
        else:
            print(f"⏭️ Skipped: {badge['title']} (already exists)")
    db.session.commit()
    print("🎉 Seeding complete!")
