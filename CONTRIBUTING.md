# Contributing to ProjectPilot.AI

We welcome contributions to ProjectPilot.AI! To make the process smooth and collaborative, please review these simple guidelines.

## 🤝 Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started
1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone Locally**: Run `git clone https://github.com/Snehith-personal/projects/new_project.git`.
3. **Install Dependencies**: Install standard packages using `npm install`.
4. **Create a Topic Branch**: Use a descriptive name like `feature/add-caching` or `bugfix/fix-type-resolution`.

## 🛠️ Code Style & Quality Standards
- **TypeScript**: Enforce type-safety. Avoid using type `any` unless absolutely necessary.
- **EditorConfig**: Maintain LF line endings and 2-space indentation (configured in `.editorconfig`).
- **Pre-Commit Checks**: Run `npm run build` locally to verify that the entire monorepo compiles without errors.

## 📥 Submitting Pull Requests
1. Rebase your branch onto `main` to ensure a clean commit log.
2. Write a detailed summary of changes, references to issue tickets, and verification test outputs in the PR description.
3. Once all CI checks compile successfully, a maintainer will review your code changes.
