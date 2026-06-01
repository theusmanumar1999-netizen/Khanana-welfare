# Khanana Welfare Society — Setup Guide

## What This Is
A full-stack welfare society management platform with:
- Member login/register system
- Payment submission (EasyPaisa, JazzCash, Bank, PayPal, Wise)
- Admin verification panel
- Auto email receipts on payment verification
- Monthly reminder emails
- Live dashboard with fund tracking

---

## STEP 1 — Create Firebase Project (Free)

1. Go to **console.firebase.google.com**
2. Click **"Add Project"** → Name: `khanana-welfare`
3. Disable Google Analytics (optional) → Create Project

### Enable Authentication
1. Left menu → **Build → Authentication**
2. Click **"Get started"**
3. Click **Email/Password** → Enable → Save

### Create Firestore Database
1. Left menu → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** → Next
4. Select region: `europe-west3` → Done

### Get Your Config
1. Project Settings (gear icon) → General
2. Scroll to **"Your apps"** → Click **"</>"** (Web)
3. Register app name: `khanana-welfare-web`
4. Copy the `firebaseConfig` object values

---

## STEP 2 — Create .env File

Create a file called `.env` in the project root:

```
VITE_FIREBASE_API_KEY=AIzaSy...your_key
VITE_FIREBASE_AUTH_DOMAIN=khanana-welfare.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=khanana-welfare
VITE_FIREBASE_STORAGE_BUCKET=khanana-welfare.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_RECEIPT=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_REMINDER=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key

VITE_ADMIN_EMAIL=your-admin@gmail.com
```

---

## STEP 3 — Setup EmailJS (Free — 200 emails/month)

1. Go to **emailjs.com** → Sign up free
2. **Email Services** → Add Service → Gmail → Connect your Gmail
3. Copy the **Service ID** → paste in .env

### Create Receipt Template
1. **Email Templates** → Create New Template
2. Name: `khanana_receipt`
3. Subject: `✅ Payment Confirmed — Khanana Welfare Society`
4. Body:
```
Dear {{to_name}},

Your payment has been verified! ✅

━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━
Amount: {{amount}}
Method: {{method}}
Date: {{date}}
Transaction ID: #{{transaction_id}}
Society: {{society_name}}
━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your contribution to Khanana Village!

— Khanana Welfare Society Administration
```
5. Set **To Email**: `{{to_email}}`
6. Save → Copy Template ID

### Create Reminder Template
1. Create another template: `khanana_reminder`
2. Subject: `🔔 Monthly Contribution Due — {{month}} {{year}}`
3. Body:
```
Dear {{to_name}},

This is a friendly reminder that your monthly contribution is due.

Month: {{month}} {{year}}
Amount: {{amount}} (minimum)
Due Date: {{due_date}}

Submit your payment here: {{pay_url}}

— Khanana Welfare Society
```

---

## STEP 4 — Create Admin Account

1. Run the app locally: `npm install && npm run dev`
2. Go to `http://localhost:5173/register`
3. Register with the **same email** as `VITE_ADMIN_EMAIL` in your .env
4. This account automatically gets admin access

---

## STEP 5 — Deploy to Vercel (Free)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B — GitHub (Recommended)
1. Push code to GitHub
2. Go to **vercel.com** → New Project → Import GitHub repo
3. Add Environment Variables (same as .env)
4. Click **Deploy**

Your app will be live at: `https://khanana-welfare.vercel.app`

---

## STEP 6 — Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /payments/{doc} {
      allow read: if request.auth != null && 
        (resource.data.uid == request.auth.uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Custom Domain (Optional)

In Vercel Dashboard → Domains → Add your domain (e.g. khanana-welfare.com)

---

## Support

Developed by **Usman** — Copenhagen, Denmark  
For technical issues, contact the developer.
