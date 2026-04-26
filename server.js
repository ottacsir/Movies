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

    // POST
    else if (req.method === 'POST' && req.url === '/movies') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newMovie = JSON.parse(body);
            const movies = readData();
            newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;
            movies.push(newMovie);
            writeData(movies);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newMovie));
        });
    }

    // PUT
    else if (req.method === 'PUT' && req.url.startsWith('/movies/')) {
        const id = parseInt(req.url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            const movies = readData();
            const index = movies.findIndex(m => m.id === id);
            if (index !== -1) {
                movies[index] = { ...movies[index], ...updatedData };
                writeData(movies);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(movies[index]));
            } else {
                res.end(JSON.stringify({ message: "Movie not found" }));
            }
        });
    }

    // DELETE
    else if (req.method === 'DELETE' && req.url.startsWith('/movies/')) {
        const id = parseInt(req.url.split('/')[2]);
        let movies = readData();
        movies = movies.filter(m => m.id !== id);
        writeData(movies);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Deleted successfully" }));
    }
    else {
        res.writeHead(404);
        res.end("Route not found");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});