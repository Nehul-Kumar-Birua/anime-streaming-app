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
  const [availableServers, setAvailableServers] = useState([]);

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
      
      console.log('=== Episode Sources Debug ===');
      console.log('Full Episode ID from URL:', episodeId);
      console.log('Selected Server:', selectedServer);
      console.log('Selected Category:', selectedCategory);
      
      const response = await getEpisodeSources(episodeId, selectedServer, selectedCategory);
      console.log('Full API Response:', response);
      
      // Handle nested response structure
      let sourceData = null;
      if (response.data?.data) {
        sourceData = response.data.data;
      } else if (response.data) {
        sourceData = response.data;
      }
      
      console.log('Extracted Source Data:', sourceData);
      
      if (sourceData) {
        setSources(sourceData);
        
        // Extract available servers if present
        if (sourceData.servers) {
          setAvailableServers(sourceData.servers);
        }
        
        // Check if sources array exists and has items
        if (sourceData.sources && sourceData.sources.length > 0) {
          console.log('Available sources:', sourceData.sources);
          
          // Initialize video player after sources are loaded
          setTimeout(() => {
            initializePlayer(sourceData);
          }, 100);
        } else {
          setError('No video sources available. Try selecting a different server or category.');
          console.log('No sources found in response');
        }
      } else {
        setError('Invalid response format from server.');
      }
    } catch (err) {
      console.error('Error fetching episode sources:', err);
      console.error('Error details:', err.response?.data);
      setError(
        `Failed to load video sources. ${err.response?.data?.error?.message || err.message || 'Please try a different server.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const initializePlayer = (sourceData) => {
    if (!videoRef.current) {
      console.error('Video ref not available');
      return;
    }
    
    // Dispose existing player
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    
    // Get the video URL
    let videoUrl = null;
    let videoType = 'application/x-mpegURL'; // Default to HLS
    
    if (sourceData.sources && sourceData.sources.length > 0) {
      // Try to get the best quality source
      const preferredQualities = ['1080p', '720p', 'default', 'auto'];
      let selectedSource = null;
      
      for (const quality of preferredQualities) {
        selectedSource = sourceData.sources.find(s => s.quality === quality);
        if (selectedSource) break;
      }
      
      // If no preferred quality found, use first available
      if (!selectedSource) {
        selectedSource = sourceData.sources[0];
      }
      
      videoUrl = selectedSource.url;
      
      // Determine video type
      if (videoUrl.includes('.m3u8')) {
        videoType = 'application/x-mpegURL';
      } else if (videoUrl.includes('.mp4')) {
        videoType = 'video/mp4';
      }
      
      console.log('Selected video source:', selectedSource);
      console.log('Video URL:', videoUrl);
      console.log('Video Type:', videoType);
    }
    
    if (!videoUrl) {
      setError('No playable video URL found in sources.');
      return;
    }
    
    try {
      // Initialize Video.js player
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      });
      
      // Set video source
      player.src({
        src: videoUrl,
        type: videoType
      });
      
      // Add subtitles if available
      if (sourceData.subtitles && sourceData.subtitles.length > 0) {
        sourceData.subtitles.forEach((subtitle, index) => {
          player.addRemoteTextTrack({
            kind: 'subtitles',
            src: subtitle.url || subtitle.file,
            srclang: subtitle.lang || 'en',
            label: subtitle.label || subtitle.lang || `Subtitle ${index + 1}`,
            default: index === 0
          }, false);
        });
      }
      
      // Add tracks if available
      if (sourceData.tracks && sourceData.tracks.length > 0) {
        sourceData.tracks.forEach((track) => {
          player.addRemoteTextTrack({
            kind: track.kind || 'subtitles',
            src: track.file || track.url,
            srclang: track.label?.toLowerCase() || 'en',
            label: track.label || 'English',
            default: track.default || false
          }, false);
        });
      }
      
      // Handle player events
      player.on('ready', () => {
        console.log('✅ Player is ready');
      });
      
      player.on('loadedmetadata', () => {
        console.log('✅ Video metadata loaded');
      });
      
      player.on('loadeddata', () => {
        console.log('✅ Video data loaded');
      });
      
      player.on('error', () => {
        const error = player.error();
        if (error) {
          console.error('❌ Player error:', error);
          setError(`Video playback error (${error.code}): ${error.message || 'Unknown error'}`);
        }
      });
      
      playerRef.current = player;
      console.log('✅ Player initialized successfully');
      
    } catch (err) {
      console.error('Error initializing player:', err);
      setError(`Failed to initialize video player: ${err.message}`);
    }
  };

  const handleServerChange = (server) => {
    console.log('Changing server to:', server);
    setSelectedServer(server);
  };

  const handleCategoryChange = (category) => {
    console.log('Changing category to:', category);
    setSelectedCategory(category);
  };

  const handleQualityChange = (source) => {
    if (playerRef.current && source.url) {
      console.log('Changing quality to:', source.quality, source.url);
      const currentTime = playerRef.current.currentTime();
      const wasPaused = playerRef.current.paused();
      
      playerRef.current.src({
        src: source.url,
        type: source.url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      });
      
      playerRef.current.one('loadedmetadata', () => {
        playerRef.current.currentTime(currentTime);
        if (!wasPaused) {
          playerRef.current.play();
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="watch-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading video player...</p>
            <p className="loading-detail">Episode ID: {episodeId}</p>
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
              <div className="error-suggestions">
                <p><strong>Try:</strong></p>
                <ul>
                  <li>Selecting a different server (HD-1, HD-2, etc.)</li>
                  <li>Switching between Sub and Dub</li>
                  <li>Refreshing the page</li>
                </ul>
              </div>
              <div className="error-actions">
                <button onClick={fetchEpisodeSources} className="btn-retry">
                  🔄 Try Again
                </button>
                <button onClick={() => navigate(-1)} className="btn-back">
                  ← Go Back
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
                playsInline
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="video-controls">
            {/* Quality Selection */}
            {sources?.sources && sources.sources.length > 0 && (
              <div className="control-group">
                <label>📺 Quality</label>
                <div className="button-group">
                  {sources.sources.map((source, index) => (
                    <button
                      key={index}
                      className="control-button"
                      onClick={() => handleQualityChange(source)}
                    >
                      {source.quality || 'Default'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Server Selection */}
            <div className="control-group">
              <label>🖥️ Server</label>
              <div className="button-group">
                {['hd-1', 'hd-2', 'megacloud', 'streamtape'].map((server) => (
                  <button
                    key={server}
                    className={`control-button ${selectedServer === server ? 'active' : ''}`}
                    onClick={() => handleServerChange(server)}
                  >
                    {server.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Selection (Sub/Dub) */}
            <div className="control-group">
              <label>🎧 Audio</label>
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
              <p className="episode-id-display">Episode ID: {episodeId}</p>
              {sources.intro && (
                <p>⏩ Intro: {sources.intro.start}s - {sources.intro.end}s</p>
              )}
              {sources.outro && (
                <p>⏩ Outro: {sources.outro.start}s - {sources.outro.end}s</p>
              )}
            </div>
          )}
          
          {/* Subtitles Info */}
          {(sources?.subtitles && sources.subtitles.length > 0) || 
           (sources?.tracks && sources.tracks.length > 0) && (
            <div className="subtitles-info">
              <h3>📝 Available Subtitles</h3>
              <div className="subtitle-list">
                {sources.subtitles?.map((sub, index) => (
                  <span key={index} className="subtitle-badge">
                    {sub.lang || sub.label || `Language ${index + 1}`}
                  </span>
                ))}
                {sources.tracks?.map((track, index) => (
                  <span key={`track-${index}`} className="subtitle-badge">
                    {track.label || 'Subtitle'}
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
