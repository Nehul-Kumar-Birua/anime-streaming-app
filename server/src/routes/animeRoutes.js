const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

// Get home page data
router.get('/home', animeController.getHome);

// Search anime
router.get('/search', animeController.searchAnime);

// Get anime details
router.get('/:id', animeController.getAnimeDetails);

// Get anime episodes
router.get('/:id/episodes', animeController.getEpisodes);

// Get episode streaming sources
router.get('/episode/sources', animeController.getEpisodeSources);

// Get category
router.get('/category/:category', animeController.getCategory);

module.exports = router;
