const animeService = require('../services/animeService');

exports.getHome = async (req, res, next) => {
  try {
    console.log('📥 Home route hit');
    const data = await animeService.getHomeData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Error in getHome controller:', error.message);
    next(error);
  }
};

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

exports.getEpisodeSources = async (req, res, next) => {
  try {
    const { id, server = 'hd-1', category = 'sub' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Episode ID is required'
      });
    }

    const data = await animeService.getEpisodeSources(id, server, category);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

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
