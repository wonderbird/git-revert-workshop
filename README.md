# Git revert workshop

Git revert workshop for continuous integration and branching experiments.

In this workshop you will learn to revert commits on a branch, which is
used for integration testing.

To run the workshop, simply create a new repository by using this template.
You can run the workshop on your computer with Nodejs or on a GitHub
codespace. The latter runs out of the box and the codespace can be deleted
when you are done.

## Branching strategy: `main`, `develop`, `feat/xyz`

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

## About the exercises

The exercises simulate how multiple teams develop features concurrently.

Exercise 1 shows the happy path: The feature works out of the box.

Exercise 2 shows the unhappy path: A feature doesn't pass the integration tests
and needs to be fixed. While we fix the broken feature, we free the TEST
system so that other teams could ship their features while we are debugging.

Exercise 3 shows the unhappy path from the perspective of two teams working
concurrently.

In this simulation "The System" is represented by the contents of the
[workflows.txt](./workflows.txt) file on either the `main` branch (PROD) or
on the `develop` branch (TEST).

We have a small web application which visualizes this and allows switching
between PROD and TEST easily. The web application also shows the commits,
that are considered by each environment.

## How to run "The System"

### Prerequisites

After you have created the new repository from this template or when your
GitHub codespace has started, restore the node modules:

```shell
npm install
```

### Start "The System"

The system consists of a frontend and a backend.

First, start the backend in a terminal:

```shell
npm run backend
```

If you run this project in a GitHub codespace, then make the endpoint public.

Next, copy the endpoint URL from the **Ports** tab of your VisualStudio Code
instance in the codespace and paste it as the `baseUrl` in
[frontend/main.js](./frontend/main.js).

Commit this change to your `main` branch before proceeding.

Then, in a second terminal, serve the frontend:

```shell
npm run frontend
```

In a codespace you can open can open the exposed port 3000 by right clicking
it and selecting **Preview in Editor**.

Otherwise, open the URL shown in the output of the frontend to view
"The System" in your browser.

### Create a `develop` branch

To simulate the TEST system, create and checkout the `develop` branch:

```shell
git checkout -b develop
```

Now you can switch between PROD and TEST in the Web UI. Note that you will not
see a difference up to now.

### Exercise 1: Implement and ship a working feature

By "implement a feature" we mean that you add a line to the end of the file
[workflows.txt](./workflows.txt). This will simulate the work required to add
a use case to the system.

1. Create and checkout the feature branch `feat/register` based on the `develop` branch
2. Add the line `Register User: As a user I want to register, so that I can log in.` to the file [workflows.txt](./workflows.txt) and commit the changes with a speaking commit message
3. Merge the feature branch into `develop`. Attention: Always create a merge commit, so that we could revert the merge easily. Use the `--no-ff` option in `git merge --no-ff feat/register`.
4. Refresh your web browser showing "The System" and compare the PROD system to the TEST system. TEST should show the added workflow while PROD is still empty.
5. Now let's assume that our integration tests were successful. Merge `develop` into `main`.
6. Refresh your web browser again. Now PROD and TEST should show the same workflows, but a different commit history - The final merge commit is missing on TEST.
7. Merge `main` back into `develop`.

You have successfully added a feature :-)

### Exercise 2: Implement a feature failing the tests in TEST, revert, fix, ship to PROD

In this exercise, we will add a new workflow with typo in the short description.

Using the row `-dd to Cart: As a user I want to add a product to the shopping cart, so that I can purchase it later.`, repeat steps 1-4 of exercise 1.

4. The TEST system should show the workflow with the typo in the short description
5. Revert the merge commit on the develop branch to simulate that we free the test system for our peer developers
6. Verify that the TEST system does not show the new workflow. The commit history will show the merge commit and the revert commit
7. Merge `develop` back into your feature branch
8. Fix the typo on the feature branch: `Add to Cart: As a user I want to add a product to the shopping cart, so that I can purchase it later.`

Now ship the fixed feature following steps 3-6 of exercise 1.

### Exercise 3: Concurrent feature development

In this exercise we will explicitly ship two concurrent features. The first feature is broken. We will revert the commit in TEST so that the second feature can be shipped before the fixed first feature is shipped.

Repeat steps 1-4 of exercise 1 using the workflow `-heckout Cart: As a user I want to checkout my shopping cart, so that my order gets shipped.`

Again, we want to free the TEST system for our peers. So execute steps 5 and 6 of exercise 2 to revert the merge to `develop`.

Before proceeding, we will simulate that another team develops a working feature in parallel: Execute exercise 1 using the workflow `Add Paypal: As a customer I want to register my paypal account, so I can checkout my cart faster.`.

Note that the other team can ship their changes, because we reverted our broken feature on the `develop` branch.

Finally, fix the broken feature and ship it as described in steps 7 - end of exercise 2.
