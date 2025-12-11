# 🚀 Quick Start - Deploy in 5 Minutes

Get your Elysia Social app deployed to the cloud in just a few minutes!

## Choose Your Platform

### Option 1: Railway (Recommended) ⭐

**Why Railway?** Easiest setup + PostgreSQL included + Best free tier

#### Step-by-Step:

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (instant login!)

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `elysiajs-social` repository
   - Railway auto-detects the Dockerfile ✨

3. **Add PostgreSQL Database**
   - In your project, click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically connects it to your app! 🎉

4. **Set Environment Variables**
   - Click on your app service
   - Go to "Variables" tab
   - Add these variables:

   ```bash
   NODE_ENV=production
   PORT=3000
   ```

5. **Generate and Add RSA Keys**
   
   Run locally:
   ```bash
   openssl genrsa -out rsa-private.pem 2048
   openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
   ```

   Add to Railway variables:
   - `RSA_PRIVATE_KEY` = (copy entire content of rsa-private.pem)
   - `RSA_PUBLIC_KEY` = (copy entire content of rsa-public.pem)

6. **Deploy!**
   - Railway deploys automatically on every push to `main`
   - Or click "Deploy" in Railway dashboard
   - Get your public URL instantly! 🌐

#### Enable GitHub Actions (Optional):

```bash
# 1. Get Railway token
# Go to: railway.app/account/tokens → Create Token

# 2. Add to GitHub
# Go to: Repository Settings → Secrets → Actions
# Add secret: RAILWAY_TOKEN = <your-token>

# 3. Push to main branch
# GitHub Actions will auto-deploy! ✨
```

**Total Time:** ~5 minutes ⏱️

---

### Option 2: Render

**Why Render?** 750 hours free per month + Production-ready

#### Step-by-Step:

1. **Sign up**: [render.com](https://render.com)

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `elysiajs-social-db`
   - Click "Create Database"
   - Save the **Internal Database URL**

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Environment: Docker
     - Region: (closest to you)
     - Plan: Free

4. **Add Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<your-internal-db-url>
   RSA_PRIVATE_KEY=<generate-with-openssl>
   RSA_PUBLIC_KEY=<generate-with-openssl>
   ```

5. **Deploy**: Click "Create Web Service"

**Total Time:** ~10 minutes ⏱️

---

### Option 3: Fly.io

**Why Fly.io?** Global edge network + 3 free VMs

#### Step-by-Step:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly**
   ```bash
   fly auth signup
   # or
   fly auth login
   ```

3. **Launch Your App**
   ```bash
   cd /path/to/elysiajs-social
   fly launch
   ```
   
   Answer prompts:
   - App name: `elysiajs-social` (or your choice)
   - Region: (closest to you)
   - PostgreSQL: **Yes**
   - Redis: No

4. **Add Secrets**
   ```bash
   # Generate RSA keys first
   openssl genrsa -out rsa-private.pem 2048
   openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
   
   # Add to Fly
   fly secrets set RSA_PRIVATE_KEY="$(cat rsa-private.pem)"
   fly secrets set RSA_PUBLIC_KEY="$(cat rsa-public.pem)"
   fly secrets set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Open Your App**
   ```bash
   fly open
   ```

**Total Time:** ~15 minutes ⏱️

---

## 🎯 Which Platform Should I Choose?

| If you want... | Choose... |
|---------------|-----------|
| Easiest setup | **Railway** |
| Longest free tier | **Render** (750 hrs) |
| Global distribution | **Fly.io** |
| Best for learning | **Railway** |
| Production apps | **Render** or **Fly.io** |

## ✅ Post-Deployment Checklist

After deployment, verify everything works:

```bash
# Test your API
curl https://your-app-url.railway.app/api/json

# You should see OpenAPI documentation JSON
```

- [ ] API responds successfully
- [ ] Can access OpenAPI docs at `/api/json`
- [ ] Database connection working
- [ ] Environment variables set correctly

## 🆘 Need Help?

**Quick Troubleshooting:**

1. **Build fails?** 
   - Check Dockerfile is present
   - Verify `package.json` is correct

2. **Database connection fails?**
   - Verify DATABASE_URL is set
   - Check database is running

3. **App crashes?**
   - Check platform logs
   - Verify all environment variables are set

**Detailed Help:**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guides
- Check [.github/README.md](.github/README.md) for CI/CD help

## 🎉 Success!

Your app is now live! Share your URL and start building your social platform!

**Next Steps:**
- Set up custom domain
- Configure HTTPS (auto on all platforms)
- Monitor logs and metrics
- Scale as needed

---

**Deployment Made Easy** ✨

*For detailed documentation, see [DEPLOYMENT.md](DEPLOYMENT.md)*
