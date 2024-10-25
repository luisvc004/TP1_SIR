import { fetchSpotifyData } from '../spotifyAPI.js';

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const artistTitle = document.getElementById('artistTitle');

let inactivityTimeout;
let isListening = false;

function fetchArtistData(artist) {
    fetchSpotifyData(artist);
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
        if(!isListening){
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
            isListening = true;
            
            annyang.addCallback('result', function(phrases) {
                searchTerm.value = phrases[0];
                fetchArtistData(phrases[0]);
                resetInactivityTimeout();
            });
            
            function resetInactivityTimeout() {
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    annyang.abort();
                    searchTerm.classList.remove('listening');
                    searchTerm.value = '';
                    isListening = false;
                }, 3000);
            }
            
            resetInactivityTimeout();
            annyang.addCallback('start', resetInactivityTimeout);
        
        } else {
            annyang.abort();
            searchTerm.classList.remove('listening');
            searchTerm.value = '';
            isListening = false;
        }
    } else {
        console.log('Annyang is not supported in this browser.');
    }
}

voiceBtn.addEventListener('click', startVoiceRecognition);