const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('playlist.db');

db.run('CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)');

exports.getPlaylist = (req, res) => {
  db.all('SELECT * FROM playlist', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch playlist' });
    }

    const playlist = rows.map((row) => ({ id: row.id, title: row.title }));

    return res.json({ playlist });
  });
};

exports.savePlaylist = (req, res) => {
  const file = req.file;

  if (!file) {
     return res.status(400).json({ error: 'Invalid data' });
  }
  
  db.run('INSERT INTO playlist (title) VALUES (?)', [file.filename]);
  
  return res.status(200).json({ message: 'Song saved successfully' });
};

exports.closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
  });
};
