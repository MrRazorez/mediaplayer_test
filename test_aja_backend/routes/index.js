const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController.cjs');
const playlistController = require('../controllers/playlistController.cjs');

router.get('/music', musicController.getMusic);
router.get('/playlist', playlistController.getPlaylist);

module.exports = router;
