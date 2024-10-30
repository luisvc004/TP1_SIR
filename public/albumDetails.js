import { getAlbumDetails } from '../controllers/spotifyController.js';

const albumNameElement = document.getElementById('albumName');
const albumTracksContainer = document.getElementById('albumTracks');
const audioPlayer = new Audio();
let isPlaying = false;
let currentTrackIndex = -1;

/*const playlists = [
    { id: 1, name: "Minha Playlist 1" },
    { id: 2, name: "Minha Playlist 2" },
    { id: 3, name: "Minha Playlist 3" }
];*/

function getAlbumIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('albumId');
    return albumId.trim();
}

async function loadAlbumDetails() {
    const albumId = getAlbumIdFromUrl();
    try {
        const albumDetails = await getAlbumDetails(albumId);
        const albumName = albumDetails.name;
        const tracks = albumDetails.tracks;
        
        if (!tracks) {
            throw new Error('No tracks found');
        }
        
        displayAlbumDetails({ name: 'Album Name: ' + albumName }); 
        displayTracks(tracks);
    } catch (error) {
        console.error('Error fetching album details:', error);
        albumTracksContainer.innerHTML = '<p>Error loading album details.</p>';
    }
}

function displayAlbumDetails(album) {
    albumNameElement.textContent = album.name;
}

function displayTracks(tracks) {
    const tracksHTML = tracks.map((track) => `
        <div class="track">
            <p class="track-title">${track.name}</p>
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
    `).join('');
    
    albumTracksContainer.innerHTML = tracksHTML;

    const playButtons = albumTracksContainer.querySelectorAll('.play-btn');
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
    return albumTracksContainer.querySelectorAll('.play-btn')[currentTrackIndex];
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

document.addEventListener('DOMContentLoaded', loadAlbumDetails);
