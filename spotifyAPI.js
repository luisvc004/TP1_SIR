import { myconfig } from './myconfig.js';

const spotifyData = document.getElementById('spotifyData');

function fetchSpotifyApi(apiUrl) {
    return fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${myconfig.spotify.ACCESS_TOKEN}`
        }
    }).then(response => response.json());
}

function fetchSpotifyData(artist) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist`;
    fetchSpotifyApi(apiUrl)
        .then(data => {
            const artists = data.artists.items;
            if (artists.length) {
                displayArtists(artists);
            } else {
                clearSpotifyData();
                console.error('No artists found.');
            }
        })
        .catch(error => {
            clearSpotifyData();
            console.error('Error fetching artist:', error);
        });
}

// Função para exibir artistas
function displayArtists(artists) {
    clearSpotifyData();
    artists.forEach((artist) => {
        const artistElement = createArtistElement(artist);
        spotifyData.appendChild(artistElement);
    });
}

// Limpa os dados anteriores
function clearSpotifyData() {
    spotifyData.innerHTML = '';
}

// Cria o elemento HTML para cada artista
function createArtistElement(artist) {
    const artistElement = document.createElement('div');
    artistElement.classList.add('artist-card');
    artistElement.innerHTML = `
        <img src="${artist.images[0]?.url || 'placeholder.png'}" alt="${artist.name}">
        <div class="artist-info">
            <div class="artist-name">${artist.name}</div>
            <button class="profile-btn" onclick="window.location.href='artistProfile.html?id=${artist.id}'">Ver Perfil</button>
        </div>
    `;
    return artistElement;
}

// Exporte a função fetchSpotifyData
export { fetchSpotifyData, fetchSpotifyApi };
