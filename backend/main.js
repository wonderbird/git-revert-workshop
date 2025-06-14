const http = require("http");
const simpleGit = require("simple-git");

const host = 'localhost';
const port = 5001;

const listCommits = async function (request, response) {
    const options = {
        "from": "HEAD~3",
        "to": "HEAD",
    }
    const logs = await simpleGit().log(options);
    
    const commits = logs.all.map(function(log) {
        return {
            "date": log.date.slice(0, 10),
            "time": log.date.slice(11, 19),
            "author": log.author_name,
            "message": log.message,

        };
    });

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.end(JSON.stringify(commits));
};

const server = http.createServer(listCommits);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
