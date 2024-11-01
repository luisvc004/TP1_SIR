import express from 'express';
import wikipediaController from '../controllers/wikipediaController.js';

const WikipediaRouter = (() => {
    const router = express.Router();

    router.get('/wikipedia', wikipediaController.searchWikipedia);
    router.get('/article/:title', wikipediaController.getArticleContent);
    router.get('/biography', wikipediaController.getBiography);

    return router;
})();

export default WikipediaRouter;
