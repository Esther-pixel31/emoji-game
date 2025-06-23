import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MovieQuiz from './pages/MovieQuiz';
import EmotionQuiz from './pages/EmotionQuiz';
import MarvelQuiz from './pages/MarvelQuiz';
import SongQuiz from './pages/SongQuiz';
import './index.css';
import { useState, useEffect } from 'react';
import OAuthSuccess from './pages/OAuthSuccess';
import History from "./pages/History";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz/moviecharacters" element={<MovieQuiz />} />
          <Route path="/quiz/emotionquiz" element={<EmotionQuiz />} />
          <Route path="/quiz/marvelcharacters" element={<MarvelQuiz />} />
          <Route path="/quiz/guesssongs" element={<SongQuiz />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </div>
  );
}
