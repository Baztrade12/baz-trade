# Vercel Deployment Configuration

## Environment Variables

Add these to your Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com:3002
```

## Deployment Steps

1. **Connect GitHub Repository**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Vercel auto-detects Next.js

2. **Configure Build Settings**
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy**
   - Click "Deploy"
   - Your dashboard will be live at `https://your-project.vercel.app`

## Performance Optimization

- Image optimization: Enabled
- Font optimization: Enabled
- Analytics: Optional Vercel Web Analytics

## Monitoring

- Monitor bot API connectivity
- Check WebSocket latency
- Review error logs
- Track user analytics

## Custom Domain

1. Add domain in Vercel project settings
2. Update DNS records with Vercel nameservers
3. Configure SSL certificate (auto-generated)

## CI/CD Pipeline

Vercel automatically:
- Runs on every push to main branch
- Builds and deploys
- Generates preview URLs for PRs
- Performs zero-downtime deployments
