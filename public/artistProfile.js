import { getArtistData } from '../controllers/spotifyController.js';

const artistInfoDiv = document.getElementById('artistInfo');
const artistNameElement = document.getElementById('artistName');
const tracksContainer = document.getElementById('tracksContainer');
const albumsContainer = document.getElementById('albumsContainer');
const spotifyData = document.getElementById('spotifyData');

const audioPlayer = new Audio();
let isPlaying = false;
let currentTrackIndex = -1;

/*const playlists = [
    { id: 1, name: "Minha Playlist 1" },
    { id: 2, name: "Minha Playlist 2" },
    { id: 3, name: "Minha Playlist 3" }
];*/

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

function displayTracks(tracks) {
    const tracksHTML = tracks.map((track) => `
    <div class="track-card">
        <img src="${track.album.images[0]?.url}" alt="${track.album.name}">
        <div class="track-info">
            <p class="track-title">${track.name}</p>
            <p class="album-name">Album: ${track.album.name}</p>
            <p class="popularity">Popularity: ${track.popularity}</p>
            <div class="button-container">
                <button class="play-btn" data-preview-url="${track.preview_url}" ${track.preview_url ? '' : 'disabled'}>
                    <i class="fas fa-play"></i>
                </button>
                <div class="add-to-playlist">
                    <button class="add-to-playlist-btn" data-track-id="${track.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    ${'' /* <div class="playlist-dropdown" style="display: none;">
                        ${playlists.map(playlist => `
                            <div class="playlist-item" data-playlist-id="${playlist.id}">
                                ${playlist.name}
                            </div>
                        `).join('')}
                    </div> */} 
                </div>
            </div>
        </div>
    </div>
    
    `).join('');

    tracksContainer.innerHTML = tracksHTML;

    const playButtons = tracksContainer.querySelectorAll('.play-btn');
    playButtons.forEach((button, index) => {
        button.addEventListener('click', () => handlePlayButtonClick(tracks[index], button, index));
    });

    /*const addToPlaylistButtons = albumTracksContainer.querySelectorAll('.add-to-playlist-btn');
    addToPlaylistButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            const dropdown = event.currentTarget.nextElementSibling;
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            addPlaylistSelectionEvent(dropdown, tracks[index]);
        });
    });*/
}

/*function addPlaylistSelectionEvent(dropdown, track) {
    const playlistItems = dropdown.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            addToPlaylist(track.name, item.dataset.playlistId);
            dropdown.style.display = 'none';
        });
    });
}*/

function handlePlayButtonClick(track, playButton, index) {
    if (audioPlayer.src === track.preview_url && isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayButton(playButton, false);
    } else {
        if (isPlaying) {
            audioPlayer.pause();
            updatePlayButton(getCurrentPlayButton(), false);
        }
        
        audioPlayer.src = track.preview_url;
        audioPlayer.play().then(() => {
            isPlaying = true;
            currentTrackIndex = index;
            updatePlayButton(playButton, true);
        }).catch(error => {
            console.error('Error playing track:', error);
        });
    }
}

function getCurrentPlayButton() {
    return tracksContainer.querySelectorAll('.play-btn')[currentTrackIndex];
}

function updatePlayButton(playButton, isPlaying) {
    playButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

/*function addToPlaylist(trackName, playlistId) {
    const notification = document.getElementById('notification');
    notification.textContent = `The track "${trackName}" has been added to your playlist!`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.visibility = 'hidden';
        }, 500);
    }, 5000);
}*/

function displayAlbums(albums) {
    const albumHTML = albums.map(album => `
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

    albumsContainer.innerHTML = albumHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
    const artistId = getArtistIdFromUrl();
    if (artistId && artistInfoDiv) {
        try {
            const { artist, tracks, albums } = await getArtistData(artistId);
            displayArtistProfile(artist);
            displayTracks(tracks);
            displayAlbums(albums);
        } catch (error) {
            console.error('Error fetching artist data:', error);
            artistInfoDiv.innerHTML = '<p>Error loading artist data.</p>';
        }
    } else if (artistInfoDiv) {
        artistInfoDiv.innerHTML = '<p>Artist ID not found.</p>';
    }
});
