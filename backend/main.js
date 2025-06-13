const http = require("http");

const host = 'localhost';
const port = 5001;

const listCommits = function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(JSON.stringify([
        { "date": "2025-06-13", "time": "12:37", "message": "feat: acknowledge order" },
        { "date": "2025-06-13", "time": "11:54", "message": "feat: submit order" },
        { "date": "2025-06-13", "time": "10:13", "message": "feat: create contact" }
    ]));
};

const server = http.createServer(listCommits);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
