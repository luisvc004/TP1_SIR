const WikipediaService = {
    baseUrl: 'https://en.wikipedia.org/w/api.php',

    fetchWikipediaData: async function(term) {
        const url = `${this.baseUrl}?action=query&list=search&srsearch=${encodeURIComponent(term)}&utf8=&format=json&origin=*`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data from Wikipedia');
            }
            const data = await response.json();
            return data.query.search;
        } catch (error) {
            throw new Error('Error fetching data from Wikipedia: ' + error.message);
        }
    },

    fetchArticleContent: async function(title) {
        const url = `${this.baseUrl}?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch article content');
            }
            const data = await response.json();
            return data.parse.text['*'];
        } catch (error) {
            throw new Error('Error fetching article content: ' + error.message);
        }
    }
};

export default WikipediaService;
