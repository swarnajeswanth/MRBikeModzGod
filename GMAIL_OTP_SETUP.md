# Gmail OTP Authentication Setup Guide

This guide will help you set up Gmail OTP (One-Time Password) authentication for retailer signup in your MrBikeModzGod application.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. Access to Google Account settings

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. This is required to generate App Passwords

## Step 2: Generate Gmail App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as device
4. Enter a name like "MrBikeModzGod OTP"
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
   nkbp tsix hjzp buad

## Step 3: Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# Gmail OTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Example:
# GMAIL_USER=myapp@gmail.com
# GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

## Step 4: Install Dependencies

Make sure you have the required packages installed:

```bash
npm install nodemailer @types/nodemailer
```

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Go to the signup page
3. Select "Retailer" as account type
4. Enter your email and password
5. Click "Register"
6. Check your email for the verification code

## How It Works

### For Customers:

- Direct signup without email verification
- Immediate account creation

### For Retailers:

1. User fills signup form and selects "Retailer"
2. System sends 6-digit OTP to their email
3. User enters the OTP code
4. System verifies the code
5. Account is created and user is logged in

## Security Features

- **OTP Expiration**: Codes expire after 10 minutes
- **One-time Use**: Each OTP can only be used once
- **Role-based**: Only retailers require email verification
- **Email Validation**: Validates email format before sending OTP
- **Rate Limiting**: Prevents spam by deleting old OTPs

## Troubleshooting

### "Failed to send verification email"

- Check your GMAIL_USER and GMAIL_APP_PASSWORD
- Ensure 2-Factor Authentication is enabled
- Verify the App Password is correct (16 characters, no spaces)

### "Invalid or expired verification code"

- Codes expire after 10 minutes
- Each code can only be used once
- Check your email spam folder

### "Gmail credentials not configured"

- Make sure `.env.local` file exists
- Verify environment variables are set correctly
- Restart your development server after changing environment variables

## Email Template

The system sends professional HTML emails with:

- Your store branding
- Clear instructions
- Security warnings
- Professional styling

## Customization

You can customize the email template in `src/components/lib/emailUtils.ts`:

- Change email subject
- Modify HTML template
- Update branding colors
- Add custom styling

## Production Deployment

For production deployment:

1. Use environment variables in your hosting platform
2. Consider using a dedicated email service (SendGrid, AWS SES)
3. Implement rate limiting
4. Add monitoring and logging
5. Set up email delivery tracking

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Gmail credentials
3. Test with a different email address
4. Check server logs for detailed error messages
