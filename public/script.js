import { handleArtistSearch } from '../controllers/spotifyController.js';
import { displayArtists } from './artistProfile.js'

const searchBtn = document.getElementById('searchBtn');
const searchTerm = document.getElementById('searchTerm');
const voiceBtn = document.getElementById('voiceBtn');
let isListening = false;
let inactivityTimeout;

searchBtn.addEventListener('click', async () => {
    const artist = searchTerm.value.trim();
    if (artist) {
        try {
            const artists = await handleArtistSearch(artist);
            displayArtists(artists);
        } catch (error) {
            console.error('Error fetching artist:', error);
            alert('Failed to fetch artists. Please try again.');
        }
    } else {
        alert('Please enter an artist\'s name.');
    }
});

searchTerm.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

function startVoiceRecognition() {
    if (annyang) {
        if (!isListening) {
            const commands = {
                'search *term': function(term) {
                    searchTerm.value = term;
                    handleArtistSearch(term).then(artists => {
                        displayArtists(artists);
                    }).catch(error => {
                        console.error('Error fetching artist:', error);
                        alert('Failed to fetch artists. Please try again.');
                    });
                },
            };
            
            annyang.addCommands(commands);
            annyang.start({ autoRestart: false, continuous: true });

            searchTerm.value = "Listening...";
            searchTerm.classList.add('listening');
            isListening = true;

            annyang.addCallback('result', function(phrases) {
                if (phrases.length > 0) {
                    searchTerm.value = phrases[0];
                    handleArtistSearch(phrases[0]).then(artists => {
                        displayArtists(artists);
                    }).catch(error => {
                        console.error('Error fetching artist:', error);
                        alert('Failed to fetch artists. Please try again.');
                    });
                }
                resetInactivityTimeout();
            });

            annyang.addCallback('end', function() {
                searchTerm.classList.remove('listening');
                searchTerm.value = '';
            });

            function resetInactivityTimeout() {
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    annyang.abort();
                    searchTerm.classList.remove('listening');
                }, 4000);
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

function hideProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.style.display = 'none';
}

document.getElementById('profileBtn').addEventListener('click', function() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('mainContainer').classList.add('moved');
    const playlistsContainer = document.getElementById('playlistsContainer');
    playlistsContainer.style.display = 'block';
    loadStaticPlaylists();
    hideProfileMenu();
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('mainContainer').classList.remove('moved');
    const playlistsContainer = document.getElementById('playlistsContainer');
    playlistsContainer.style.display = 'none';
    hideProfileMenu();
});

function loadStaticPlaylists() {
    const playlistsList = document.getElementById('playlistsList');
    playlistsList.innerHTML = '';

    const playlists = [
        'Playlist de Verão',
        'Top 50 Hits',
        'Clássicos dos Anos 80',
        'Rock dos Anos 90',
        'Música Chill para Estudar'
    ];

    playlists.forEach(playlist => {
        const li = document.createElement('li');
        li.textContent = playlist;
        playlistsList.appendChild(li);
    });
}

voiceBtn.addEventListener('click', startVoiceRecognition);