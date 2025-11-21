const axios = require('axios');

const API_BASE_URL = process.env.ANIWATCH_API_URL || 'https://aniwatch-api.vercel.app/api/v2/hianime';

console.log('🌐 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

exports.getHomeData = async () => {
  try {
    console.log('🔍 Fetching home data from:', API_BASE_URL + '/home');
    const response = await apiClient.get('/home');
    console.log('✅ Home data fetched successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch home data:', error.message);
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
    console.log('Fetching episode sources:', { episodeId, server, category });
    
    const response = await apiClient.get('/episode/sources', {
      params: { 
        animeEpisodeId: episodeId,
        server: server,
        category: category
      }
    });
    
    console.log('Episode sources response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching episode sources:', error.response?.data || error.message);
    throw new Error(`Failed to fetch episode sources: ${error.message}`);
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
