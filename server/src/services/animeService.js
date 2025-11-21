const axios = require('axios');

const API_BASE_URL = process.env.ANIWATCH_API_URL || 'https://aniwatch-api.vercel.app/api/v2/hianime';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

exports.getHomeData = async () => {
  try {
    const response = await apiClient.get('/home');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch home data: ${error.message}`);
  }
};

exports.searchAnime = async (query, page = 1) => {
  try {
    const response = await apiClient.get('/search', {
      params: { q: query, page }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to search anime: ${error.message}`);
  }
};

exports.getAnimeDetails = async (animeId) => {
  try {
    const response = await apiClient.get(`/anime/${animeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch anime details: ${error.message}`);
  }
};

exports.getEpisodes = async (animeId) => {
  try {
    const response = await apiClient.get(`/anime/${animeId}/episodes`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch episodes: ${error.message}`);
  }
};

exports.getEpisodeSources = async (episodeId, server = 'hd-1', category = 'sub') => {
  try {
    console.log('=== Service Debug ===');
    console.log('Episode ID:', episodeId);
    console.log('Server:', server);
    console.log('Category:', category);
    
    const response = await apiClient.get('/episode/sources', {
      params: { 
        animeEpisodeId: episodeId,  // Use just the episode ID (e.g., "145813")
        server: server,
        category: category
      }
    });
    
    console.log('External API Response Status:', response.status);
    console.log('External API Response Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Service Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    throw new Error(`Failed to fetch episode sources: ${error.response?.data?.message || error.message}`);
  }
};


exports.getCategory = async (category, page = 1) => {
  try {
    const response = await apiClient.get(`/category/${category}`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch category: ${error.message}`);
  }
};
