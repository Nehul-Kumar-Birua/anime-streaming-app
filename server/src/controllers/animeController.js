const animeService = require('../services/animeService');

// Get home page data
exports.getHome = async (req, res, next) => {
  try {
    const data = await animeService.getHomeData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Search anime
exports.searchAnime = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const data = await animeService.searchAnime(q, page);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get anime details
exports.getAnimeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await animeService.getAnimeDetails(id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get anime episodes
exports.getEpisodes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await animeService.getEpisodes(id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get episode streaming sources
exports.getEpisodeSources = async (req, res, next) => {
  try {
    const { id, server = 'hd-1', category = 'sub' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Episode ID is required'
      });
    }

    console.log('Fetching sources with params:', { id, server, category });

    const data = await animeService.getEpisodeSources(id, server, category);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Controller error:', error);
    next(error);
  }
};


// Get category (most-popular, recently-updated, etc.)
exports.getCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    
    const data = await animeService.getCategory(category, page);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
