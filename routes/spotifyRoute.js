import express from 'express';
import spotifyService from '../services/spotifyService.js';

const router = express.Router();

router.get('/singers', async (req, res) => {
    const artistName = req.query.name;

    if (!artistName) {
        return res.status(400).json({ error: 'Artist name is required.' });
    }

    try {
        const handleArtistSearch = async (artist) => {
            return await spotifyService.fetchArtistData(artist);
        };

        const artists = await handleArtistSearch(artistName);
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving artists.' });
    }
});

router.get('/artist/:id', async (req, res) => {
    const artistId = req.params.id;

    try {
        const getArtistData = async (artistId) => {
            const artist = await spotifyService.fetchArtistProfile(artistId);
            const tracks = await spotifyService.fetchTopTracks(artistId);
            const albums = await spotifyService.fetchAlbums(artistId);
            return { artist, tracks, albums: albums.items };
        };

        const artistData = await getArtistData(artistId);
        res.json(artistData);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving artist data.' });
    }
});

router.get('/album/:id', async (req, res) => {
    const albumId = req.params.id;

    try {
        const getAlbumDetails = async (albumId) => {
            const albumData = await spotifyService.fetchAlbumDetails(albumId);
            return albumData;
        };

        const albumData = await getAlbumDetails(albumId);
        res.json(albumData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching album details.' });
    }
});

export default router;
