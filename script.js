import { fetchSpotifyData } from '../spotifyAPI.js'; // Certifique-se de que você tem a função fetchSpotifyData importada corretamente

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const spotifyData = document.getElementById('spotifyData'); // Adicionado para referência mais tarde
let inactivityTimeout;
let isListening = false;

// Função que busca os dados do artista e exibe artistas semelhantes
searchBtn.addEventListener('click', () => {
    const artist = searchTerm.value.trim();
    if (artist) {
        fetchSpotifyData(artist); // Chama a função que busca os dados do artista
    } else {
        alert('Please enter an artist\'s name.');
    }
});

// Evento para permitir pesquisa ao pressionar 'Enter'
searchTerm.addEventListener('keypress', (event) => {
    if (event.key === "Enter") searchBtn.click();
});

// Função para iniciar o reconhecimento de voz
function startVoiceRecognition() {
    if (annyang) {
        if (!isListening) {
            const commands = {
                'search *term': function(term) {
                    searchTerm.value = term;
                    fetchSpotifyData(term);
                },
            };
            
            annyang.addCommands(commands);
            annyang.start();

            searchTerm.value = "Listening...";
            searchTerm.classList.add('listening');
            isListening = true;
            
            annyang.addCallback('result', function(phrases) {
                searchTerm.value = phrases[0];
                fetchSpotifyData(phrases[0]);
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

const voiceBtn = document.getElementById('voiceBtn');
voiceBtn.addEventListener('click', startVoiceRecognition);
