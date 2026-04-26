# 🤝 Contributing to FitMart

First off — **thank you** for taking the time to contribute! 🎉

Whether you're fixing a bug, adding a feature, improving docs, or just asking a question — every contribution matters and you are welcome here.

This guide will walk you through **everything** you need to know to contribute to FitMart, whether you're contributing to open source for the first time or you're a seasoned developer.

---

## 📌 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Getting Started (Step-by-Step)](#-getting-started-step-by-step)
- [Picking an Issue](#-picking-an-issue)
- [Branching Strategy](#-branching-strategy)
- [Making Your Changes](#-making-your-changes)
- [Commit Message Convention](#-commit-message-convention)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [PR Review Process](#-pr-review-process)
- [Project Structure Reference](#-project-structure-reference)
- [Style Guide](#-style-guide)
- [Need Help?](#-need-help)

---

## 🧭 Code of Conduct

By participating in this project, you agree to be respectful and constructive. We expect everyone to:

- Use welcoming and inclusive language
- Be respectful of different viewpoints and experiences
- Gracefully accept constructive feedback
- Focus on what's best for the community

Harassment or toxic behavior of any kind will not be tolerated.

---

## 💡 How Can I Contribute?

You don't need to write code to contribute! Here are all the ways you can help:

| Type | Examples |
|------|---------|
| 🐛 **Bug Fix** | Fix broken functionality, handle edge cases |
| ✨ **New Feature** | Add something new to the app |
| 📖 **Documentation** | Improve README, add JSDoc comments, fix typos |
| 🎨 **UI/UX** | Improve design, responsiveness, accessibility |
| 🧪 **Tests** | Add unit or integration tests |
| 🔧 **Refactor** | Clean up code without changing behavior |
| 💬 **Discussion** | Comment on issues, review PRs, share ideas |

---

## 🚀 Getting Started (Step-by-Step)

### For Beginners — Read This Carefully!

If this is your first time contributing to open source, follow every step below. Don't skip anything!

---

### Step 1: Fork the Repository

Go to the [FitMart GitHub page](https://github.com/parthnarkar/FitMart) and click the **Fork** button (top right corner).

This creates your own copy of the project under your GitHub account.

---

### Step 2: Clone Your Fork

```bash
git clone https://github.com/<your-username>/FitMart.git
cd FitMart
```

> Replace `<your-username>` with your actual GitHub username.

---

### Step 3: Add the Upstream Remote

This connects your local copy to the original FitMart repo so you can pull in future updates:

```bash
git remote add upstream https://github.com/parthnarkar/FitMart.git
```

Verify it worked:

```bash
git remote -v
# Should show both origin (your fork) and upstream (original)
```

---

### Step 4: Set Up the Project Locally

Follow the [Quick Start guide in README.md](README.md#-quick-start) to get both the client and server running locally.

> ✅ Make sure the app runs on your machine **before** making any changes.

---

### Step 5: Keep Your Fork Updated

Before starting any new work, always sync with the latest changes from the original repo:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## 🎯 Picking an Issue

### Finding Issues to Work On

Browse the [Issues tab](https://github.com/parthnarkar/FitMart/issues) and look for these labels:

| Label | Meaning |
|-------|---------|
| `good first issue` | 🌱 Great for beginners — well-scoped and documented |
| `help wanted` | Open for anyone to pick up |
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `documentation` | Docs-related work |

### Before You Start

**Always comment on the issue first!** Say something like:

> "Hey, I'd like to work on this! I'll have a PR ready by [rough timeline]."

This prevents two people from working on the same thing. The maintainer will assign it to you.

### Want to Work on Something Not Listed?

Open a new issue first and describe what you'd like to do. Wait for a maintainer to respond before starting large changes — this avoids wasted effort.

---

## 🌿 Branching Strategy

**Never commit directly to `main`.** Always work on a separate branch.

### Branch Naming

Use this format: `type/short-description`

```bash
# Examples:
git checkout -b fix/cart-reservation-bug
git checkout -b feat/product-search
git checkout -b docs/improve-contributing-guide
git checkout -b refactor/api-url-standardize
```

| Prefix | Use For |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code cleanup |
| `test/` | Adding/updating tests |
| `chore/` | Build scripts, config, etc. |

---

## 🛠️ Making Your Changes

1. Make sure you're on your feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes in small, logical steps.

3. Test your changes locally — make sure everything still works.

4. Stage and commit your changes (see commit format below):
   ```bash
   git add .
   git commit -m "feat: add product search functionality"
   ```

5. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

---

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. This keeps the history clean and readable.

### Format

```
type(scope): short description

[optional longer description]

[optional: closes #issue-number]
```

### Examples

```bash
feat(cart): add quantity update button on cart page
fix(auth): resolve Google sign-in redirect loop
docs(readme): add environment variable instructions
refactor(client): replace hardcoded API URLs with VITE_API_URL
chore: update dependencies
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting (no logic change) |
| `refactor` | Code restructure (no feature/fix) |
| `test` | Adding or updating tests |
| `chore` | Build, config, tooling changes |

> 💡 Keep the subject line under **72 characters** and in **lowercase**.

---

## 🔃 Submitting a Pull Request

Once your changes are pushed to your fork:

1. Go to the original [FitMart repo](https://github.com/parthnarkar/FitMart).
2. You'll see a **"Compare & pull request"** banner — click it.
3. Fill out the PR template completely (see below).
4. Set the base branch to `main`.
5. Click **"Create Pull Request"**.

### PR Title Format

Use the same convention as commits:

```
feat(product): add product filter by category
fix(payment): handle failed payment edge case
```

### PR Description Template

Please fill this out when opening a PR:

```markdown
## 📋 What does this PR do?
A clear summary of the changes made.

## 🔗 Related Issue
Closes #<issue-number>

## 🧪 How was this tested?
Describe how you tested your changes (manual steps, screenshots, etc.)

## 📸 Screenshots (if UI changes)
Before / After screenshots if you changed any UI.

## ✅ Checklist
- [ ] I've read the CONTRIBUTING guide
- [ ] My code follows the project's style guidelines
- [ ] I've tested my changes locally
- [ ] I've linked the related issue
- [ ] I haven't introduced any new secrets or API keys
```

---

## 🔍 PR Review Process

After you open a PR:

1. **Automated checks** may run (linting, etc.) — make sure they pass.
2. The **maintainer (Parth)** will review your PR and may leave comments.
3. If changes are requested:
   - Make the changes on the **same branch**
   - Push the new commits — the PR updates automatically
   - Reply to comments once addressed
4. Once approved, your PR will be **merged** 🎉

> ⏱️ Be patient — reviews can take a few days. Feel free to ping if there's no response after a week.

---

## 📁 Project Structure Reference

```
FitMart/
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── auth/             # Firebase auth setup & helpers
│   │   └── utilities/        # Helper/utility functions
│   └── .env.local            # ⚠️ Not committed — create manually
│
├── server/                   # Node.js + Express Backend
│   ├── models/               # Mongoose schemas (Product, Cart, Order)
│   ├── routes/               # Route handlers (products, cart, orders, payment)
│   ├── seed.js               # DB seeding script
│   ├── db.js                 # MongoDB connection
│   ├── index.js              # Server entry point
│   └── .env                  # ⚠️ Not committed — create manually
```

---

## 🎨 Style Guide

### JavaScript / React

- Use **functional components** with hooks (no class components)
- Prefer **`const`** over `let`; avoid `var`
- Use **async/await** over raw Promises where possible
- Keep components small and single-purpose
- Name component files with **PascalCase** (e.g., `ProductCard.jsx`)
- Name utility files with **camelCase** (e.g., `formatPrice.js`)

### CSS / Tailwind

- Use **Tailwind utility classes** wherever possible
- Keep custom CSS to a minimum
- Ensure UI is responsive and works on mobile

### Backend (Node/Express)

- Keep route files focused on a single resource
- Put business logic in separate helper functions, not directly in routes
- Always validate input and handle errors properly
- Never log or expose sensitive values (API keys, passwords)

### General

- **No hardcoded URLs** — use `VITE_API_URL` or env variables
- **No committed secrets** — `.env` files are gitignored for a reason
- Delete commented-out code before submitting a PR
- Write clear variable and function names — code should read like English

---

## 🆘 Need Help?

Stuck? Don't worry — everyone was a beginner once.

- 💬 **Comment on the issue** you're working on with your question
- 🐛 **Open a new issue** with the `question` label
- 📖 **Re-read the README** — the setup steps cover most common problems

> There are no dumb questions. Ask away! 🙌

---

<div align="center">

**Happy coding! We're glad you're here.** 🚀

Made with ❤️ by [Parth Narkar](https://github.com/parthnarkar) and the [Parth Builds Community](https://www.instagram.com/parth.builds/)

</div>