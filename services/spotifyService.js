import { myconfig } from '../myconfig.js';

const SPOTIFY_ACCESS_TOKEN = myconfig.spotify.ACCESS_TOKEN;

async function fetchSpotifyApi(apiUrl) {
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${SPOTIFY_ACCESS_TOKEN}`
        }
    });
    return await response.json();
}

export async function fetchArtistProfile(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    return fetchSpotifyApi(apiUrl);
}

export async function fetchTopTracks(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
    return fetchSpotifyApi(apiUrl);
}
    
export async function fetchArtistData(artist) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist`;
    try {
        const data = await fetchSpotifyApi(apiUrl);
        const artists = data.artists.items;
        if (!artists.length) {
            throw new Error('No artists found!');
        }
        return artists;
    } catch (error) {
        console.error('Error fetching artist data:', error.message);
        throw new Error('Could not fetch artist data. Please try again later.');
    }
}