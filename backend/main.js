const http = require("http");
const simpleGit = require("simple-git");
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 5001;

const requestListener = async function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");

    const ressource = request.url.split("?")[0];
    const environment = new URL(request.url, `http://${host}:${port}`).searchParams.get("environment") || "prod";

    console.log(`${request.method} ${ressource} for environment "${environment}", i.e. branch "${getBranchOf(environment)}"`);

    let statusCode = 200;
    let result = {};

    if (request.method === "GET" && ressource === "/commits") {
        result = await listCommits(environment);
    } else if (request.method === "GET" && ressource === "/workflows") {
        result = listWorkflows();
    } else {
        statusCode = 404;
        result = { error: `Requested resource "${ressource}" not found` };
    }

    response.writeHead(statusCode);
    response.end(JSON.stringify(result));
}

const listCommits = async function (environment) {
    const branch = getBranchOf(environment);
    const options = {
        "from": `${branch}~3`,
        "to": `${branch}`,
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

const getBranchOf = function (environment) {
    switch (environment) {
        case "prod":
            return "main";
        case "test":
            return "develop";
        default:
            return "main";
    }
}

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
