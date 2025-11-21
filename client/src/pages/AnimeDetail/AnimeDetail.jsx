import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeDetails, getEpisodes } from '../../services/animeService';
import './AnimeDetail.css';

function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAnimeDetails();
    }
  }, [id]);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching anime with ID:', id);
      
      // Fetch anime details
      const detailsResponse = await getAnimeDetails(id);
      console.log('Full API Response:', detailsResponse);
      
      // Extract the nested data: response.data.data.anime
      if (detailsResponse.success && detailsResponse.data?.data?.anime) {
        const animeData = detailsResponse.data.data.anime;
        setAnime(animeData);
        console.log('Anime data set:', animeData);
        
        // Fetch episodes
        try {
          const episodesResponse = await getEpisodes(id);
          console.log('Episodes response:', episodesResponse);
          
          // Handle nested episodes response
          if (episodesResponse.success && episodesResponse.data?.data?.episodes) {
            const episodesData = episodesResponse.data.data.episodes;
            console.log('Episodes data:', episodesData);
            setEpisodes(episodesData);
          }
        } catch (episodeError) {
          console.error('Error fetching episodes:', episodeError);
        }
      } else {
        setError('Anime not found. The ID might be incorrect.');
      }
    } catch (err) {
      console.error('Error fetching anime details:', err);
      setError(
        `Failed to load anime details. ${err.response?.data?.error?.message || err.message || ''}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeClick = (episode) => {
    console.log('Episode clicked:', episode);
    // The episodeId from the API should be in format like "anime-name-123?ep=456"
    if (episode.episodeId) {
      navigate(`/watch/${encodeURIComponent(episode.episodeId)}`);
    } else {
      console.error('Episode ID is missing:', episode);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading anime details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>😕 Oops!</h2>
          <p className="error-message">{error}</p>
          <p className="error-id">Anime ID: {id}</p>
          <button onClick={() => navigate('/')} className="btn-home">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Anime Not Found</h2>
          <p>The anime you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-home">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-detail-page">
      {/* Banner Section */}
      <div 
        className="anime-banner"
        style={{ 
          backgroundImage: `url(${anime.info?.poster})` 
        }}
      >
        <div className="banner-overlay">
          <div className="container">
            <h1 className="anime-detail-title">
              {anime.info?.name || 'Untitled'}
            </h1>
            <div className="anime-quick-stats">
              {anime.info?.stats?.rating && (
                <span className="stat-badge">📺 {anime.info.stats.rating}</span>
              )}
              {anime.info?.stats?.quality && (
                <span className="stat-badge">🎥 {anime.info.stats.quality}</span>
              )}
              {anime.info?.stats?.type && (
                <span className="stat-badge">📺 {anime.info.stats.type}</span>
              )}
              {anime.moreInfo?.malscore && (
                <span className="stat-badge">⭐ {anime.moreInfo.malscore}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container anime-content">
        <div className="anime-info-grid">
          {/* Poster */}
          <div className="anime-poster-section">
            <img 
              src={anime.info?.poster} 
              alt={anime.info?.name}
              className="anime-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x420?text=No+Image';
              }}
            />
            
            {/* Promotional Videos */}
            {anime.info?.promotionalVideos && anime.info.promotionalVideos.length > 0 && (
              <div className="promo-videos">
                <h3>Trailers</h3>
                {anime.info.promotionalVideos.slice(0, 1).map((video, index) => (
                  <div key={index} className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="play-overlay">▶</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="anime-details">
            <h2>Synopsis</h2>
            <p className="anime-description">
              {anime.info?.description || 'No description available.'}
            </p>

            {/* Information Section */}
            <div className="anime-meta-list">
              <h3>Information</h3>
              
              {anime.moreInfo?.japanese && (
                <div className="meta-row">
                  <span className="meta-label">Japanese:</span>
                  <span className="meta-value">{anime.moreInfo.japanese}</span>
                </div>
              )}
              
              {anime.moreInfo?.aired && (
                <div className="meta-row">
                  <span className="meta-label">Aired:</span>
                  <span className="meta-value">{anime.moreInfo.aired}</span>
                </div>
              )}
              
              {anime.moreInfo?.premiered && (
                <div className="meta-row">
                  <span className="meta-label">Premiered:</span>
                  <span className="meta-value">{anime.moreInfo.premiered}</span>
                </div>
              )}
              
              {anime.info?.stats?.episodes && (
                <div className="meta-row">
                  <span className="meta-label">Episodes:</span>
                  <span className="meta-value">
                    {anime.info.stats.episodes.sub && `Sub: ${anime.info.stats.episodes.sub}`}
                    {anime.info.stats.episodes.dub && ` | Dub: ${anime.info.stats.episodes.dub}`}
                  </span>
                </div>
              )}
              
              {anime.info?.stats?.type && (
                <div className="meta-row">
                  <span className="meta-label">Type:</span>
                  <span className="meta-value">{anime.info.stats.type}</span>
                </div>
              )}
              
              {anime.info?.stats?.duration && (
                <div className="meta-row">
                  <span className="meta-label">Duration:</span>
                  <span className="meta-value">{anime.info.stats.duration}</span>
                </div>
              )}
              
              {anime.moreInfo?.status && (
                <div className="meta-row">
                  <span className="meta-label">Status:</span>
                  <span className="meta-value">{anime.moreInfo.status}</span>
                </div>
              )}
              
              {anime.moreInfo?.genres && anime.moreInfo.genres.length > 0 && (
                <div className="meta-row">
                  <span className="meta-label">Genres:</span>
                  <span className="meta-value">
                    <div className="genre-tags">
                      {anime.moreInfo.genres.map((genre, index) => (
                        <span key={index} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  </span>
                </div>
              )}
              
              {anime.moreInfo?.studios && (
                <div className="meta-row">
                  <span className="meta-label">Studios:</span>
                  <span className="meta-value">{anime.moreInfo.studios}</span>
                </div>
              )}
            </div>

            {/* Episodes Section */}
            {episodes.length > 0 && (
              <div className="episodes-section">
                <h3>Episodes ({episodes.length})</h3>
                <div className="episodes-grid">
                  {episodes.slice(0, 24).map((episode) => {
                    // Extract just the episode ID part after ?ep=
                    const episodeIdPart = episode.episodeId?.split('?ep=')[1] || episode.episodeId;
                    
                    return (
                      <button
                        key={episode.episodeId}
                        className="episode-button"
                        onClick={() => navigate(`/watch/${episodeIdPart}`)}
                        title={episode.title || `Episode ${episode.number}`}
                      >
                        EP {episode.number}
                      </button>
                    );
                  })}
                </div>
                {episodes.length > 24 && (
                  <p className="episodes-more">
                    + {episodes.length - 24} more episodes available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Anime Section */}
        {anime.moreInfo?.relatedAnimes && anime.moreInfo.relatedAnimes.length > 0 && (
          <div className="related-section">
            <h3>Related Anime</h3>
            <div className="related-grid">
              {anime.moreInfo.relatedAnimes.slice(0, 6).map((related, index) => (
                <div 
                  key={index} 
                  className="related-card"
                  onClick={() => navigate(`/anime/${related.id}`)}
                >
                  <img src={related.poster} alt={related.name} />
                  <p>{related.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeDetail;
