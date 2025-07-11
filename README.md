# Git revert workshop

<!-- To update the table of contents, run `doctoc` in the terminal: `doctoc --maxlevel 2 README.md` -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Outline](#outline)
- [Run the workshop](#run-the-workshop)
- [Branching strategy: `main`, `develop`, `feat/xyz`](#branching-strategy-main-develop-featxyz)
- ["The System" and the simulation](#the-system-and-the-simulation)
- [Run the simulation web app](#run-the-simulation-web-app)
- [Visualize the git history in Visual Studio Code](#visualize-the-git-history-in-visual-studio-code)
- [Exercises](#exercises)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Outline

Git revert workshop for continuous integration and branching experiments.

In this workshop you will learn to revert merge commits on a branch, which is
used for integration testing. The article (1) shown in the section Literature
below describes in detail how teams can resolve conflicts in the integration
phase of concurrent development. This workshop addresses the step

> If it doesn’t pass, revert (undo) your check-in.
>
> -- James Shore (1)

## Run the workshop

### Prerequisites: Node.js, NPM

You can run this workshop as a team or individually.

The workshop provides a small web application to visualize the development
status.

If you want to run the workshop in a GitHub codespace, you are ready.

If you are using your local computer, then you need a recent Node.js version
with the node package manager `npm` to run the web app.

As an alternative to installing the tools, you can open the project in a
[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container)
in order to start without installing Node.js.

1. Make sure your container daemon is running (Docker, Rancher Desktop, Podman,
   etc.)
2. Open the Visual Studio Code command palette by pressing CTL+SHIFT+P (Windows,
   Linux) or CMD+SHIFT+P (macOS).
3. Select **Dev Containers: Reopen in Container**

To leave the Dev Container, open the command palette and select
**Dev Containers: Reopen Folder locally**.

**Troubleshooting:** [Dev Container troubleshooting](./docs/dev-container-troubleshooting.md).

### Team setup: Create workshop repository

If you are working as a team, or if you want to perform exercise 4, then click
the green **Use this template** in the top right and
**Create a new repository**.

Go to the **Settings** of the new repository and select **Collaborators** from
the menu. Invite your team members.

From the shared repository, every team member uses the green **Code** button
in the top right to

- either clone the shared repository to their computer
- or to start the repository in an individual GitHub codespace.

Make sure that you push all local changes to the remote, so that your team
mates can reproduce the workshop steps.

### Single person setup

If you run the workshop alone you can set up your own repository as described
above.

Alternatively, you can directly open the workshop repository as a GitHub
codespace using the green **Use this template** in the top right, followed by
**Open in a codespace**.

In a codespace, there is no need for pushing and pulling. You can work entirely
inside the codespace and delete it afterwards.

## Branching strategy: `main`, `develop`, `feat/xyz`

```mermaid
gitGraph
   commit id: "Initial commit"
   branch develop
   branch feat/xyz
   commit id: "feat: ..."
   checkout develop
   merge feat/xyz tag: "TEST"
   checkout main
   merge develop tag: "PROD"
   checkout develop
   merge main
```

We simulate a system with a "production" environment (PROD) and an
integration "test" environment (TEST). PROD represents the system used by the
end users. TEST is a copy of PROD. The development teams verify their changes
in the TEST system before they send them to the PROD system.

In our git repository, the PROD system is represented by the `main` branch,
the TEST system is represented by the `develop` branch.

When a developer (team) starts a new feature, they create a branch `feat/xyz`
from `develop`. When the feature is ready for testing, they merge their
feature branch into `develop`. Then the TEST system is updated and the
developers run integration tests.

If all tests pass, the developers merge `develop` into `main`. This causes the
feature to appear in the PROD system.

Finally, they merge `main` back into `develop` to ensure that both branches
are always in sync. They usually delete their feature branch afterwards.

## "The System" and the simulation

In this simulation "The System" is represented by the contents of the
[workflows.txt](./workflows.txt) file on either the `main` branch (PROD) or
on the `develop` branch (TEST). This file describes the features available
in the system.

The simulation provides a small web application to visualize the features
described in [workflows.txt](./workflows.txt). The web app allows switching
between PROD and TEST easily. It also shows the commits, that are considered
by each environment.

## Run the simulation web app

### Prerequisites

Once your working environment is running, restore the node modules:

```shell
npm install
```

### Start the simulation web app

![Simulation web app](./docs/codespace.png)

The simulation web app is shown in the right editor view.

Start the simulation in a terminal:

```shell
npm start
```

Then open the URL shown in the output to view the simulation web app in your
browser.

To use the integrated **Simple Browser** in a codespace, activate the panel
**Ports** (1) next to the **Terminal** tab. Right click the **node main.js**
entry (2) and select **Preview in Editor** (3).

### Commit npm package updates

It is likely that `npm` will update the `package-lock.json` file when you
install the packages. Commit these changes to avoid merge conflicts with your
team members:

```shell
git add package-lock.json
git commit -m "deps: update npm packages"
```

### Create a `develop` branch

To set up the TEST system, create and checkout the `develop` branch:

```shell
git checkout -b develop
```

Now you can switch between PROD and TEST in the simulation web app.
Note that you will not see a difference between the environments up to now.

## Visualize the git history in Visual Studio Code

If you are working in Visual Studio Code, you can use the **Graph** panel of
the **Source Control** view to inspect the recent commits. The toolbar of that
panel allows to show "All history item references", i.e. the branches and
other things.

In addition you can install, the
[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
extension by **mhutchie** to get an excellent overview of the repository history.

Other tools to visualize the git history are:

- [GitExtensions](https://gitextensions.github.io/) for Windows
- [Sourcetree](https://www.sourcetreeapp.com/) for Windows and macOS
- [Fork](https://git-fork.com/) for Windows and macOS

## Exercises

The exercises are described in the [/docs/README.md](./docs/README.md) file.

## References

(1) J. Shore, „Continuous Integration on a Dollar a Day“. Accessed: Jun. 14, 2025. [Online]. Available: [https://www.jamesshore.com/v2/blog/2006/continuous-integration-on-a-dollar-a-day](https://www.jamesshore.com/v2/blog/2006/continuous-integration-on-a-dollar-a-day)

(2) B. James and D. Kaplan, “Answer to ‘How do I revert a merge commit that has already been pushed to remote?,’” Stack Overflow. Accessed: Jun. 15, 2025. [Online]. Available: [https://stackoverflow.com/a/7100005](https://stackoverflow.com/a/7100005)

(3) L. Torvalds, J. C. Hamano: “How to revert a faulty merge”, GitHub. Accessed: Jun. 24, 2025. [Online]. Available: [https://github.com/git/git/blob/master/Documentation/howto/revert-a-faulty-merge.adoc](https://github.com/git/git/blob/master/Documentation/howto/revert-a-faulty-merge.adoc)