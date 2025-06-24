# Exercises

The exercises simulate how multiple teams develop features concurrently. Every
exercise is described in a separate file in the [/docs](./docs) folder.

[Exercise 1](./exercise-1-happy-path.md) shows the happy path: The feature
works out of the box.

[Exercise 2](./exercise-2-rollback-and-fix.md) shows the unhappy path:
A feature doesn't pass the integration tests and needs to be fixed. Before we
fix the broken feature, we remove it from the TEST system. This allows other
teams to ship their features while we are debugging.

[Exercise 3](./exercise-3-concurrent-development.md) shows the unhappy path
from the perspective of two teams working concurrently. Both teams start at
the same time. The first team merges a broken feature into `develop`.
They revert that merge commit so that the other team can ship a working
feature. Then the broken feature is fixed and shipped in addition.

[Exercise 4](./exercise-4-protected-branches.md) repeats exercises 2 and 3
assuming that the `main` and `develop` branches are protected. This means that
the developers cannot commit directly to these branches.

[Exercise 5](./exercise-5-recreate-feature-branch.md) shows how to avoid the reapply merge commit used in exercises 2
and 3. This practice simplifies future debugging efforts and is described in
detail in (3). Instead of reverting the revert commit, we recreate the feature
branch using the `git rebase` command.

---

Up: [Back to the main README](../README.md)
