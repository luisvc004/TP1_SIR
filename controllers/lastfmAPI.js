import { myconfig } from './myconfig.js';

const lastfmData = document.getElementById('lastfmData');

function fetchLastFmData(artist) {
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${myconfig.lastfm.API_KEY}&format=json`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayLastFmData(data);
        })
        .catch(error => console.error('Erro fetch da Last.fm data:', error));
}

function displayLastFmData(data) {
    if (data.artist) {
        const artist = data.artist;
        lastfmData.innerHTML = `
            <div>
                <h3>${artist.name}</h3>
                <p>${artist.bio.summary}</p>
                <p>Popularity: ${artist.stats.listeners} listeners</p>
            </div>
        `;
    } else {
        lastfmData.innerHTML = 'No information available.';
    }
}

export { fetchLastFmData };
