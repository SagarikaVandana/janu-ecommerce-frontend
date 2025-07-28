# Vercel Deployment Guide for Janu Collection Frontend

## 🚀 Quick Deploy to Vercel

### Step 1: Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure all files are committed and pushed

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the following settings:

### Step 3: Project Configuration
- **Framework Preset**: Vite
- **Root Directory**: `project-bolt-sb1-tmphr7ma (2)/project-bolt-sb1-tmphr7ma/project/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables
Add these environment variables in your Vercel dashboard:

```
VITE_API_URL=https://janu-ecommerce-backend.onrender.com
VITE_APP_NAME=Janu Collection
VITE_APP_VERSION=1.0.0
```

### Step 5: Deploy
Click "Deploy" and wait for the build to complete.

## 🔧 Configuration Files

### vercel.json
This file handles:
- API routing to your backend
- SPA routing for React Router
- Security headers
- Build configuration

### vite.config.ts
Optimized for production builds with:
- Code splitting
- Tree shaking
- Optimized chunks

## 🌐 Domain Configuration

After deployment:
1. Your app will be available at: `https://your-project-name.vercel.app`
2. You can add a custom domain in Vercel dashboard
3. Configure DNS settings if needed

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (requires >=18.0.0)
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **API Calls Fail**
   - Verify VITE_API_URL is set correctly
   - Check CORS settings on backend
   - Ensure backend is running on Render

3. **Routing Issues**
   - The vercel.json handles SPA routing
   - All routes should redirect to index.html

4. **Environment Variables**
   - Must be prefixed with `VITE_` for client-side access
   - Set in Vercel dashboard under Settings > Environment Variables

## 📊 Performance Optimization

The build is optimized for:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ Automatic HTTPS

## 🔒 Security

Security headers are configured in vercel.json:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## 📱 Features Working on Vercel

✅ User Authentication
✅ Product Management
✅ Shopping Cart
✅ Payment Processing
✅ Admin Dashboard
✅ Newsletter System
✅ WhatsApp Integration
✅ Responsive Design
✅ SEO Optimized

## 🚀 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All dependencies in package.json
- [ ] Environment variables configured
- [ ] Build command working locally
- [ ] Backend API accessible
- [ ] CORS configured on backend
- [ ] Custom domain configured (optional)

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test API connectivity
4. Check browser console for errors

Your Janu Collection e-commerce site will be live and fully functional on Vercel! 🎉 