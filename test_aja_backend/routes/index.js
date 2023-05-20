const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController.cjs');

router.get('/music', musicController.getMusic);

module.exports = router;
