import { Link } from 'react-router-dom';
import './AnimeCard.css';

function AnimeCard({ anime }) {
  // Extract the correct ID - it could be in different properties
  const animeId = anime.id || anime.animeId || '';
  
  return (
    <Link to={`/anime/${animeId}`} className="anime-card">
      <div className="anime-card-image">
        <img 
          src={anime.poster || anime.image} 
          alt={anime.name || anime.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x280?text=No+Image';
          }}
        />
        <div className="anime-card-overlay">
          <button className="play-button">▶ Play</button>
        </div>
        {anime.rating && (
          <div className="anime-rating">⭐ {anime.rating}</div>
        )}
      </div>
      <div className="anime-card-info">
        <h3 className="anime-title">{anime.name || anime.title}</h3>
        <div className="anime-meta">
          {anime.type && <span className="meta-item">{anime.type}</span>}
          {anime.episodes?.sub && (
            <span className="meta-item">EP {anime.episodes.sub}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default AnimeCard;
