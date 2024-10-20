import { fetchSpotifyData } from '../spotifyAPI.js';
import { fetchLastFmData } from '../lastfmAPI.js';

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const artistTitle = document.getElementById('artistTitle');

let inactivityTimeout;

function fetchArtistData(artist) {
    artistTitle.innerText = `"${artist}" Most Popular Songs on Spotify`;
    fetchSpotifyData(artist);
    fetchLastFmData(artist);
}

searchBtn.addEventListener('click', () => {
    const artist = searchTerm.value.trim();
    if (artist) {
        fetchArtistData(artist);
    } else {
        alert('Please enter an artist\'s name.');
    }
});

searchTerm.addEventListener('keypress', (event) => {
    if (event.key === "Enter") searchBtn.click();
});

function startVoiceRecognition() {
    if (annyang) {
        const commands = {
            'search *term': function(term) {
                searchTerm.value = term;
                fetchArtistData(term);
            },
        };

        annyang.addCommands(commands);
        annyang.start();

        searchTerm.value = "Listening...";
        searchTerm.classList.add('listening');

        annyang.addCallback('result', function(phrases) {
            searchTerm.value = phrases[0];
            fetchArtistData(phrases[0]);
            resetInactivityTimeout();
        });

        annyang.addCallback('end', function() {
            searchTerm.classList.remove('listening');
        });

        function resetInactivityTimeout() {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                annyang.abort();
                searchTerm.classList.remove('listening');
            }, 3000);
        }

        resetInactivityTimeout();
        annyang.addCallback('start', resetInactivityTimeout);

    } else {
        console.log('Annyang is not supported in this browser.');
    }
}

document.getElementById('voiceBtn').addEventListener('click', startVoiceRecognition);
