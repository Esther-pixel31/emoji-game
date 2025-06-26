import { useNavigate } from 'react-router-dom';

export default function GenreCard({ emoji, title, description }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const genrePath = title.toLowerCase().replace(/ /g, '');
    navigate(`/quiz/${genrePath}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-card rounded-2xl shadow hover:shadow-xl transform hover:scale-105 transition p-6 flex flex-col justify-between items-center text-center cursor-pointer w-full h-full focus:outline-none"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-6xl animate-pulse">{emoji}</div>
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <span className="mt-6 px-4 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark">
        Start
      </span>
    </button>
  );
}
