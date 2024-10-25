import { myconfig } from './myconfig.js';

const artistInfoDiv = document.getElementById('artistInfo');
const artistNameElement = document.getElementById('artistName');

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

function displayArtistProfile(artist) {
    artistNameElement.textContent = artist.name;
    artistInfoDiv.innerHTML = `
        <img src="${artist.images[0]?.url || 'default-image-url.jpg'}" alt="${artist.name}" class="artist-image">
        <p><strong>Followers:</strong> ${artist.followers.total}</p>
        <p><strong>Genres:</strong> ${artist.genres.join(', ')}</p>
        <p><strong>Popularity:</strong> ${artist.popularity}</p>
        <p><strong>External URL:</strong> <a href="${artist.external_urls.spotify}" target="_blank">Spotify Profile</a></p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const artistId = getArtistIdFromUrl();
    if (artistId) {
        fetchArtistProfile(artistId)
            .then(artist => displayArtistProfile(artist))
            .catch(error => console.error('Error fetching artist profile:', error));
    } else {
        artistInfoDiv.innerHTML = '<p>No artist ID found.</p>';
    }
});
