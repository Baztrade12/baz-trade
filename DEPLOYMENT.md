# Vercel Deployment Guide

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

## Step 2: Deploy Frontend

### Option A: Import from GitHub (Recommended)

1. Go to Vercel Dashboard
2. Click "Add New" > "Project"
3. Select `baztrade657-arch/baz-trade` repository
4. Configure:
   - **Framework**: React
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Option B: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

## Step 3: Set Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_WS_URL=wss://your-backend-url.com
```

## Step 4: Deploy Backend

Choose one of these platforms:

### Option A: Railway

```bash
# Install Railway CLI
npm i -g railway

# Login
railway login

# Initialize project
cd backend
railway init

# Add services
railway add
# Select: PostgreSQL, Redis

# Deploy
railway up
```

### Option B: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create baz-trading-bot

# Set environment variables
heroku config:set BINANCE_API_KEY=your_key
heroku config:set BINANCE_API_SECRET=your_secret
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Option C: Render

1. Go to [render.com](https://render.com)
2. Connect GitHub
3. Create New > Web Service
4. Select `baz-trade` repository
5. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

## Step 5: Connect Services

### Update Frontend API URL

In Vercel > Environment Variables:
```
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_WS_URL=wss://your-backend-domain.com
```

### Update Backend CORS

In backend `.env`:
```
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## Step 6: Verify Deployment

1. **Frontend**: https://your-app.vercel.app
2. **Backend Health**: https://your-backend.com/health
3. **API Connection**: Check browser console for connection status

## Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies: npm install
# - TypeScript errors: Check tsconfig.json
# - Build cache: Clear cache in Settings
```

### API Connection Failed

1. Verify backend URL in environment variables
2. Check CORS configuration in backend
3. Ensure backend is running
4. Check network tab in browser DevTools

### Database Connection Error

1. Verify DATABASE_URL format
2. Check PostgreSQL is running
3. Ensure IP whitelist allows Vercel IPs
4. Run migrations: `npm run migrate`

## Monitoring

### Vercel Analytics

- Dashboard > Analytics
- Monitor:
  - Build duration
  - Page load times
  - Error rates
  - Usage statistics

### Performance Optimization

1. Enable automatic image optimization
2. Code splitting for React components
3. Enable gzip compression
4. Cache static assets
5. Monitor Core Web Vitals

## CI/CD Pipeline

Automated deployments on push:

1. **main branch** → Production
2. **dev branch** → Preview
3. **Pull requests** → Preview

## Custom Domain (Optional)

1. In Vercel > Settings > Domains
2. Add your domain
3. Update DNS records to point to Vercel
4. Enable SSL/TLS

## Cost Estimates

- **Vercel (Frontend)**: $0-20/month
- **Railway (Backend)**: $5-50/month
- **PostgreSQL**: $15/month
- **Redis**: $7/month
- **Total**: ~$27-92/month

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use strong API keys
- [ ] Enable IP whitelisting
- [ ] Use HTTPS everywhere
- [ ] Set secure cookies
- [ ] Enable CORS properly
- [ ] Rotate API keys regularly
- [ ] Monitor for security issues

---

**For more help**: [Vercel Docs](https://vercel.com/docs)
