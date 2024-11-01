import express from 'express';
import { handleArtistSearch, getArtistData } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/singers', async (req, res) => {
    const artistName = req.query.name;
    if (!artistName) {
        return res.status(400).json({ error: 'Artist name is required.' });
    }
    try {
        const artists = await handleArtistSearch(artistName);
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving artists.' });
    }
});

router.get('/artist/:id', async (req, res) => {
    const artistId = req.params.id;
    try {
        const artistData = await getArtistData(artistId);
        res.json(artistData);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving artist data.' });
    }
});

export default router;
