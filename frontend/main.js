(async () => {
  listRecentlyDeployedWorkflows();
  listRecentCommits();
})();

function listRecentlyDeployedWorkflows() {
  const numberOfWorkflows = 3;

  fetch('/workflows.txt')
    .then(response => response.text())
    .then(data => {
      const workflows = data.split('\n')
                            .filter(line => line.trim() !== '')
                            .reverse()
                            .slice(0, numberOfWorkflows);

      workflows.forEach(workflow => {
        displayWorkflow(workflow);
      });
    });
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

async function listRecentCommits() {
  try {
    const request = new Request('http://localhost:5001/commits', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const response = await fetch(request);

    const commits = await response.json();
    commits.forEach(displayCommit);
  } catch(error) {
    console.error(error.message);
  }
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
