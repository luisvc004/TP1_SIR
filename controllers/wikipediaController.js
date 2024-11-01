import wikipediaService from '../services/wikipediaService.js';

const WikipediaController = {

    getBiography: async (req, res) => {
        const { term } = req.query;
    
        if (!term) {
            console.log('No search term provided');
            return res.status(400).json({ error: 'Search term is required.' });
        }
    
        try {
            const biography = await wikipediaService.fetchCompleteBiography(term);
            return biography;
        } catch (error) {
            console.error('Error in controller while fetching biography:', error);
            return res.status(500).json({ error: 'Error fetching biography data.' });
        }
    }
};

export default WikipediaController;
