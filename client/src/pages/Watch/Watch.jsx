import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEpisodeSources } from '../../services/animeService';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './Watch.css';

function Watch() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState('hd-1');
  const [selectedCategory, setSelectedCategory] = useState('sub');

  useEffect(() => {
    if (episodeId) {
      fetchEpisodeSources();
    }
    
    // Cleanup player on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [episodeId, selectedServer, selectedCategory]);

  const fetchEpisodeSources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching sources for episode:', episodeId);
      console.log('Server:', selectedServer, 'Category:', selectedCategory);
      
      const response = await getEpisodeSources(episodeId, selectedServer, selectedCategory);
      console.log('Episode sources response:', response);
      
      // Handle nested response structure
      let sourceData = null;
      if (response.data?.data) {
        sourceData = response.data.data;
      } else if (response.data) {
        sourceData = response.data;
      }
      
      if (sourceData) {
        setSources(sourceData);
        
        // Initialize video player after sources are loaded
        setTimeout(() => {
          initializePlayer(sourceData);
        }, 100);
      } else {
        setError('No video sources available for this episode.');
      }
    } catch (err) {
      console.error('Error fetching episode sources:', err);
      setError(`Failed to load video sources. ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const initializePlayer = (sourceData) => {
    if (!videoRef.current) return;
    
    // Dispose existing player
    if (playerRef.current) {
      playerRef.current.dispose();
    }
    
    // Get the video URL
    let videoUrl = null;
    
    if (sourceData.sources && sourceData.sources.length > 0) {
      // Try to get the highest quality source
      const source = sourceData.sources.find(s => s.quality === '1080p') || 
                     sourceData.sources.find(s => s.quality === '720p') || 
                     sourceData.sources[0];
      videoUrl = source.url;
    }
    
    if (!videoUrl) {
      setError('No playable video source found.');
      return;
    }
    
    console.log('Initializing player with URL:', videoUrl);
    
    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      responsive: true,
      html5: {
        vhs: {
          overrideNative: true
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      },
      sources: [{
        src: videoUrl,
        type: videoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      }]
    });
    
    // Handle player events
    player.on('ready', () => {
      console.log('Player is ready');
    });
    
    player.on('error', (e) => {
      console.error('Player error:', e);
      const error = player.error();
      if (error) {
        console.error('Error details:', error);
        setError(`Video playback error: ${error.message || 'Unknown error'}`);
      }
    });
    
    player.on('loadedmetadata', () => {
      console.log('Video metadata loaded');
    });
    
    playerRef.current = player;
  };

  const handleServerChange = (server) => {
    setSelectedServer(server);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="watch-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading video player...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page">
        <div className="container">
          <div className="error-container">
            <div className="error-content">
              <h2>😕 Oops!</h2>
              <p className="error-message">{error}</p>
              <p className="error-id">Episode ID: {episodeId}</p>
              <div className="error-actions">
                <button onClick={fetchEpisodeSources} className="btn-retry">
                  Try Again
                </button>
                <button onClick={() => navigate(-1)} className="btn-back">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="container">
        {/* Video Player */}
        <div className="video-section">
          <div className="video-container">
            <div data-vjs-player>
              <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="video-controls">
            {/* Server Selection */}
            {sources?.sources && sources.sources.length > 0 && (
              <div className="control-group">
                <label>Quality:</label>
                <div className="button-group">
                  {sources.sources.map((source, index) => (
                    <button
                      key={index}
                      className={`control-button ${source.quality === 'default' ? 'active' : ''}`}
                      onClick={() => {
                        // Reinitialize player with new quality
                        if (playerRef.current) {
                          playerRef.current.src({ 
                            src: source.url, 
                            type: source.url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' 
                          });
                        }
                      }}
                    >
                      {source.quality || 'Default'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Category Selection (Sub/Dub) */}
            <div className="control-group">
              <label>Audio:</label>
              <div className="button-group">
                <button
                  className={`control-button ${selectedCategory === 'sub' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('sub')}
                >
                  Subtitle
                </button>
                <button
                  className={`control-button ${selectedCategory === 'dub' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('dub')}
                >
                  Dubbed
                </button>
              </div>
            </div>
          </div>
          
          {/* Episode Info */}
          {sources && (
            <div className="episode-info">
              <h2>Now Playing</h2>
              <p>Episode ID: {episodeId}</p>
              {sources.intro && (
                <p>Intro: {sources.intro.start}s - {sources.intro.end}s</p>
              )}
              {sources.outro && (
                <p>Outro: {sources.outro.start}s - {sources.outro.end}s</p>
              )}
            </div>
          )}
          
          {/* Subtitles Info */}
          {sources?.subtitles && sources.subtitles.length > 0 && (
            <div className="subtitles-info">
              <h3>Available Subtitles:</h3>
              <div className="subtitle-list">
                {sources.subtitles.map((sub, index) => (
                  <span key={index} className="subtitle-badge">
                    {sub.lang || `Subtitle ${index + 1}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watch;
