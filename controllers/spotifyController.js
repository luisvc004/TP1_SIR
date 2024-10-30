import { fetchArtistData, fetchArtistProfile, fetchTopTracks, fetchAlbums, fetchAlbumDetails } from '../services/spotifyService.js';

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
    const tracks = await fetchTopTracks(artistId);
    const albums = await fetchAlbums(artistId);
    return { artist, tracks, albums: albums.items };
}

export async function getAlbumDetails(albumId) {
    try {
        const { name, tracks } = await fetchAlbumDetails(albumId);
        return { name, tracks };
    } catch (error) {
        console.error('Error retrieving album details:', error);
        throw error;
    }
}