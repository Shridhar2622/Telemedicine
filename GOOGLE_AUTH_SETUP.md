# Google OAuth Setup Guide

## 🎯 What's Been Implemented

✅ Backend Google OAuth integration  
✅ User model updated for Google auth  
✅ Google login button on login page  
✅ Automatic redirect after Google login  
✅ Session management with Passport.js  

---

## 📋 Setup Steps

### **Step 1: Get Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Configure consent screen:
   - User Type: External
   - App name: Telemedicine App
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Telemedicine OAuth
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

---

### **Step 2: Update Backend .env File**

Create or update `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
SESSION_SECRET=your_random_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (if using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

### **Step 3: Start Backend Server**

```bash
cd backend
npm install
npm start
```

Or with nodemon:
```bash
nodemon server.js
```

---

### **Step 4: Start Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔄 How It Works

### **Flow Diagram:**

```
User clicks "Continue with Google"
    ↓
Redirects to Google login page
    ↓
User selects Google account
    ↓
Google redirects to: /api/auth/google/callback
    ↓
Backend creates/finds user in database
    ↓
Backend generates JWT token
    ↓
Redirects to frontend: /auth/google/success?token=xxx&role=xxx
    ↓
Frontend saves token to localStorage
    ↓
Redirects based on role:
  - Patient → /patient/homepage
  - Doctor → Check profile status
    - If incomplete → /doctor/complete-profile
    - If complete → /doctor/dashboard
```

---

## 🧪 Testing Google Auth

1. Start both backend and frontend servers
2. Go to `http://localhost:5173/login`
3. Click **"Continue with Google"** button
4. Select your Google account
5. You should be redirected back and logged in automatically

---

## 🛡️ Security Features

✅ Email auto-verified for Google users  
✅ No password stored for Google auth users  
✅ Unique Google ID prevents duplicate accounts  
✅ Session secret for added security  
✅ CORS configured for frontend only  

---

## 📝 API Endpoints

### Google OAuth Routes:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/google` | GET | Initiates Google OAuth flow |
| `/api/auth/google/callback` | GET | Google redirects here after auth |
| `/api/auth/google/failure` | GET | Handles auth failures |

---

## 🔧 Troubleshooting

### **Error: "redirect_uri_mismatch"**
- Check your Google Console redirect URIs match exactly:
  - `http://localhost:3000/api/auth/google/callback`

### **Error: "Invalid credentials"**
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Make sure there are no extra spaces

### **User not created in database**
- Check MongoDB connection
- Verify User model is updated with googleId field

### **Redirect not working**
- Check FRONTEND_URL in .env matches your frontend port
- Verify CORS settings in server.js

---

## 📦 Installed Packages

```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "express-session": "^1.18.0"
}
```

---

## 🎨 Frontend Integration

The Google login button appears on:
- Login page (`/login`)

Automatic redirects:
- After login → `/auth/google/success` (handles token)
- Patients → `/patient/homepage`
- Doctors → `/doctor/complete-profile` or `/doctor/dashboard`

---

## 🚀 Production Deployment

When deploying to production:

1. Update redirect URIs in Google Console:
   - Add your production domain
   - Example: `https://yourdomain.com/api/auth/google/callback`

2. Update .env variables:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. Enable HTTPS for secure OAuth

---

## ✨ Features Included

- ✅ One-click Google login
- ✅ Auto account creation
- ✅ Profile picture from Google
- ✅ Email verification skipped for Google users
- ✅ Seamless integration with existing auth system
- ✅ Support for both local and Google auth

---

## 📞 Support

If you encounter any issues:
1. Check all .env variables are set correctly
2. Verify Google Console settings
3. Check browser console for errors
4. Check backend logs for detailed errors
