const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('playlist.db');

db.run('CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, song TEXT)');

exports.getPlaylist = (req, res) => {
  db.all('SELECT * FROM playlist', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch playlist' });
    }

    const playlist = rows.map((row) => ({ id: row.id, title: row.title, song: row.song }));

    return res.json({ playlist });
  });
};

exports.savePlaylist = async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    await db.run('INSERT INTO playlist (title, song) VALUES (?, ?)', [
      title,
      file.filename,
    ]);
    res.status(200).json({ message: 'Song saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save song' });
  }
};

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
  });
};
