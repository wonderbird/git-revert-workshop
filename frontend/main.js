(async () => {
  const baseUrl = 'http://localhost:5001/';
  
  registerButton(baseUrl, 'prod');
  registerButton(baseUrl, 'test');

  await update(baseUrl, 'prod');
})();

function registerButton(baseUrl, environment) {
  const button = document.getElementById(environment);
  if (button) {
    button.addEventListener('click', async () => await update(baseUrl, environment));
  }
}

async function update(baseUrl, environment) {
  try {
    await listRecentlyDeployedWorkflows(baseUrl, environment);
    await listRecentCommits(baseUrl, environment);
  } catch (error) {
    console.error('Error refreshing data:', error.message);
  }
}

async function listRecentlyDeployedWorkflows(baseUrl, environment) {
  const workflows = await get(`${baseUrl}workflows?environment=${environment}`);
  displayWorkflows(workflows);
}

async function get(url) {
  const request = new Request(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

function displayWorkflows(workflows) {
  const workflowList = document.getElementById('workflows');
  if (workflowList) {
    workflowList.innerHTML = '';
  }
  workflows.forEach(displayWorkflow);
}

function displayWorkflow(workflow) {
  const workflowList = document.getElementById('workflows');

  if (workflowList) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = workflow;
    workflowList.appendChild(listItem);
  }
}

async function listRecentCommits(baseUrl, environment) {
  const commits = await get(`${baseUrl}commits?environment=${environment}`);
  displayCommits(commits);
}

function displayCommits(commits) {
  const commitList = document.getElementById('commits');
  if (commitList) {
    commitList.innerHTML = '';
  }
  commits.forEach(displayCommit);
}

function displayCommit(commit) {
  const commitList = document.getElementById('commits');

  if (commitList) {
    const tableRow = document.createElement('tr');

    const dateColumn = document.createElement('td');
    dateColumn.textContent = commit.date;
    tableRow.appendChild(dateColumn);

    const timeColumn = document.createElement('td');
    timeColumn.textContent = commit.time;
    tableRow.appendChild(timeColumn);

    const messageColumn = document.createElement('td');
    messageColumn.textContent = commit.message;
    tableRow.appendChild(messageColumn);

    commitList.appendChild(tableRow);
  }
}
