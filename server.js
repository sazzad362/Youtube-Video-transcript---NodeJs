const express = require('express');
const ytdl    = require('ytdl-core');
const { getSubtitles } = require('youtube-captions-scraper');
const app = express();
const port = 3010; 
app.get('/transcript', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL.' });
  }
  try {
    const videoId = ytdl.getVideoID(videoUrl);
    const info    = await ytdl.getInfo(videoId);
    const transcript = await getSubtitles({
      videoID: videoId,
      lang: 'en'
    });
    const transcriptText = transcript.map(entry => entry.text).join('\n');
    res.send({
      videoTitle: info.videoDetails.title,
      transcript: transcriptText
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});