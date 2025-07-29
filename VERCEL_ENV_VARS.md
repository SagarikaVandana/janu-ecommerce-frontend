# 🔧 Vercel Environment Variables

## **Required Environment Variables for Production Deployment**

### **1. API Configuration**
```
VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api
```

### **2. Payment Configuration (Stripe)**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### **3. Social Media Links**
```
VITE_WHATSAPP_NUMBER=+919391235258
VITE_INSTAGRAM_URL=https://www.instagram.com/janucollectionvizag/
VITE_FACEBOOK_URL=https://www.facebook.com/janucollectionvizag
VITE_YOUTUBE_URL=https://www.youtube.com/@Janucollectionvizag
```

### **4. App Configuration**
```
NODE_ENV=production
```

## **🚀 How to Set Environment Variables in Vercel**

### **Method 1: Via Vercel Dashboard (Recommended)**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Select Your Project**
   - Find your `janu-ecommerce-frontend` project
   - Click on it

3. **Navigate to Settings**
   - Click **Settings** tab
   - Select **Environment Variables**

4. **Add Each Variable**
   - Click **Add New**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://janu-ecommerce-backend.onrender.com/api`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

5. **Repeat for All Variables**
   - Add each variable from the list above
   - Make sure to select all environments

### **Method 2: Via Vercel CLI**

```bash
# Set API URL
npx vercel env add VITE_API_URL production

# Set Stripe Key (if using)
npx vercel env add VITE_STRIPE_PUBLISHABLE_KEY production

# Set Social Media Links
npx vercel env add VITE_WHATSAPP_NUMBER production
npx vercel env add VITE_INSTAGRAM_URL production
npx vercel env add VITE_FACEBOOK_URL production
npx vercel env add VITE_YOUTUBE_URL production
```

## **🔍 Verification**

After setting environment variables:

1. **Redeploy your project**
2. **Check the build logs** to ensure variables are loaded
3. **Test your application** to verify API calls work

## **⚠️ Important Notes**

- **All VITE_ variables** are exposed to the client
- **Never add sensitive data** like API keys that should be server-side only
- **Backend URL** is already configured in `vercel.json` for API proxy
- **Environment variables** are automatically available in your React app

## **🎯 Expected Result**

Once configured, your frontend will:
- ✅ Connect to your backend at `https://janu-ecommerce-backend.onrender.com`
- ✅ Display social media links correctly
- ✅ Handle payments (if Stripe is configured)
- ✅ Work in production environment 