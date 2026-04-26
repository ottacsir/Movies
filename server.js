const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
    const readData = () => {
        const data = fs.readFileSync('movies.json');
        return JSON.parse(data);
    };
    const writeData = (data) => {
        fs.writeFileSync('movies.json', JSON.stringify(data, null, 2));
    };

    // GET
    if (req.method === 'GET' && req.url === '/movies') {
        const movies = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
    }
    else if (req.method === 'GET' && req.url.startsWith('/movies/')) {
        const id = parseInt(req.url.split('/')[2]);
        const movies = readData();
        const movie = movies.find(m => m.id === id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie || { message: "Not found" }));
    }

    