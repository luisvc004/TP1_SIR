const WikipediaService = {
    baseUrl: 'https://en.wikipedia.org/w/api.php',

    fetchCompleteBiography: async function(term) {
        const url = `${this.baseUrl}?action=query&titles=${encodeURIComponent(term)}&prop=extracts|info&explaintext&inprop=url&format=json&origin=*`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch complete biography from Wikipedia');
            }
    
            const data = await response.json();
            const page = Object.values(data.query.pages)[0];
    
            if (page && page.extract) {
                const paragraphs = page.extract.split('\n');
                return {
                    firstParagraph: paragraphs[0],
                    link: page.fullurl
                };
            } else {
                throw new Error('No content found for the specified term.');
            }
        } catch (error) {
            throw new Error('Error fetching complete biography: ' + error.message);
        }
    }
};

export default WikipediaService;
