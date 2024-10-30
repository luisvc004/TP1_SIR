import { fetchArtistData, fetchArtistProfile, fetchTopTracks, fetchAlbums, getAlbumTracks } from '../services/spotifyService.js';

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
        const { items: tracks } = await getAlbumTracks(albumId);
        return { tracks };
    } catch (error) {
        console.error('Error retrieving album details:', error);
        throw error;
    }
}