import { getArtistData } from '../controllers/spotifyController.js';

const artistInfoDiv = document.getElementById('artistInfo');
const artistNameElement = document.getElementById('artistName');
const albumsContainer = document.getElementById('albumsContainer');
const loadMoreButton = document.getElementById('loadMoreButton');
const spotifyData = document.getElementById('spotifyData');

let displayedAlbums = 0;
const ALBUMS_PER_PAGE = 10;

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

function displayAlbums(albums) {
    const albumsToDisplay = albums.slice(displayedAlbums, displayedAlbums + (displayedAlbums === 0 ? 5 : ALBUMS_PER_PAGE));
    displayedAlbums += albumsToDisplay.length;

    const albumHTML = albumsToDisplay.map(album => `
        <div class="album-card">
            <div class="album-cover">
                <img class="artist-album-img" src="${album.images[0]?.url || placeholderImg}" alt="${album.name}">
            </div>
            <div class="album-info">
                <p class="album-title">${album.name}</p>
                <p class="album-release-date">Release Date: ${album.release_date}</p>
                <p class="album-total-tracks">Total Tracks: ${album.total_tracks}</p>
                <button class="preview-button" onclick="window.location.href='albumDetails.html?albumId=${album.id}'">View Tracks</button>
            </div>
        </div>
    `).join('');

    albumsContainer.insertAdjacentHTML('beforeend', albumHTML);

    if (displayedAlbums >= albums.length) {
        loadMoreButton.style.display = 'none';
    }
}

async function loadMoreAlbums() {
    const artistId = getArtistIdFromUrl();
    try {
        const { albums } = await getArtistData(artistId);
        displayAlbums(albums);
    } catch (error) {
        console.error('Error fetching more albums:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const artistId = getArtistIdFromUrl();
    if (artistId && artistInfoDiv) {
        try {
            const { artist, albums } = await getArtistData(artistId);
            displayArtistProfile(artist);
            displayAlbums(albums);
        } catch (error) {
            console.error('Error fetching artist data:', error);
            artistInfoDiv.innerHTML = '<p>Error loading artist data.</p>';
        }
    } else if (artistInfoDiv) {
        artistInfoDiv.innerHTML = '<p>Artist ID not found.</p>';
    }

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreAlbums);
    }
});
