# 🚀 DEPLOYMENT & INSTALLATION INSTRUCTIONS

## ⚡ Quick Start (5 Minutes)

### For Development Environment

```bash
# Backend Setup
cd backend
npm install  # Install all dependencies
npm run dev  # Start server (usually on port 5001)

# Frontend Setup (in another terminal)
cd frontend
npm install  # Install all dependencies
npm start    # Start dev server (usually on port 3000)
```

**That's it!** The loan feature will be immediately available on book details pages.

---

## 📋 Pre-Deployment Checklist

### Backend Requirements
- [ ] Node.js installed (v14+)
- [ ] MongoDB running and accessible
- [ ] `.env` file configured with:
  ```
  MONGODB_URI=your_connection_string
  PORT=5001
  CLIENT_DEVELOPMENT_DOMAIN=http://localhost:3000
  CLIENT_PRODUCTION_DOMAIN=your_production_url
  ```
- [ ] All dependencies installed: `npm install`

### Frontend Requirements
- [ ] Node.js installed (v14+)
- [ ] `.env` or configuration ready
- [ ] All dependencies installed: `npm install`
- [ ] Build ready: `npm run build`

---

## 🔧 Configuration

### Backend `.env` File
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookly

# Server
PORT=5001
NODE_ENV=development

# CORS
CLIENT_DEVELOPMENT_DOMAIN=http://localhost:3000
CLIENT_PRODUCTION_DOMAIN=https://your-production-domain.com

# JWT (if used)
JWT_SECRET=your_jwt_secret_key

# Other existing vars
# ... (keep your existing configuration)
```

### Frontend Constants
The frontend uses `frontend/src/constantes.js`. Verify:
```javascript
const env = 'production' // or 'development'
const PRODUCTION_URL = 'https://bookly-1rvp.onrender.com/api'
const DEVELOPMENT_URL = 'http://localhost:5001/api'
```

---

## 📦 Installation Steps

### Step 1: Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Verify Mongoose is installed
npm list mongoose

# Verify Express is installed
npm list express
```

**Output should show:**
```
├── express@^4.21.2
├── mongoose@^8.4.1
└── ... (other packages)
```

### Step 2: Frontend Installation

```bash
cd frontend

# Install dependencies
npm install

# Verify React and Redux
npm list react react-redux @reduxjs/toolkit

# Install missing packages if needed
npm install react-redux @reduxjs/toolkit
```

### Step 3: Verify Database Connection

```bash
# Start backend server
npm run dev

# Check console for:
# ✓ "Server Is Running in Mode on Port 5001"
# ✓ Database connection successful message
```

---

## ✅ Verification Steps

### Test Backend

**1. Start Backend Server**
```bash
cd backend
npm run dev
```

Expected output:
```
Server Is Running in Mode on Port 5001
Database connected successfully (or similar)
```

**2. Test API Endpoints (using curl or Postman)**

Get loan dates (no auth needed):
```bash
curl http://localhost:5001/api/loans/book/any_book_id
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```

### Test Frontend

**1. Start Frontend Server**
```bash
cd frontend
npm start
```

Expected:
- Application opens at http://localhost:3000
- No errors in console

**2. Test Loan Feature**
- Login to application
- Navigate to any book details page
- Look for "Loan This Book" button
- Click button and verify calendar opens
- Try selecting dates
- Verify success/error messages

---

## 🐛 Troubleshooting Deployment

### Issue: "Cannot find module 'mongoose'"

**Solution:**
```bash
cd backend
npm install mongoose
```

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install express
```

### Issue: Frontend cannot reach backend

**Solution:**
1. Verify backend is running: `npm run dev` in backend folder
2. Check API URL in `frontend/src/constantes.js`
3. Verify CORS configuration in `backend/server.js`
4. Check browser console for specific error

### Issue: "Unauthorized" on loan endpoints

**Solution:**
1. Ensure user is logged in
2. Check token is stored: `localStorage.getItem('authToken')` in browser console
3. Verify token format is valid

### Issue: Calendar not displaying

**Solution:**
1. Check browser console for errors
2. Verify CSS files are imported
3. Try clearing browser cache: Ctrl+Shift+Delete
4. Check if LoanButton is in BookDetails.jsx

### Issue: "Book not available" error when selecting dates

**Solution:**
This is expected if:
- Selected dates overlap with existing loans
- Return date is before loan date
- Try selecting different dates that show as available (white) in calendar

---

## 📊 Environment-Specific Setup

### Development

```bash
# Backend
cd backend
NODE_ENV=development npm run dev

# Frontend (separate terminal)
cd frontend
npm start
```

### Production

```bash
# Backend - Build and start
cd backend
NODE_ENV=production npm start

# Frontend - Build and deploy
cd frontend
npm run build
# Deploy build folder to hosting service
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] JWT secrets changed
- [ ] MongoDB credentials updated
- [ ] CORS domains updated to production
- [ ] HTTPS enabled on production
- [ ] Rate limiting configured
- [ ] Error logging configured
- [ ] Database backups scheduled
- [ ] API keys removed from code

---

## 📱 Testing on Different Devices

### Desktop Testing
```bash
npm start  # Runs on localhost:3000
# Open in Chrome/Firefox/Safari
```

### Mobile Testing (localhost)
```bash
# Find your machine's IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from phone:
# http://YOUR_IP:3000
```

### Responsive Testing
```bash
# Open DevTools (F12)
# Click device toolbar (Ctrl+Shift+M)
# Test different screen sizes
```

---

## 🚀 Deployment to Production

### Option 1: Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create backend app
cd backend
heroku create bookly-backend
git push heroku main

# Create frontend app
cd ../frontend
heroku create bookly-frontend
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your_uri -a bookly-backend
```

### Option 2: Self-Hosted VPS

```bash
# SSH into server
ssh user@your_server

# Clone repository
git clone your_repo_url
cd Bookly

# Backend
cd backend
npm install
pm2 start npm -- start
pm2 save

# Frontend
cd ../frontend
npm install
npm run build
# Configure nginx to serve build folder
```

### Option 3: Docker Deployment

Create `Dockerfile` in backend:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t bookly-backend .
docker run -p 5001:5001 bookly-backend
```

---

## 📈 Performance Optimization for Production

### Backend Optimization
```bash
# Enable compression
npm install compression

# Enable caching
npm install node-cache

# Use production dependencies only
npm install --production

# Remove devDependencies
npm prune --production
```

### Frontend Optimization
```bash
# In frontend package.json
npm run build  # Creates optimized build

# Serve with compression
npm install -g serve
serve -s build -l 3000
```

---

## 🔍 Monitoring & Logging

### Backend Logging
Add to `backend/server.js`:
```javascript
// Logging all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Error Tracking
```bash
# Consider using services like:
# - Sentry for error tracking
# - LogRocket for frontend monitoring
# - New Relic for performance monitoring
```

---

## 📋 Post-Deployment Verification

After deploying:

- [ ] Backend API responding
- [ ] Frontend loads without errors
- [ ] Can login successfully
- [ ] Loan button appears on book details
- [ ] Calendar opens without errors
- [ ] Can select dates
- [ ] Can create loans
- [ ] Unavailable dates display correctly
- [ ] Error messages display properly
- [ ] Mobile view works correctly

---

## 🆘 Emergency Rollback

If issues arise:

```bash
# Revert to previous version
git revert HEAD

# Or checkout previous branch
git checkout main
git reset --hard origin/main

# Restart services
npm run dev  # Backend
npm start    # Frontend
```

---

## 📞 Support Resources

### Files for Reference
- `LOAN_FEATURE_DOCUMENTATION.md` - Technical details
- `IMPLEMENTATION_GUIDE.md` - Detailed setup
- `QUICK_REFERENCE.md` - Quick lookup
- `VISUAL_GUIDE.md` - Architecture diagrams

### Common Fixes
1. **Port already in use**: Change PORT in .env or kill process
2. **Dependencies not found**: Run `npm install` again
3. **Database connection error**: Check MongoDB connection string
4. **CORS errors**: Verify CORS configuration in server.js

---

## ✨ Final Deployment Checklist

- [x] All files created
- [x] No errors in code
- [x] Database models created
- [x] API endpoints working
- [x] Frontend components integrated
- [x] Redux configured
- [x] Documentation complete
- [ ] Backend running (do this next)
- [ ] Frontend running (do this next)
- [ ] Testing completed (do this next)
- [ ] Production deployment (do this next)

---

## 🎉 You're Ready!

Your Bookly application with Loan Management is ready for deployment!

**Next Steps:**
1. Follow setup instructions above
2. Run `npm install` in both folders
3. Start backend: `npm run dev`
4. Start frontend: `npm start`
5. Test the feature
6. Deploy to production

**Questions?** Check the documentation files in the project root.

---

**Happy deploying!** 🚀
