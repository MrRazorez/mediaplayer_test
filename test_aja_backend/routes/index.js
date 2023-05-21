const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController.cjs');
const playlistController = require('../controllers/playlistController.cjs');

router.get('/music', musicController.getMusic);
router.get('/playlist', playlistController.getPlaylist);
router.post('/playlist', playlistController.savePlaylist);

process.on('SIGINT', () => {
  playlistController.closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  playlistController.closeDatabase();
  process.exit(0);
});

module.exports = router;
