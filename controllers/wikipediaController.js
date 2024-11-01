import wikipediaService from '../services/wikipediaService.js';

const WikipediaController = {
    searchWikipedia: async (req, res) => {
        const { term } = req.query;

        if (!term) {
            return res.status(400).json({ error: 'Search term is required.' });
        }

        try {
            const results = await wikipediaService.fetchWikipediaData(term);
            res.json(results);
        } catch (error) {
            console.error('Error in controller:', error);
            res.status(500).json({ error: 'Error fetching data from Wikipedia.' });
        }
    },

    getArticleContent: async (req, res) => {
        const { title } = req.params;

        try {
            const content = await wikipediaService.fetchArticleContent(title);
            res.send(content);
        } catch (error) {
            console.error('Error in controller:', error);
            res.status(500).json({ error: 'Error fetching article content.' });
        }
    }
};

export default WikipediaController;
