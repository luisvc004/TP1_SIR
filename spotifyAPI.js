import { myconfig } from './myconfig.js';

const spotifyData = document.getElementById('spotifyData');
const audioPlayer = document.getElementById('audioPlayer');
let currentTrackIndex = 0;
let tracksList = [];

function fetchSpotifyApi(apiUrl) {
    return fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${myconfig.spotify.ACCESS_TOKEN}`
        }
    }).then(response => response.json());
}

function fetchSpotifyData(artist) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
    fetchSpotifyApi(apiUrl)
        .then(data => {
            const artistId = data.artists.items[0]?.id; // retrieves the ID of the first artist found in the search results. 
            if (artistId) getArtistTopTracks(artistId);  // The optional chaining operator (?.) ensures that if there are no artists found, it won't throw an error and will simply return undefined.
        })
        .catch(error => console.error('Error fetching artist:', error));
}

function getArtistTopTracks(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=PT`; // If you change PT to another country code, you would receive the top tracks relevant to that specific market
    fetchSpotifyApi(apiUrl)
        .then(data => {
            tracksList = data.tracks;
            displayTopTracks(tracksList);
        })
        .catch(error => console.error('Error fetching popular tracks:', error));
}

function displayTopTracks(tracks) {
    clearSpotifyData();
    tracks.forEach((track, index) => {
        const trackElement = createTrackElement(track, index);
        spotifyData.appendChild(trackElement);
    });
}

function clearSpotifyData() {
    spotifyData.innerHTML = '';
}

function createTrackElement(track, index) {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    trackElement.innerHTML = `
        <img src="${track.album.images[0]?.url}" alt="${track.name}">
        <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="artist-name">${track.artists.map(artist => artist.name).join(', ')}</div>
            <div class="album-name">Album: ${track.album.name}</div>
            <div class="release-date">Release Date: ${track.album.release_date}</div>
            <div class="popularity">Popularity: ${track.popularity}</div>
        </div>
        <button class="play-btn" ${track.preview_url ? '' : 'disabled'}>
            <i class="fas fa-play"></i>
        </button>
    `;
    setUpPlayButton(track, trackElement, index);
    return trackElement;
}

function setUpPlayButton(track, trackElement, index) {
    const playButton = trackElement.querySelector('.play-btn');
    if (track.preview_url) {
        playButton.addEventListener('click', () => handlePlayButtonClick(track, playButton, index));
    } else {
        disablePlayButton(playButton);
    }
}

function disablePlayButton(playButton) {
    playButton.style.cursor = 'not-allowed';
    playButton.title = 'Preview not available';
}


function handlePlayButtonClick(track, playButton, index) {
    currentTrackIndex = index;
    if (audioPlayer.src === track.preview_url) {
        togglePlayPause(playButton);
    } else {
        playNewTrack(track.preview_url, playButton);
    }
}

function togglePlayPause(playButton) {
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function playNewTrack(previewUrl, playButton) {
    audioPlayer.src = previewUrl;
    audioPlayer.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
    updateAllPlayButtons(playButton);
}

function updateAllPlayButtons(currentButton) {
    const allPlayButtons = document.querySelectorAll('.play-btn');
    allPlayButtons.forEach(btn => {
        if (btn !== currentButton) {
            btn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

function handleKeyboardControls(event) {
    const keyActions = {
        Space: () => togglePlayPause(getCurrentPlayButton()),
        MediaTrackNext: playNextTrack,
        MediaTrackPrevious: playPreviousTrack,
        ArrowRight: playNextTrack,
        ArrowLeft: playPreviousTrack
    };

    if (keyActions[event.code]) {
        event.preventDefault();
        keyActions[event.code]();
    }
}

function getCurrentPlayButton() {
    return document.querySelectorAll('.play-btn')[currentTrackIndex];
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracksList.length;
    playTrackAtIndex(currentTrackIndex);
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracksList.length) % tracksList.length;
    playTrackAtIndex(currentTrackIndex);
}

function playTrackAtIndex(index) {
    const track = tracksList[index];
    audioPlayer.src = track.preview_url;
    updatePlayButtons();
    highlightCurrentTrack(index);
    scrollToCurrentTrack(index);
}

function highlightCurrentTrack(index) {
    document.querySelectorAll('.track').forEach((trackElement, i) => {
        trackElement.classList.toggle('current-track', i === index);
    });
}

function scrollToCurrentTrack(index) {
    const currentTrackElement = document.querySelectorAll('.track')[index];
    if (currentTrackElement) {
        currentTrackElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function updatePlayButtons() {
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

window.addEventListener('keydown', handleKeyboardControls);

export { fetchSpotifyData };