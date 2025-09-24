# Agent Guidelines for Understanding This Repo

This repository is structured as an Nx monorepo that uses `pnpm` for package management. When I need to become familiar with the codebase, I follow these steps:

1. Inspect the workspace configuration files (`nx.json`, `workspace.json` or project-level `project.json`, and `pnpm-workspace.yaml`) to learn which applications and libraries exist and how they are linked.
2. Review `package.json` to see shared scripts, dependencies, and tooling configuration.
3. Explore the `apps/` directory (and `libs/` if present) to map each project. I typically start with the main application entry points (e.g., `apps/<app-name>/src/main.tsx` for React, or equivalent framework bootstraps) and trace imports to understand feature boundaries.
4. Check for feature-specific documentation inside each project (e.g., `README.md`, `docs/`, or in-code comments).
5. Run linting or tests (`pnpm lint`, `pnpm test`, etc.) to confirm the toolchain and catch potential issues while reading.
6. Use `rg` (ripgrep) for fast code searches when tracking down symbols or features.

Following this checklist ensures I build an accurate mental model of the repo before making changes.
