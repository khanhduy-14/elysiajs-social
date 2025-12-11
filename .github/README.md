# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD deployment to various cloud platforms.

## 📁 Workflows

### CI Pipeline (`ci.yml`)

Runs automated checks on every push and pull request.

**Triggers:** Push or PR to `main` or `develop`

**Jobs:**
- Install dependencies
- TypeScript validation
- Docker build test

### Railway Deployment (`railway.yml`)

Deploys to Railway platform.

**Triggers:** Push to `main` or manual

**Requirements:**
- `RAILWAY_TOKEN` secret

**Setup:**
1. Get token from [railway.app/account/tokens](https://railway.app/account/tokens)
2. Add as GitHub secret: `RAILWAY_TOKEN`

### Render Deployment (`render.yml`)

Deploys to Render platform.

**Triggers:** Push to `main` or manual

**Requirements:**
- `RENDER_API_KEY` secret
- `RENDER_SERVICE_ID` secret

**Setup:**
1. Get API key from [Render Account Settings](https://dashboard.render.com/account/settings)
2. Get service ID from your web service URL or settings
3. Add both as GitHub secrets

### Fly.io Deployment (`flyio.yml`)

Deploys to Fly.io platform.

**Triggers:** Push to `main` or manual

**Requirements:**
- `FLY_API_TOKEN` secret

**Setup:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Get token: `fly auth token`
4. Add as GitHub secret: `FLY_API_TOKEN`

## 🔐 GitHub Secrets

Add secrets in: **Repository Settings** → **Secrets and variables** → **Actions**

### Required Secrets by Platform

**Railway:**
- `RAILWAY_TOKEN` - API token from Railway

**Render:**
- `RENDER_API_KEY` - API key from Render
- `RENDER_SERVICE_ID` - Your web service ID

**Fly.io:**
- `FLY_API_TOKEN` - Auth token from Fly CLI

## 🚀 Manual Deployment

### Trigger from GitHub UI

1. Go to **Actions** tab
2. Select desired workflow (Railway, Render, or Fly.io)
3. Click **"Run workflow"**
4. Select branch (usually `main`)
5. Click **"Run workflow"** button

### Trigger from Command Line

```bash
# Using GitHub CLI
gh workflow run railway.yml
gh workflow run render.yml
gh workflow run flyio.yml
```

## 📝 Adding New Workflows

1. Create new `.yml` file in this directory
2. Define workflow name, triggers, and jobs
3. Add required secrets to repository
4. Test by pushing to a branch

Example workflow structure:

```yaml
name: My Deployment

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Deploying..."
```

## 🔍 Monitoring Deployments

### View Workflow Runs

1. Go to **Actions** tab in GitHub
2. Click on a workflow run to see details
3. Expand jobs to see step-by-step logs
4. Check for errors marked in red

### Common Issues

**Issue: Workflow not triggering**
- Check trigger conditions in `.yml` file
- Ensure you're pushing to correct branch

**Issue: Authentication failed**
- Verify secrets are correctly added
- Check secret names match workflow file
- Regenerate tokens/keys if expired

**Issue: Build failed**
- Check workflow logs for specific error
- Verify dependencies in `package.json`
- Ensure Dockerfile is valid

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs/)

## 🛠️ Development

### Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act

# Run a workflow
act push -W .github/workflows/ci.yml
```

### Workflow Best Practices

- ✅ Use specific action versions (`@v4` not `@latest`)
- ✅ Set workflow permissions appropriately
- ✅ Use secrets for sensitive data
- ✅ Add meaningful step names
- ✅ Use `continue-on-error` for non-critical steps
- ✅ Cache dependencies when possible

---

For detailed deployment instructions, see [/DEPLOYMENT.md](/DEPLOYMENT.md)
