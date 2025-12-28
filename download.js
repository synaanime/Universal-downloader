const ytDlp = require('yt-dlp-exec');

export default async function handler(req, res) {
    const { url, type } = req.query;

    if (!url) return res.status(400).send('No URL provided');

    // Headers to force the browser to download the file
    res.setHeader('Content-Disposition', `attachment; filename="media-${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}"`);

    try {
        // We use the exec process to stream stdout directly to the response (res)
        const subprocess = ytDlp.exec(url, {
            output: '-',
            format: type === 'audio' ? 'bestaudio' : 'best',
            noCheckCertificates: true,
            noWarnings: true,
        });

        // Pipe the video data directly to the user
        subprocess.stdout.pipe(res);

        subprocess.on('error', (err) => {
            console.error(err);
            if (!res.headersSent) res.status(500).send('Extraction failed');
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
