const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController.cjs');
const playlistController = require('../controllers/playlistController.cjs');

const fs = require('fs');
const multer = require('multer');

const folderName = 'uploads';

if (!fs.existsSync(folderName)) {
  try {
    fs.mkdirSync(folderName);
    console.log('Folder berhasil dibuat');
  } catch (err) {
    console.error(err);
  }
} else {
  console.log('Folder sudah ada');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${folderName}/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'audio/mpeg');
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


router.get('/music/:song', musicController.getMusic);
router.get('/playlist', playlistController.getPlaylist);
router.post('/playlist', upload.single('song'), playlistController.savePlaylist);

module.exports = router;
