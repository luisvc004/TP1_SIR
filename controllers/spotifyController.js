import spotifyService from '../services/spotifyService.js';

const artistController = {
    handleArtistSearch: async (artist) => {
        try {
            return await spotifyService.fetchArtistData(artist);
        } catch (error) {
            console.error('Error retrieving artist:', error);
            throw error;
        }
    },

    getArtistData: async (artistId) => {
        const artist = await spotifyService.fetchArtistProfile(artistId);
        const tracks = await spotifyService.fetchTopTracks(artistId);
        const albums = await spotifyService.fetchAlbums(artistId);
        return { artist, tracks, albums: albums.items };
    },

    getAlbumDetails: async (albumId) => {
        try {
            const { name, tracks } = await spotifyService.fetchAlbumDetails(albumId);
            return { name, tracks };
        } catch (error) {
            console.error('Error retrieving album details:', error);
            throw error;
        }
    }
};

export default artistController;
