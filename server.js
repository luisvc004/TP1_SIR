import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import spotifyRoutes from './routes/spotifyRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/services', express.static(path.join(__dirname, 'services')));

app.use('/spotifyAPI', spotifyRoutes);

// A VER (a partir da raíz), por causa de myconfig.js
app.use(express.static(path.resolve('./')));

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
