# 🚀 DEPLOYMENT GUIDE - Frontend to Vercel

## ✅ Status: READY TO DEPLOY

Backend API sudah online dan working di: **https://api-iot.wibudev.moe**
Frontend sudah siap untuk deployment ke Vercel!

## 📋 Pre-Deployment Checklist

### ✅ **Completed:**
- [x] Backend API running on https://api-iot.wibudev.moe
- [x] Frontend environment variables configured
- [x] API client (axios) configured for production
- [x] CORS settings updated in backend
- [x] Build process tested and working
- [x] Vercel configuration file created
- [x] API test component created

### 🎯 **Ready to Deploy:**
- [x] Frontend code in `d:\ta\frontend`
- [x] `vercel.json` configuration
- [x] Environment variables setup
- [x] API integration tested

## 🌐 Deployment Options

### **Option 1: Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to Project Root:**
```bash
cd d:\ta
```

3. **Login to Vercel:**
```bash
vercel login
```

4. **Deploy to Production:**
```bash
vercel --prod
```

### **Option 2: GitHub Integration**

1. **Create GitHub Repository:**
```bash
git init
git add .
git commit -m "Initial commit - Greenhouse Monitoring App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/greenhouse-monitoring.git
git push -u origin main
```

2. **Connect to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables
- Deploy!

## 🔧 Environment Variables for Vercel

Set these in your Vercel dashboard:

```
VITE_API_BASE_URL=https://api-iot.wibudev.moe
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=production
VITE_APP_NAME=Greenhouse Monitoring
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
d:\ta\
├── frontend/               # Frontend React app
│   ├── src/
│   ├── dist/              # Built files (after npm run build)
│   ├── package.json
│   ├── vite.config.js
│   └── .env*              # Environment files
├── backend/               # PHP backend (already hosted)
├── vercel.json           # Vercel configuration
└── .vercelignore         # Vercel ignore file
```

## 🔍 Testing Before Deployment

1. **Local Build Test:**
```bash
cd d:\ta\frontend
npm run build
npm run preview
```

2. **API Connection Test:**
   - After deployment, visit: `https://your-app.vercel.app/api-test`
   - Check if all API endpoints are accessible

## 🎯 Expected Results

### After Deployment:
- **Frontend URL**: `https://your-app-name.vercel.app`
- **Backend URL**: `https://api-iot.wibudev.moe`
- **API Test Page**: `https://your-app-name.vercel.app/api-test`

### Key Features Working:
- ✅ User authentication
- ✅ Real-time sensor data
- ✅ Charts and visualizations
- ✅ Fan control
- ✅ Profile management
- ✅ Mobile responsive

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails:**
   ```bash
   # Clear cache and rebuild
   cd d:\ta\frontend
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **API Connection Issues:**
   - Check environment variables in Vercel dashboard
   - Verify CORS settings in backend
   - Test API endpoints manually

3. **Routing Issues:**
   - Ensure `vercel.json` is in root directory
   - Check SPA routing configuration

### Debug Commands:

```bash
# Check if API is accessible
curl https://api-iot.wibudev.moe/api/test

# Test local build
cd d:\ta\frontend
npm run build
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 🎨 Customization Options

### Custom Domain (Optional):
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings
4. Update CORS settings in backend

### Performance Optimization:
- Code splitting already configured
- Assets optimization enabled
- CDN delivery via Vercel

## 📊 Monitoring

### After Deployment:
1. **Test All Features:**
   - Login/Register
   - Sensor data display
   - Charts rendering
   - Fan control
   - Profile management

2. **Performance Check:**
   - Page load times
   - API response times
   - Mobile responsiveness

3. **Error Monitoring:**
   - Check browser console
   - Monitor API errors
   - Test on different devices

## 📝 Next Steps

1. **Deploy Frontend:**
   ```bash
   cd d:\ta
   vercel --prod
   ```

2. **Update Backend CORS:**
   - Add your Vercel domain to backend CORS settings
   - Test API connectivity

3. **Final Testing:**
   - Test all features on production
   - Verify mobile responsiveness
   - Check performance metrics

## 🎉 Success Indicators

When deployment is successful, you should see:
- ✅ Frontend loads at your Vercel URL
- ✅ API test page shows all green checkmarks
- ✅ Login/registration works
- ✅ Sensor data loads correctly
- ✅ Charts display properly
- ✅ Fan control responds
- ✅ Mobile view is responsive

## 📞 Support

If you encounter issues:
1. Check the `/api-test` page for connectivity
2. Verify environment variables in Vercel
3. Check browser console for errors
4. Test API endpoints directly

---

**🚀 Ready to Deploy!** 

Your backend is running at: https://api-iot.wibudev.moe
Your frontend is ready for deployment to Vercel!

Run: `vercel --prod` from the `d:\ta` directory to deploy! 🎯
