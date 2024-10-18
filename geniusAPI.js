import { myconfig } from './myconfig.js';

const lyricsContainer = document.getElementById('lyrics');

function fetchLyrics(songName, artistName) {
    const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(songName + ' ' + artistName)}&access_token=${myconfig.genius.ACCESS_TOKEN}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const song = data.response.hits[0]?.result;
            if (song) {
                displayLyrics(song.url);
            } else {
                lyricsContainer.innerHTML = 'Lyrics not found.';
            }
        })
        .catch(error => console.error('Error fetching lyrics:', error));
}

function displayLyrics(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const lyrics = doc.querySelector('.lyrics');
            lyricsContainer.innerHTML = lyrics ? lyrics.innerHTML : 'Lyrics not found.';
        })
        .catch(error => console.error('Error displaying lyrics:', error));
}

export { fetchLyrics };
