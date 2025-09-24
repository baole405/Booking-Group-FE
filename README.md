# fe-swd

FPTU's EXE courses currently rely on external tools for group management.

## Continuous integration

This repository uses a GitHub Actions workflow that runs automatically for every pull request targeting `main`:

- Validates that the pull request branch name follows the `<type>/<slug>` convention (see below for the accepted prefixes).
- Installs dependencies with `pnpm`.
- Runs Nx lint checks for every project.
- Builds all projects in production mode.

## Branch naming and merge process

To keep a clean history and make the automation happy, follow this workflow when contributing changes:

1. Create feature branches that start with one of `feature/`, `bugfix/`, `hotfix/`, `release/`, `chore/`, or `codex/`, followed by a descriptive slug (for example, `feature/add-login-form`).
2. When you are ready to open a pull request, first make sure your branch is rebased on top of the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git rebase origin/main
   ```
3. Resolve any conflicts during the rebase and continue rebasing until it completes. Run your local checks to ensure everything still works.
4. Push the rebased branch to the remote. Because rebasing rewrites history, you will usually need to force push safely:
   ```bash
   git push --force-with-lease
   ```
5. Open the pull request. The CI workflow will verify the branch name, lint the code, and build the projects before the pull request can be merged.
6. Once the pull request is approved and the workflow succeeds, merge it into `main`.

Following this process keeps the `main` branch linear and ensures each change has been validated by the same checks that run in CI.
