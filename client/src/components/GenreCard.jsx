export default function GenreCard({ emoji, title, description }) {
  return (
    <div className="bg-card rounded-2xl shadow hover:shadow-xl transform hover:scale-105 transition p-6 flex flex-col items-center text-center">
      <div className="text-6xl mb-2 animate-pulse">{emoji}</div>
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-sm text-muted mb-4">{description}</p>
      <button className="mt-auto px-4 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark">Start</button>
    </div>
  );
}