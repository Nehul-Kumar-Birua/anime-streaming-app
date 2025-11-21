import { useState, useEffect } from 'react';
import { getHomeData } from '../../services/animeService';
import Carousel from '../../components/Carousel/Carousel';
import './Home.css';

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response = await getHomeData();
      console.log('Home response:', response);
      
      // Handle nested response: response.data.data
      if (response.data?.data) {
        setHomeData(response.data.data);
      } else {
        setHomeData(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load home data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading awesome anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>😕 Oops!</h2>
          <p>{error}</p>
          <button onClick={fetchHomeData} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!homeData) {
    return <div className="error">No data available</div>;
  }

  return (
    <div className="home-page">
      {/* Spotlight Section */}
      {homeData.spotlightAnimes && homeData.spotlightAnimes.length > 0 && (
        <div className="spotlight-section">
          <div 
            className="spotlight-banner"
            style={{
              backgroundImage: `url(${homeData.spotlightAnimes[0].poster})`
            }}
          >
            <div className="spotlight-overlay">
              <div className="container">
                <h1 className="spotlight-title">
                  {homeData.spotlightAnimes[0].name}
                </h1>
                <p className="spotlight-description">
                  {homeData.spotlightAnimes[0].description}
                </p>
                <div className="spotlight-buttons">
                  <button className="btn-primary">▶ Watch Now</button>
                  <button className="btn-secondary">ℹ More Info</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousels */}
      <div className="container">
        {homeData.trendingAnimes && (
          <Carousel title="🔥 Trending Now" animes={homeData.trendingAnimes} />
        )}
        
        {homeData.latestEpisodeAnimes && (
          <Carousel title="📺 Latest Episodes" animes={homeData.latestEpisodeAnimes} />
        )}
        
        {homeData.topUpcomingAnimes && (
          <Carousel title="🌟 Coming Soon" animes={homeData.topUpcomingAnimes} />
        )}
        
        {homeData.top10Animes?.today && (
          <Carousel title="🏆 Top 10 Today" animes={homeData.top10Animes.today} />
        )}
        
        {homeData.topAiringAnimes && (
          <Carousel title="📡 Top Airing" animes={homeData.topAiringAnimes} />
        )}
        
        {homeData.mostPopularAnimes && (
          <Carousel title="⭐ Most Popular" animes={homeData.mostPopularAnimes} />
        )}
      </div>
    </div>
  );
}

export default Home;
