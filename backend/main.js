const http = require("http");
const simpleGit = require("simple-git");
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 5001;

const requestListener = async function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");

    if (request.method === "GET" && request.url === "/commits") {
        const commits = await listCommits();
        response.writeHead(200);
        response.end(JSON.stringify(commits));
    } else if (request.method === "GET" && request.url === "/workflows") {
        const workflows = await listWorkflows();
        response.writeHead(200);
        response.end(JSON.stringify(workflows));
    } else {
        response.writeHead(404);
        response.end(JSON.stringify({ error: "Not Found" }));
    }
}

const listCommits = async function () {
    const options = {
        "from": "HEAD~3",
        "to": "HEAD",
    }
    const logs = await simpleGit().log(options);
    
    return logs.all.map(function(log) {
        return {
            "date": log.date.slice(0, 10),
            "time": log.date.slice(11, 19),
            "author": log.author_name,
            "message": log.message,

        };
    });
};

const listWorkflows = function () {
    try {
        const numberOfWorkflows = 3;
        const filePath = path.join(__dirname, '..', 'workflows.txt');
        
        const content = fs.readFileSync(filePath, 'utf-8');

        const workflows = content.split('\n')
                                .filter(line => line.trim() !== '')
                                .reverse()
                                .slice(0, numberOfWorkflows);
        return workflows;
    } catch(error) {
        console.error(error.message);
        return [];
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
