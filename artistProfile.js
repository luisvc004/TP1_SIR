import { myconfig } from './myconfig.js';

const artistInfoDiv = document.getElementById('artistInfo');
const artistNameElement = document.getElementById('artistName');
const topTracksGrid = document.querySelector('.tracks-grid');

function getArtistIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function fetchArtistProfile(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    return fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${myconfig.spotify.ACCESS_TOKEN}`
        }
    }).then(response => response.json());
}

function fetchTopTracks(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
    return fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${myconfig.spotify.ACCESS_TOKEN}`
        }
    }).then(response => response.json());
}

function displayArtistProfile(artist) {
    artistNameElement.textContent = artist.name;
    artistInfoDiv.innerHTML = `
        <img class="artist-profile-img" src="${artist.images[0]?.url || 'default-image-url.jpg'}" alt="${artist.name}">
        <p><strong>Followers:</strong> ${artist.followers.total.toLocaleString()}</p>
        <p><strong>Genres:</strong> ${artist.genres.join(', ')}</p>
        <p><strong>Popularity:</strong> ${artist.popularity}</p>
        <p><strong>Spotify Profile:</strong> <a href="${artist.external_urls.spotify}" target="_blank">Open in Spotify</a></p>
    `;
}

function displayTopTracks(tracks) {
    topTracksGrid.innerHTML = tracks.map(track => `
        <div class="track-card">
            <div class="track-cover">
                <img class="artist-track-img" src="${track.album.images[0].url}" alt="${track.name}">
            </div>
            <div class="track-info">
                <p class="track-title">${track.name}</p>
                <p class="track-album">Album: ${track.album.name}</p>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const artistId = getArtistIdFromUrl();
    if (artistId) {
        fetchArtistProfile(artistId)
            .then(artist => {
                displayArtistProfile(artist);
                return fetchTopTracks(artistId);
            })
            .then(topTracks => displayTopTracks(topTracks.tracks))
            .catch(error => console.error('Error fetching artist data:', error));
    } else {
        artistInfoDiv.innerHTML = '<p>No artist ID found.</p>';
    }
});
