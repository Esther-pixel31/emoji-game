# 🎉 Emoji Quiz Master

Emoji Quiz Master is a fun, interactive web application that challenges players to decode emoji-based clues across different genres — from movies to songs, emotions, and Marvel characters!

It’s built with a modern stack: **React + Flask**, fully animated, mobile-friendly, and gamified with points, streaks, and achievements.

---

## 🚀 Features

* 🧩 Multiple quiz genres: Movie Characters, Emotion Quiz, Marvel Heroes, Guess the Song
* ⏰ Timer-based challenges with streak multipliers
* 🏆 Achievements and milestone rewards
* 📊 Leaderboard and detailed game history
* 🔥 Animated UI with hints and interactive feedback
* 🌙 Light/dark theme toggle
* 🟢 Google OAuth login & JWT authentication

---

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS, Framer Motion, React Router, React Hot Toast
* **Backend:** Flask, SQLAlchemy, Flask-JWT-Extended, Flask-Dance
* **Database:** SQLite

---

## ⚙️ Local Setup

### 1️⃣ Backend (Flask)

```bash
git clone git@github.com:Esther-pixel31/emoji-game.git
cd emoji-game
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in:

```
FLASK_SECRET_KEY=your-flask-secret
JWT_SECRET_KEY=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Then migrate and start:

```bash
flask db upgrade
flask run
```

Backend will be running at: `http://localhost:5000`

---

### 2️⃣ Frontend (React)

```bash
cd client 
npm install
npm run dev
```

Frontend will be available at: [http://localhost:5173](http://localhost:5173)

---

## 🗺️ API Overview

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/api/register`       | Register a new user   |
| POST   | `/api/login`          | Login user            |
| POST   | `/api/logout`         | Logout user           |
| GET    | `/api/me`             | Get current user data |
| POST   | `/api/update-profile` | Update user profile   |
| POST   | `/api/update-points`  | Add points to user    |
| POST   | `/api/add-history`    | Save quiz result      |
| DELETE | `/api/delete-account` | Delete account        |
| GET    | `/api/leaderboard`    | Fetch top players     |

---

## 🌐 Deployment

* **Backend**: Deploy to [Render](https://render.com), [Fly.io](https://fly.io), or [Railway](https://railway.app).
* **Frontend**: Deploy to [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or similar.

Make sure to update your CORS settings and environment variables for production.

---

## 📸 Screenshots

![Home](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/home.png)
![Home2](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/home2.png)
![Achievements](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/achievement.png)
![About](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/about.png)
![Leaderboard](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/leaderboard.png)
![GenreCard](https://raw.githubusercontent.com/Esther-pixel31/emoji-game/main/client/src/assets/genrecard.png)


---

## 🙏 Credits

Made with love, sweat, and many emojis by **Esther Mutua** 💖
Special thanks to all contributors and emoji puzzle fans!

---

## 📄 License

[MIT License](LICENSE).
Feel free to fork, improve, and share — contributions welcome!

---

## 💬 Questions or Ideas?

Open an issue or start a discussion — we'd love to hear from you!

---

### ⭐️ If you like this project, please give it a star! ⭐️
