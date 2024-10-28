import { fetchArtistData, fetchArtistProfile, fetchTopTracks } from '../services/spotifyService.js';

export async function handleArtistSearch(artist) {
    try {
        return await fetchArtistData(artist);
    } catch (error) {
        console.error('Error retrieving artist:', error);
        throw error;
    }
}

export async function getArtistData(artistId) {
    const artist = await fetchArtistProfile(artistId);
    const topTracks = await fetchTopTracks(artistId);
    return { artist, topTracks: topTracks.tracks };
}