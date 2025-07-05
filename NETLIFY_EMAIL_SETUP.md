# 🔧 Netlify Email Setup Guide

## 🚨 Current Issue

The OTP (One-Time Password) system is not working on Netlify because the Gmail SMTP credentials are not configured.

## ✅ Quick Fix (Development Mode)

The system now has a fallback mode that will:

1. ✅ Allow signup to continue without email
2. ✅ Log OTP codes to the browser console
3. ✅ Show OTP codes in the UI for testing
4. ✅ Work immediately without configuration

## 🔧 Permanent Fix (Production Email)

### Step 1: Set up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate an App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Configure Netlify Environment Variables

1. **Go to your Netlify Dashboard**
2. **Navigate to your site settings**:
   - Click on your site
   - Go to "Site settings" → "Environment variables"
3. **Add these variables**:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
JWT_SECRET=your_jwt_secret_here
PUBLIC_API_KEY=public_ZFoiP6RZgIOPXH6oyKtvx30tsP0=
PRIVATE_API_KEY=private_edCsm3Wc184mIdfrXGgDyhYPq94=
URL_ENDPOINT=https://ik.imagekit.io/zuyq5smr3
```

### Step 3: Redeploy Your Site

1. Go to **Deploys** in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

### Step 4: Test the Setup

1. Visit your site
2. Try to sign up as a retailer
3. Check if you receive the email with OTP
4. If not, check the browser console for the OTP code

## 🧪 Testing Commands

### Test Email Configuration

```bash
# Visit this URL to test your email setup
https://your-site.netlify.app/api/test-email-config
```

### Expected Response

```json
{
  "envCheck": {
    "GMAIL_USER": true,
    "GMAIL_APP_PASSWORD": true,
    "JWT_SECRET": true,
    "PUBLIC_API_KEY": true,
    "PRIVATE_API_KEY": true,
    "URL_ENDPOINT": true
  },
  "emailConfigTest": "✅ Email configuration is valid",
  "environment": "production"
}
```

## 🔍 Troubleshooting

### Issue: "Invalid login" error

**Solution**:

- Double-check your Gmail username and app password
- Make sure 2FA is enabled
- Generate a new app password

### Issue: "SMTP connection failed"

**Solution**:

- Check your internet connection
- Verify Gmail SMTP settings are correct
- Try using a different Gmail account

### Issue: OTP not sending

**Solution**:

1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Test with the `/api/test-email-config` endpoint

## 🚀 Alternative Email Services

If Gmail doesn't work, you can use other email services:

### Option 1: SendGrid

```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Option 2: Mailgun

```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_domain.com
```

### Option 3: AWS SES

```env
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
AWS_SES_REGION=us-east-1
```

## 📞 Support

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Test the email config endpoint** at `/api/test-email-config`
3. **Verify your Gmail settings** are correct
4. **Try the development mode** first to ensure the system works

## 🎯 Quick Start (No Email Setup)

If you just want to test the system without email setup:

1. The system will automatically detect missing email configuration
2. OTP codes will be logged to the browser console
3. You can complete signup using the console OTP
4. This works immediately without any configuration

---

**Note**: The development mode is designed to work without email configuration, making it perfect for testing and development. For production, you should configure proper email credentials.
