const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {

    let filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error: ${err.code}`);
            console.error(`Error reading the file: ${err.code}`);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
            console.log(`Request received for: ${req.url}`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
