const http = require("http");
const simpleGit = require("simple-git");
const fs = require('fs').promises;
const path = require('path');

const host = 'localhost';
const port = 5001;

const requestListener = async function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");

    const resource = request.url.split("?")[0];
    console.log(`Requested resource: ${resource}`);

    const environment = new URL(request.url, `http://${host}:${port}`).searchParams.get("environment") || "prod";

    let statusCode = 200;
    let result = undefined;

    if (request.method !== "GET") {
        statusCode = 405; // Method Not Allowed
        result = { error: `Method ${request.method} not allowed` };
        result = JSON.stringify(result);
    } else if (resource === "/commits") {
        console.log(`Environment: "${environment}" => branch: "${getBranchOf(environment)}"`);
        result = await listCommits(environment);
        result = JSON.stringify(result);
    } else if (resource === "/workflows") {
        console.log(`Environment: "${environment}" => branch: "${getBranchOf(environment)}"`);
        result = await listWorkflows(environment);
        result = JSON.stringify(result);
    } else {
        [statusCode, result] = await serveFile(resource, response);
    }

    response.writeHead(statusCode);
    response.end(result);
}

const serveFile = async function (resource, response) {
    const filePath = path.join(__dirname, 'frontend', resource);

    if (resource === "/") {
        // Default to index.html if the root is requested
        return serveFile('/index.html', response);
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');

        if (resource.endsWith('.html')) {
            response.setHeader("Content-Type", "text/html");
        } else if (resource.endsWith('.js')) {
            response.setHeader("Content-Type", "application/javascript");
        } else if (resource.endsWith('.css')) {
            response.setHeader("Content-Type", "text/css");
        } else {
            response.setHeader("Content-Type", "text/plain");
        }

        return [200, content];
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);

        if (error.code === 'ENOENT') {
            return [404, JSON.stringify({ error: `File not found: ${filePath}` })];
        } else {
            return [500, JSON.stringify({ error: `Internal server error: ${error.message}` })];
        }
    }    
}

const listCommits = async function (environment) {
    const maximumNumberOfCommits = 10;
    const branch = getBranchOf(environment);

    try {
        const logs = await simpleGit().log([`--max-count=${maximumNumberOfCommits}`, branch]);

        return logs.all.map(function(log) {
            return {
                "date": log.date.slice(0, 10),
                "time": log.date.slice(11, 19),
                "author": log.author_name,
                "message": log.message,

            };
        });
    } catch (error) {
        console.error(`Error fetching commits: ${error.message}`);
        return [];
    }
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

const listWorkflows = async function (environment) {
    const branch = getBranchOf(environment);
    const filePath = '../workflows.txt';
    
    try {
        const content = await simpleGit().show([`${branch}:${filePath}`]);
        const workflows = content.split('\n')
                                .filter(line => line.trim() !== '')
                                .reverse()
                                .slice(0, 3);
        return workflows;
    } catch (error) {
        console.error(`Error fetching workflows: ${error.message}`);
        return [];
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
