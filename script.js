import { myconfig } from './myconfig.js';

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const spotifyData = document.getElementById('spotifyData');
const audioPlayer = document.getElementById('audioPlayer');

searchBtn.addEventListener('click', () => {
    const artist = searchTerm.value.trim();
    if (artist) fetchSpotifyData(artist);
    else alert('Please enter an artist\'s name.');
});

searchTerm.addEventListener('keypress', (event) => {
    if (event.key === "Enter") searchBtn.click();
});

function fetchSpotifyData(artist) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
    fetch(apiUrl, { headers: { 'Authorization': `Bearer ${myconfig.ACCESS_TOKEN}` } })
        .then(response => response.json())
        .then(data => {
            const artistId = data.artists.items[0]?.id; // retrieves the ID of the first artist found in the search results. 
            if (artistId) getArtistTopTracks(artistId); // The optional chaining operator (?.) ensures that if there are no artists found, it won't throw an error and will simply return undefined.
        })
        .catch(error => console.error('Error fetching artist:', error));
}

function getArtistTopTracks(artistId) {
    const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=PT`; // If you change PT to another country code, you would receive the top tracks relevant to that specific market
    fetch(apiUrl, { headers: { 'Authorization': `Bearer ${myconfig.ACCESS_TOKEN}` } })
        .then(response => response.json())
        .then(data => displayTopTracks(data.tracks))
        .catch(error => console.error('Error fetching popular tracks:', error));
}

function displayTopTracks(tracks) {
    spotifyData.innerHTML = '';
    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('track');
        trackElement.innerHTML = `
            <img src="${track.album.images[0]?.url}" alt="${track.name}">
            <div class="track-info">
                <div class="track-name">${track.name}</div>
                <div class="artist-name">${track.artists.map(artist => artist.name).join(', ')}</div>
            </div>
            <button class="play-btn" ${track.preview_url ? '' : 'disabled'}>
                <i class="fas fa-play"></i>
            </button>
        `;
        spotifyData.appendChild(trackElement);

        const playButton = trackElement.querySelector('.play-btn');
        if (track.preview_url) {
            playButton.addEventListener('click', () => {
                if (audioPlayer.src === track.preview_url) {
                    if (!audioPlayer.paused) {
                        audioPlayer.pause();
                        playButton.innerHTML = '<i class="fas fa-play"></i>';
                    } else {
                        audioPlayer.play();
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    }
                } else {
                    audioPlayer.src = track.preview_url;
                    audioPlayer.play();
                    playButton.innerHTML = '<i class="fas fa-pause"></i>';

                    const allPlayButtons = document.querySelectorAll('.play-btn');
                    allPlayButtons.forEach(btn => {
                        if (btn !== playButton) {
                            btn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    });
                }
            });
        } else {
            playButton.style.cursor = 'not-allowed';
            playButton.title = 'Preview not available';
        }
    });

    audioPlayer.addEventListener('ended', () => {
        const allPlayButtons = document.querySelectorAll('.play-btn');
        allPlayButtons.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
        });
    });
}
