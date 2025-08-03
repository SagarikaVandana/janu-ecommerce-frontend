# 🚨 Deployment Errors Fix Guide

## **Common Deployment Issues & Solutions**

### **1. Blank White Screen**
**Cause**: Environment variables not properly configured or API connection issues

**Solution**:
```bash
# Check if environment variables are set in Vercel
# Go to Vercel Dashboard → Project Settings → Environment Variables
```

**Required Environment Variables**:
```
VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
VITE_WHATSAPP_NUMBER=+919391235258
VITE_INSTAGRAM_URL=https://www.instagram.com/janucollectionvizag/
VITE_FACEBOOK_URL=https://www.facebook.com/janucollectionvizag
VITE_YOUTUBE_URL=https://www.youtube.com/@Janucollectionvizag
NODE_ENV=production
```

### **2. Build Failures**
**Cause**: Node version mismatch or dependency issues

**Solution**:
```json
// package.json - Update engines
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### **3. API Connection Errors**
**Cause**: Backend not accessible or CORS issues

**Solution**:
- Verify backend is running at `https://janu-ecommerce-backend.onrender.com`
- Check if backend health endpoint responds
- Ensure CORS is properly configured on backend

### **4. Environment Variable Issues**
**Cause**: Variables not properly exposed to client

**Solution**:
```typescript
// Use import.meta.env instead of process.env
const apiUrl = import.meta.env.VITE_API_URL || 'https://janu-ecommerce-backend.onrender.com/api';
```

### **5. Routing Issues**
**Cause**: SPA routing not properly configured

**Solution**:
```json
// vercel.json - Ensure proper rewrites
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## **🔧 Quick Fix Steps**

### **Step 1: Verify Environment Variables**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add/verify all required variables

### **Step 2: Check Build Logs**
1. Go to Vercel Dashboard
2. Click on your latest deployment
3. Check the build logs for errors
4. Look for any failed steps

### **Step 3: Test API Connection**
```bash
# Test backend health
curl https://janu-ecommerce-backend.onrender.com/api/health
```

### **Step 4: Redeploy**
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Or manually trigger redeploy in Vercel dashboard

## **🚀 Deployment Checklist**

### **Before Deployment**:
- [ ] All environment variables set in Vercel
- [ ] Backend is running and accessible
- [ ] No TypeScript errors (`npm run build` works locally)
- [ ] All dependencies are in package.json
- [ ] Node version is compatible (18+)

### **After Deployment**:
- [ ] Website loads without blank screen
- [ ] API calls work (check browser console)
- [ ] Navigation works properly
- [ ] Images and assets load
- [ ] No console errors

## **🔍 Debugging Steps**

### **1. Check Browser Console**
- Open browser developer tools
- Look for JavaScript errors
- Check network tab for failed requests

### **2. Verify API Health**
```javascript
// Test in browser console
fetch('https://janu-ecommerce-backend.onrender.com/api/health')
  .then(response => response.json())
  .then(data => console.log('API Health:', data))
  .catch(error => console.error('API Error:', error));
```

### **3. Check Environment Variables**
```javascript
// Test in browser console
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Node ENV:', import.meta.env.NODE_ENV);
```

### **4. Test Local Build**
```bash
npm run build
npm run preview
```

## **📞 Common Error Messages & Solutions**

### **"Module not found"**
- Check if all dependencies are in package.json
- Run `npm install` locally
- Clear Vercel cache and redeploy

### **"Environment variable not defined"**
- Add missing variables to Vercel dashboard
- Ensure variables start with `VITE_`
- Redeploy after adding variables

### **"API connection failed"**
- Verify backend URL is correct
- Check if backend is running
- Test API endpoints directly

### **"Build timeout"**
- Optimize build process
- Remove unnecessary dependencies
- Check for infinite loops in code

## **🎯 Expected Result**

After applying these fixes, your deployment should:
- ✅ Load without blank screen
- ✅ Connect to backend properly
- ✅ Display all content correctly
- ✅ Handle errors gracefully
- ✅ Work on all devices

## **🆘 Still Having Issues?**

1. **Check Vercel Build Logs**: Look for specific error messages
2. **Test Locally**: Run `npm run build && npm run preview`
3. **Verify Backend**: Ensure backend is accessible
4. **Clear Cache**: Clear browser cache and try again
5. **Contact Support**: If issues persist, check Vercel status page

---

**🎉 Follow these steps and your deployment should work perfectly!** 