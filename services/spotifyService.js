import { myconfig } from '../myconfig.js';

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = myconfig.spotify;
let SPOTIFY_ACCESS_TOKEN = myconfig.spotify.ACCESS_TOKEN;

async function refreshAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error refreshing access token:', response.statusText, errorMessage);
        throw new Error('Could not refresh access token.');
    }

    const { access_token } = await response.json();
    SPOTIFY_ACCESS_TOKEN = access_token;
    return access_token;
}

async function fetchSpotifyApi(apiUrl) {
    if (!SPOTIFY_ACCESS_TOKEN) {
        await refreshAccessToken();
    }

    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${SPOTIFY_ACCESS_TOKEN}`
        }
    });

    if (response.status === 401) {
        await refreshAccessToken();
        return fetchSpotifyApi(apiUrl);
    }

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error fetching data:', response.status, errorMessage);
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    
    return await response.json();
}

export async function fetchArtistProfile(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    return fetchSpotifyApi(apiUrl);
}

export async function fetchTopTracks(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
    const data = await fetchSpotifyApi(apiUrl);
    return data.tracks;
}

export async function fetchAlbums(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US`;
    return fetchSpotifyApi(apiUrl);
}

export async function fetchAlbumDetails(albumId) {
    const apiUrl = `https://api.spotify.com/v1/albums/${albumId}`;
    const albumData = await fetchSpotifyApi(apiUrl);
    
    const albumName = albumData.name;
    const tracks = albumData.tracks.items;

    return { name: albumName, tracks };
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