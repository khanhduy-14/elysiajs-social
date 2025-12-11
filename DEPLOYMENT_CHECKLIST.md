# 📋 Deployment Checklist

Use this checklist to ensure your deployment is set up correctly.

## Pre-Deployment

### Local Setup

- [ ] Project builds successfully locally
  ```bash
  bun install
  bun run dev
  ```

- [ ] Docker image builds successfully
  ```bash
  docker build -t elysiajs-social .
  ```

- [ ] Environment variables are documented in `.env.example`

- [ ] Configuration examples exist in `config.example/`

### Generate Required Files

- [ ] Generate RSA key pair for JWT
  ```bash
  openssl genrsa -out rsa-private.pem 2048
  openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
  ```

- [ ] Store RSA keys securely (DO NOT commit to git)

- [ ] Generate secure random strings for app secrets
  ```bash
  openssl rand -base64 32  # For APP_SECRET
  openssl rand -base64 32  # For JWT_ACCESS_SECRET
  openssl rand -base64 32  # For JWT_REFRESH_SECRET
  ```

## Platform Selection

### Choose Your Platform

- [ ] Reviewed platform comparison in [QUICKSTART.md](QUICKSTART.md)
- [ ] Selected platform:
  - [ ] Railway (recommended for beginners)
  - [ ] Render (production-ready)
  - [ ] Fly.io (global edge)
  - [ ] Other: _______________

## Platform Setup

### Railway

- [ ] Created Railway account
- [ ] Created new project from GitHub repo
- [ ] Added PostgreSQL database to project
- [ ] Configured environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `RSA_PRIVATE_KEY`
  - [ ] `RSA_PUBLIC_KEY`
  - [ ] Database variables (auto-configured)
- [ ] First deployment successful
- [ ] App URL is accessible: _______________________

### Render

- [ ] Created Render account
- [ ] Created PostgreSQL database
- [ ] Saved internal database URL
- [ ] Created web service from GitHub repo
- [ ] Configured environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `DATABASE_URL`
  - [ ] `RSA_PRIVATE_KEY`
  - [ ] `RSA_PUBLIC_KEY`
- [ ] First deployment successful
- [ ] App URL is accessible: _______________________

### Fly.io

- [ ] Installed Fly CLI
- [ ] Created Fly account (`fly auth signup`)
- [ ] Launched app (`fly launch`)
- [ ] Created PostgreSQL database
- [ ] Attached database to app
- [ ] Set secrets via CLI:
  - [ ] `RSA_PRIVATE_KEY`
  - [ ] `RSA_PUBLIC_KEY`
  - [ ] `NODE_ENV=production`
- [ ] Deployed app (`fly deploy`)
- [ ] App URL is accessible: _______________________

## GitHub Actions (Optional)

### Repository Secrets

Based on your platform, add these secrets:

#### Railway
- [ ] `RAILWAY_TOKEN` (from railway.app/account/tokens)
- [ ] Optional: `RAILWAY_PROJECT_ID`

#### Render
- [ ] `RENDER_API_KEY` (from Render account settings)
- [ ] `RENDER_SERVICE_ID` (from your service URL/settings)

#### Fly.io
- [ ] `FLY_API_TOKEN` (from `fly auth token`)

### Workflow Configuration

- [ ] Workflow file exists: `.github/workflows/[platform].yml`
- [ ] Workflow triggers on push to `main`
- [ ] Workflow can be manually dispatched
- [ ] Test workflow run completed successfully

## Post-Deployment Verification

### Health Checks

- [ ] Application is running
  ```bash
  curl https://your-app-url/api/json
  ```

- [ ] OpenAPI documentation is accessible
  - URL: https://________________________/api/json

- [ ] Database connection is working
  - Check logs for successful connection

- [ ] Authentication endpoints work
  - Test register: `POST /auth/register`
  - Test login: `POST /auth/login`

### Testing API Endpoints

Using curl or Postman:

- [ ] Register a new user
  ```bash
  curl -X POST https://your-app-url/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test123!","username":"testuser"}'
  ```

- [ ] Login with credentials
  ```bash
  curl -X POST https://your-app-url/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test123!"}'
  ```

- [ ] Test protected endpoint with token

### Performance & Monitoring

- [ ] Response times are acceptable (< 1s)
- [ ] No memory leaks observed
- [ ] Logs are accessible via platform dashboard
- [ ] Error tracking is working (if configured)

## Database

### Migrations

- [ ] Database schema is up to date
- [ ] Migrations ran successfully on first deploy
- [ ] Know how to run migrations for future updates:
  
  **Railway:**
  ```bash
  railway run bun run db:migrate
  ```
  
  **Render:** Use Shell or build command
  
  **Fly.io:**
  ```bash
  fly ssh console
  bun run db:migrate
  ```

### Backup Strategy

- [ ] Understand platform's backup policy
- [ ] Railway: Automatic snapshots (paid plans)
- [ ] Render: Point-in-time recovery available
- [ ] Fly.io: Set up backup strategy
- [ ] Consider additional backup solution for production

## Security

### Environment Variables

- [ ] All secrets are stored as environment variables (not hardcoded)
- [ ] RSA keys are kept secure
- [ ] Database passwords are strong and secure
- [ ] `.env` and `config/` are in `.gitignore`

### Access Control

- [ ] Platform account has strong password
- [ ] Two-factor authentication enabled (if available)
- [ ] API keys/tokens are stored securely
- [ ] Limited access to production environment

### HTTPS/SSL

- [ ] HTTPS is enabled (automatic on all platforms)
- [ ] SSL certificate is valid
- [ ] HTTP redirects to HTTPS
- [ ] Custom domain configured (if applicable)

## Monitoring & Maintenance

### Logging

- [ ] Application logs are accessible
- [ ] Log level is appropriate (`info` or `warn` for production)
- [ ] Know how to view logs:
  - Railway: Dashboard → Deployments → Logs
  - Render: Dashboard → Logs tab
  - Fly.io: `fly logs`

### Alerts (Optional)

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure email/Slack alerts for downtime
- [ ] Monitor resource usage

### Updates

- [ ] Know how to deploy updates:
  - Push to `main` branch (auto-deploys)
  - Or trigger manual deployment
- [ ] Have rollback plan if deployment fails
- [ ] Understand platform's rollback feature

## Documentation

### Internal Documentation

- [ ] Deployment URL documented: _______________________
- [ ] Platform credentials stored securely (password manager)
- [ ] Environment variables documented
- [ ] Database connection details saved
- [ ] API endpoint documentation accessible

### Team Communication

- [ ] Team knows deployment URL
- [ ] Deployment process documented
- [ ] On-call/support process defined (if applicable)

## Cost Management

### Free Tier Limits

- [ ] Understand platform's free tier limits
- [ ] Railway: $5 credit/month
- [ ] Render: 750 hours/month per service
- [ ] Fly.io: 3 shared VMs, 160GB bandwidth
- [ ] Set up billing alerts (if available)

### Scaling Plan

- [ ] Know when to upgrade
- [ ] Understand pricing for next tier
- [ ] Plan for growth

## Final Checklist

- [ ] Application is fully deployed and accessible
- [ ] All features work as expected
- [ ] API documentation is available
- [ ] Database is connected and working
- [ ] GitHub Actions CI/CD is configured (if using)
- [ ] Monitoring is in place
- [ ] Team has access to deployment
- [ ] Documentation is complete

## 🎉 Deployment Complete!

Congratulations! Your Elysia Social application is now live!

**Next Steps:**
1. Share your deployment URL with your team
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Plan for scaling as your user base grows

---

**Deployment URL:** _______________________________

**Deployed on:** ___________________________________

**Deployed by:** ___________________________________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
