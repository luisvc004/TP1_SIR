import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import spotifyRoutes from './routes/spotifyRoute.js';
//import wikipediaRoutes from './routes/wikipediaRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/spotifyAPI', spotifyRoutes);
//app.use('/api', wikipediaRoutes);

/*
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/services', express.static(path.join(__dirname, 'services')));
*/

// A VER (a partir da raíz), por causa de myconfig.js
app.use(express.static(path.resolve('./')));

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
