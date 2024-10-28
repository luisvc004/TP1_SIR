import { getArtistData } from '../controllers/spotifyController.js';

const artistInfoDiv = document.getElementById('artistInfo');
const artistNameElement = document.getElementById('artistName');
const topTracksGrid = document.querySelector('.tracks-grid');
const spotifyData = document.getElementById('spotifyData');

function getArtistIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function clearSpotifyData() {
    spotifyData.innerHTML = '';
}

export function displayArtists(artists) {
    clearSpotifyData();
    artists.forEach(artist => {
        const artistElement = createArtistElement(artist);
        spotifyData.appendChild(artistElement);
    });
}

function createArtistElement(artist) {
    const artistElement = document.createElement('div');
    artistElement.classList.add('artist-card');
    artistElement.innerHTML = `
        <img src="${artist.images[0]?.url || 'assets/images/placeholder.png'}" alt="${artist.name}">
        <div class="artist-info">
            <div class="artist-name">${artist.name}</div>
            <button class="profile-btn" onclick="window.location.href='artistProfile.html?id=${artist.id}'">View Profile</button>
        </div>
    `;
    return artistElement;
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

document.addEventListener('DOMContentLoaded', async () => {
    const artistId = getArtistIdFromUrl();
    if (artistId && artistInfoDiv) {
        try {
            const { artist, topTracks } = await getArtistData(artistId);
            displayArtistProfile(artist);
            displayTopTracks(topTracks);
        } catch (error) {
            console.error('Error fetching artist data:', error);
            artistInfoDiv.innerHTML = '<p>Error loading artist data.</p>';
        }
    } else if (artistInfoDiv) {
        artistInfoDiv.innerHTML = '<p>Artist ID not found.</p>';
    }
});