(async () => {
  listRecentlyDeployedWorkflows();
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