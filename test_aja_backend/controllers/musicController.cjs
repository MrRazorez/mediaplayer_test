const fs = require('fs');

exports.getMusic = (req, res) => {
    const musicPath = `uploads/${req.params.song}`;
    const stat = fs.statSync(musicPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const CONTENT_TYPE = 'audio/mpeg';

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(musicPath, { start, end });
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': CONTENT_TYPE,
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': CONTENT_TYPE,
        };

        res.writeHead(200, head);
        fs.createReadStream(musicPath).pipe(res);
    }
};
