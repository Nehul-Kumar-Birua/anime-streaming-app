import api from './api';

export const getHomeData = async () => {
  try {
    const response = await api.get('/anime/home');
    console.log('Home data fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};

export const searchAnime = async (query, page = 1) => {
  try {
    const response = await api.get('/anime/search', {
      params: { q: query, page }
    });
    console.log('Search results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

export const getAnimeDetails = async (animeId) => {
  try {
    console.log('Fetching anime details for ID:', animeId);
    const response = await api.get(`/anime/${animeId}`);
    console.log('Anime details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const getEpisodes = async (animeId) => {
  try {
    console.log('Fetching episodes for ID:', animeId);
    const response = await api.get(`/anime/${animeId}/episodes`);
    console.log('Episodes response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
};

export const getEpisodeSources = async (episodeId, server = 'hd-1', category = 'sub') => {
  try {
    console.log('Requesting episode sources:', { episodeId, server, category });
    
    const response = await api.get('/anime/episode/sources', {
      params: { 
        id: episodeId, 
        server: server,
        category: category
      }
    });
    
    console.log('Episode sources API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};

export const getCategory = async (category, page = 1) => {
  try {
    const response = await api.get(`/anime/category/${category}`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};
