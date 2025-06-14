# Git revert workshop

Git revert workshop for continuous integration and branching experiments.

In this workshop you will learn to revert commits on a branch, which is
used for integration testing.

## Branching strategy: `main`, `develop`, `feat/xyz`

We simulate a system with a "production" environment (PROD) and an
integration "test" environment (TEST). PROD represents the system used by the
end users. TEST represents a copy of PROD, which the development teams for
verifying their changes before they send them to the PROD system.

In our git repository, the PROD system is represented by the `main` branch,
the TEST system is represented by the `develop` branch.

When a developer (team) starts a new feature, they create a branch `feat/xyz`
from `develop`. When they are done developing the feature, they merge their
feature branch to `develop`. The TEST system is then rebuilt and the developers
can run integration tests.

If all tests succeed, then the developers merge `develop` into `main`. This
causes the feature to appear in the PROD system. Next, they merge `main` back
into `develop` to ensure that both branches are in sync. Finally, they delete
their feature branch.

## Exercise

You will simulate implementing features, by adding rows with the use case
description to the file [workflows.txt](./workflows.txt).

You will run the "System" shipped in this repository to see what is deployed
to TEST and PROD, respectively. The "System" simply shows the contents of the
[workflows.txt](./workflows.txt) file effective for the corresponding
environment. It also shows the commits, that are considered for the respective
environment.

### Run "The System"

#### Prerequisites

After cloning this repository, restore the node modules:

```shell
npm install
```

#### Start "The System"

The system consists of a frontend and a backend.

First, start the backend in a terminal:

```shell
npm run backend
```

If you run this project in a GitHub codespace, then make the endpoint public.

Next, get the endpoint URL from the **Ports** tab of your VisualStudio Code
instance in the codespace and paste it as the `baseUrl` in
[frontend/main.js](./frontend/main.js).

Commit this change to your `main` branch before proceeding.

Then, in a second terminal, serve the frontend:

```shell
npm run frontend
```

Open the URL shown in the output of the frontend to view "The System" in your
browser.

### Create a `develop` branch

To simulate the TEST system, create and checkout the `develop` branch:

```shell
git checkout -b develop
```

Now you can switch between PROD and TEST in the Web UI. Note that you will not
see a difference up to now.

### Exercise 1: Implement and ship a working feature

By "implement a feature" we mean that you add a line to the file
[workflows.txt](./workflows.txt). This will simulate the work required to add
a use case to the system.

1. Create and checkout the feature branch `feat/register` based on the `develop` branch
2. Add the line `Register User: As a user I want to register, so that I can log in.` to the file [workflows.txt](./workflows.txt) and commit the changes with a speaking commit message
3. Merge the feature branch into `develop`
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
