# Netlify Environment Variables Configuration

Add these environment variables to your Netlify site settings:

## Required Variables

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
JWT_SECRET=your_jwt_secret_here
PUBLIC_API_KEY=public_ZFoiP6RZgIOPXH6oyKtvx30tsP0=
PRIVATE_API_KEY=private_edCsm3Wc184mIdfrXGgDyhYPq94=
URL_ENDPOINT=https://ik.imagekit.io/zuyq5smr3
```

## How to Add Them

1. Go to your Netlify Dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Click "Add a variable" for each one above
5. Enter the key and value
6. Click "Save"

## Example Values

```env
GMAIL_USER=myapp@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
JWT_SECRET=my-super-secret-jwt-key-2024
PUBLIC_API_KEY=public_ZFoiP6RZgIOPXH6oyKtvx30tsP0=
PRIVATE_API_KEY=private_edCsm3Wc184mIdfrXGgDyhYPq94=
URL_ENDPOINT=https://ik.imagekit.io/zuyq5smr3
```

## Important Notes

- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the App Password from Google
- The App Password should be exactly 16 characters (no spaces)
- Keep these values secure and don't share them publicly
