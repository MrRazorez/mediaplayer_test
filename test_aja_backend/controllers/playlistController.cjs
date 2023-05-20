const playlistData = [
  { id: '1', title: 'Song 1' },
  { id: '2', title: 'Song 2' },
  { id: '3', title: 'Song 3' },
  { id: '4', title: 'Song 4' },
  { id: '5', title: 'Song 5' },
  { id: '6', title: 'Song 6' },
];

exports.getPlaylist = (req, res) => {
  res.json({playlist: playlistData});
}