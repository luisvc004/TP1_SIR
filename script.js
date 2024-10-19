import { fetchSpotifyData } from './spotifyAPI.js';
//import { fetchLyrics } from './geniusAPI.js';

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const spotifyData = document.getElementById('spotifyData');
const audioPlayer = document.getElementById('audioPlayer');
const lyricsContainer = document.getElementById('lyrics');

searchBtn.addEventListener('click', () => {
    const artist = searchTerm.value.trim();
    if (artist) fetchSpotifyData(artist);
    else alert('Please enter an artist\'s name.');
});

searchTerm.addEventListener('keypress', (event) => {
    if (event.key === "Enter") searchBtn.click();
});

audioPlayer.addEventListener('ended', () => {
    const allPlayButtons = document.querySelectorAll('.play-btn');
    allPlayButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-play"></i>';
    });
    lyricsContainer.innerHTML = '';
});

//export { fetchLyrics };
