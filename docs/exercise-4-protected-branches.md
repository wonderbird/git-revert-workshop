# Exercise 4: Protected main and develop branches

Now we will practice the revert step in a repository, which does not allow committing directly to the `main` and `develop` branches.

This setup is used when multiple team work concurrently on different feature branches.

For the sake of simplicity we will use the same scenario as in exercise 3. We will bring a broken feature into the TEST system. Then we will revert that merge commit, so that a different team could ship a working feature. Finally, we will fix the broken feature and ship it to TEST and PROD.

1. If you have not created a dedicated repository as described in section **Team setup: Create workshop repository** above, then do that now. If you keep the repository on GitHub, then it must be public. For a private repository you can only set up branch protection rules, if you have a paid GitHub account.

2. Follow the instructions in section **Run the simulation web app** above to setup the `develop` branch. Push the `develop` branch to the remote.

3. Configure your repository to prohibit commits on the `main` and `develop` branches. In GitHub this is done on the **Settings / Rules / Rulesets** page for the repository. Choose the green **New ruleset** button at the top right to set up a **New branch ruleset**.

4. Create a feature branch `feat/send-tracking-link`. Using the row `-end Tracking Link: As a user I want to receive a tracking link, so that I can see the status of my delivery.`, repeat steps 1-4 of exercise 1.

>[!IMPORTANT]
>
>Use a pull request to merge into the `develop` branch.
>After completing the pull request, you can delete the remote branch.
>Update your local branches via `git switch develop; git fetch --all --prune; git pull`.

5. The TEST system should show the workflow with the typo in the short description

6. In order to revert the merge commit on the `develop` branch,

   1. Create a bugfix branch: `git checkout -b fix/send-tracking-link`

   2. Inspect the merge commit to identify the ID of the parent you want to keep

   3. Copy the ID of the merge commit

   4. Revert the merge commit on the bugfix branch: `git revert COMMITID -m X` where X represents the commit ID of the head you want to keep. [(2)](../README.md#references) gives more details on this. Carefully inspect the commit message - it shows details about what has been reverted.

   5. Push the changes to the remote: `git push --set-upstream origin fix/send-tracking-link`

   6. Create a pull request and merge the fix into `develop`

   7. Update your local branches: `git switch develop; git pull`.

7. Verify that the TEST system does not show the new workflow. The commit history will show the merge commit and the revert commit

>[!NOTE]
>
>At this stage other teams can ship features as described in exercise 3.

8. Switch to the bugfix branch: `git switch fix/send-tracking-link`. If you deleted the branch when merging the pull request, then fix the upstream locally: `git branch --unset-upstream`.

9. On your feature branch, revert the previous revert commit to bring the broken feature back:

   1. Get the ID of the revert commit

   2. Reapply the broken feature by reverting the revert commit: `git revert COMMITID`

   3. (relevant in exercise 3) If another team has shipped a feature in between, there will be merge conflicts. Fix these conflicts, but don't fix the broken feature yet. We want to keep reapply commit separate from the bug fix.

10. Fix the typo and commit it: `Send Tracking Link: As a user I want to receive a tracking link, so that I can see the status of my delivery.` - `git commit -am "fix: send tracking link"`

11. Push the changes to the remote

12. Use a pull request to merge the fixed feature to `develop` and update your local branches `git switch develop; git fetch --all --prune; git pull`

13. Now the TEST system shows the corrected feature and the associated history

14. Finish shipping to PROD by following steps 5-7 of exercise 1.

15. Sync your branches in order to verify the feature in PROD: `git switch main; git pull`

---

- Previous: [Exercise 3: Concurrent feature development](./exercise-3-concurrent-development.md)
- Next: [Exercise 5: Recreate feature branch](./exercise-5-recreate-feature-branch.md)
- Up: [Back to the exercises overview](./README.md)
