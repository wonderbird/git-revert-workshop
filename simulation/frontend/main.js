(async () => {
  const baseUrl = '/';

  const prodContext = buildContext(baseUrl, 'prod');
  const testContext = buildContext(baseUrl, 'test');

  if (!prodContext.workflowList || !prodContext.commitList) {
    console.error('UI controls not found. Ensure the HTML elements with IDs "workflows" and "commits" exist.');
    return;
  }

  registerButton(prodContext);
  registerButton(testContext);

  await update(prodContext);
})();

function buildContext(baseUrl, environment) {
  return {
    baseUrl: baseUrl,
    environment: environment,
    workflowList: document.getElementById('workflows'),
    commitList: document.getElementById('commits'),
  };
}

function registerButton(context) {
  const button = document.getElementById(context.environment);
  if (button) {
    button.addEventListener('click', async () => await update(context));
  }
}

async function update(context) {
  context.workflowList.innerHTML = '';
  context.commitList.innerHTML = '';

  try {
    await listRecentlyDeployedWorkflows(context);
    await listRecentCommits(context);
  } catch (error) {
    console.error('Error refreshing data:', error.message);
  }
}

async function listRecentlyDeployedWorkflows(context) {
  const workflows = await get(`${context.baseUrl}workflows?environment=${context.environment}`);
  workflows.forEach(workflow => displayWorkflow(context, workflow));
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

function displayWorkflow(context, workflow) {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item';
  listItem.textContent = workflow;
  context.workflowList.appendChild(listItem);
}

async function listRecentCommits(context) {
  const commits = await get(`${context.baseUrl}commits?environment=${context.environment}`);
  commits.forEach(commit => displayCommit(context, commit));
}

function displayCommit(context, commit) {
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

  context.commitList.appendChild(tableRow);
}
