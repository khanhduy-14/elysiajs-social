# Cloud Deployment Guide

This guide covers deploying the Elysia Social application to various cloud platforms using GitHub Actions for automated deployment.

## 📋 Table of Contents

- [Platform Comparison](#platform-comparison)
- [Railway Deployment](#railway-deployment)
- [Render Deployment](#render-deployment)
- [Fly.io Deployment](#flyio-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## 🔍 Platform Comparison

| Platform | Free Tier | Database | Auto-scaling | Build Time | Best For |
|----------|-----------|----------|--------------|------------|----------|
| **Railway** | $5 credit/month | PostgreSQL included | Yes | Fast | Full-stack apps with DB |
| **Render** | 750 hrs/month | PostgreSQL available | Limited | Medium | Production apps |
| **Fly.io** | 3 VMs free | Add-on required | Yes | Fast | Container-based apps |

### Recommended Platform: Railway

Railway is recommended for this project because:
- ✅ Easy PostgreSQL database setup
- ✅ Simple deployment process
- ✅ Good free tier for testing
- ✅ Automatic HTTPS
- ✅ Environment variable management

---

## 🚂 Railway Deployment

Railway is the easiest and recommended platform for deploying this application.

### Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Setup Steps

#### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `elysiajs-social` repository
5. Railway will detect the Dockerfile automatically

#### 2. Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Note: Database variables are automatically injected

#### 3. Configure Environment Variables

In Railway project settings, add these variables:

```bash
# Database (automatically set by Railway)
DATABASE_URL=postgresql://...  # Auto-generated
PGHOST=...                     # Auto-generated
PGPORT=5432                    # Auto-generated
PGUSER=postgres                # Auto-generated
PGPASSWORD=...                 # Auto-generated
PGDATABASE=railway             # Auto-generated

# Application Settings (you need to add these)
PORT=3000
NODE_ENV=production
```

#### 4. Add RSA Keys for JWT

Generate RSA keys locally:

```bash
# Generate private key
openssl genrsa -out rsa-private.pem 2048

# Generate public key
openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
```

Add these as Railway variables:

```bash
RSA_PRIVATE_KEY=<content of rsa-private.pem>
RSA_PUBLIC_KEY=<content of rsa-public.pem>
```

#### 5. Deploy

1. Railway will automatically deploy on push to main
2. Or click **"Deploy"** in Railway dashboard
3. View logs in real-time
4. Access your app at the provided Railway URL

### GitHub Actions Setup for Railway

#### 1. Get Railway Token

1. Go to [Railway Account Settings](https://railway.app/account/tokens)
2. Click **"Create Token"**
3. Copy the token

#### 2. Add GitHub Secret

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `RAILWAY_TOKEN`
5. Value: Your Railway token
6. Click **"Add secret"**

#### 3. Add Project ID (Optional)

Find your Railway project ID:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Get project info
railway status
```

Add as GitHub secret:
- Name: `RAILWAY_PROJECT_ID`
- Value: Your project ID

#### 4. Enable Workflow

The workflow is already configured in `.github/workflows/railway.yml`. It will:
- Trigger on push to `main` branch
- Can be manually triggered from Actions tab

### Manual Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy
railway up

# View logs
railway logs
```

### Update Database Connection in Code

Make sure your database connection uses Railway's environment variables. Update `src/db/db.ts` if needed:

```typescript
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
```

---

## 🎨 Render Deployment

Render offers a generous free tier with 750 hours per month.

### Setup Steps

#### 1. Create Render Account

Sign up at [render.com](https://render.com)

#### 2. Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Name: `elysiajs-social-db`
3. Database: `social-db`
4. User: `admin`
5. Region: Choose closest to you
6. Plan: Free
7. Click **"Create Database"**
8. Save the **Internal Database URL**

#### 3. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `elysiajs-social-app`
   - **Environment**: Docker
   - **Region**: Same as database
   - **Branch**: `main`
   - **Plan**: Free

#### 4. Add Environment Variables

```bash
PORT=3000
NODE_ENV=production
DATABASE_URL=<your-internal-database-url>
RSA_PRIVATE_KEY=<content-of-rsa-private-key>
RSA_PUBLIC_KEY=<content-of-rsa-public-key>
```

#### 5. Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Access your app at the provided Render URL

### GitHub Actions Setup for Render

#### 1. Get API Key

1. Go to [Render Account Settings](https://dashboard.render.com/account/settings)
2. Scroll to **API Keys**
3. Create new API key
4. Copy the key

#### 2. Get Service ID

1. Go to your web service dashboard
2. Copy the Service ID from the URL or settings

#### 3. Add GitHub Secrets

- `RENDER_API_KEY`: Your Render API key
- `RENDER_SERVICE_ID`: Your service ID

#### 4. Deploy

Push to main branch or manually trigger from GitHub Actions.

---

## 🪰 Fly.io Deployment

Fly.io is great for containerized applications with global distribution.

### Setup Steps

#### 1. Install Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

#### 2. Sign Up and Login

```bash
fly auth signup
# or if you have account
fly auth login
```

#### 3. Create Fly App

```bash
# Launch app (creates fly.toml)
fly launch

# Follow prompts:
# - App name: elysiajs-social (or your choice)
# - Region: Choose closest to you
# - PostgreSQL: Yes
# - Redis: No (not needed)
```

This will create `fly.toml` configuration file.

#### 4. Add Secrets

```bash
# Add RSA keys as secrets
fly secrets set RSA_PRIVATE_KEY="$(cat rsa-private.pem)"
fly secrets set RSA_PUBLIC_KEY="$(cat rsa-public.pem)"

# Database URL is automatically set by Fly
```

#### 5. Deploy

```bash
fly deploy
```

#### 6. Open App

```bash
fly open
```

### GitHub Actions Setup for Fly.io

#### 1. Get API Token

```bash
fly auth token
```

#### 2. Add GitHub Secret

- Name: `FLY_API_TOKEN`
- Value: Your Fly.io token

#### 3. Deploy

The workflow in `.github/workflows/flyio.yml` will deploy on push to main.

### Fly.io PostgreSQL Setup

If you need to create PostgreSQL separately:

```bash
# Create Postgres cluster
fly postgres create --name elysiajs-social-db

# Attach to your app
fly postgres attach elysiajs-social-db
```

---

## 🔐 Environment Variables

All platforms require these environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `RSA_PRIVATE_KEY` | JWT signing key | `-----BEGIN RSA PRIVATE KEY-----...` |
| `RSA_PUBLIC_KEY` | JWT verification key | `-----BEGIN PUBLIC KEY-----...` |

### Platform-Specific Variables

**Railway:**
- Auto-injects: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- Builds `DATABASE_URL` automatically

**Render:**
- Provides `DATABASE_URL` from linked database
- All others must be manually set

**Fly.io:**
- Sets `DATABASE_URL` when PostgreSQL attached
- Use `fly secrets set` for sensitive data

---

## 🐛 Troubleshooting

### Build Failures

#### Issue: "Bun not found"

**Solution**: Ensure Dockerfile is using `oven/bun:1.3.4` image.

#### Issue: "Dependencies failed to install"

**Solution**: 
```bash
# Clear lock file and reinstall locally
rm bun.lockb
bun install
git add bun.lockb
git commit -m "Update dependencies"
```

### Database Connection Issues

#### Issue: "Cannot connect to database"

**Solutions**:

1. **Verify DATABASE_URL format**:
   ```
   postgresql://user:password@host:port/database
   ```

2. **Check database is running** (platform dashboard)

3. **Verify environment variables** are set correctly

4. **For Railway**: Use internal database URL, not public

### Migration Issues

#### Issue: "Migrations not running"

**Solution**: Run migrations manually after deployment:

**Railway**:
```bash
railway run bun run db:migrate
```

**Render**: Add in build command or use Render Shell

**Fly.io**:
```bash
fly ssh console
bun run db:migrate
```

### Port Binding Issues

#### Issue: "Port already in use" or "Cannot bind to port"

**Solution**: Ensure your application reads `PORT` from environment:

```typescript
const port = process.env.PORT || 3000;
app.listen(port);
```

### Memory Issues

#### Issue: "Out of memory"

**Solutions**:

1. **Railway**: Upgrade plan or optimize memory usage
2. **Render**: Free tier has 512MB limit
3. **Fly.io**: Scale VM memory:
   ```bash
   fly scale memory 512
   ```

### SSL/HTTPS Issues

All platforms provide automatic HTTPS. If issues occur:

1. **Check platform status page**
2. **Wait for DNS propagation** (can take up to 48 hours)
3. **Verify custom domain settings** (if applicable)

### GitHub Actions Workflow Failures

#### Issue: "Invalid token" or "Authentication failed"

**Solution**:
1. Regenerate platform API token/key
2. Update GitHub secret
3. Re-run workflow

#### Issue: "Command not found"

**Solution**: Ensure CLI is installed in workflow (check `.github/workflows/*.yml`)

---

## 📚 Additional Resources

### Railway
- [Railway Docs](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Railway Pricing](https://railway.app/pricing)

### Render
- [Render Docs](https://render.com/docs)
- [Render API](https://api-docs.render.com/)
- [Render Pricing](https://render.com/pricing)

### Fly.io
- [Fly.io Docs](https://fly.io/docs/)
- [Fly Postgres](https://fly.io/docs/postgres/)
- [Fly Pricing](https://fly.io/docs/about/pricing/)

---

## 🎯 Quick Start Recommendation

**For beginners**: Start with **Railway**
- Easiest setup
- Best free tier for full-stack apps
- Automatic database integration
- Simple GitHub integration

**For production**: Consider **Render** or **Fly.io**
- More control over infrastructure
- Better scaling options
- Established platforms with good support

---

**Happy deploying!** 🚀

Need help? Create an issue in the repository or check the platform-specific documentation linked above.
