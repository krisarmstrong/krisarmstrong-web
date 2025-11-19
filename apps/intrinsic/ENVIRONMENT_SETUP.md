# Environment Variables Setup Guide

This document explains how to configure environment variables for the Intrinsic Momentum Mindset website.

## Quick Start

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values in `.env`

3. Never commit `.env` to git (it's in `.gitignore`)

---

## Required Environment Variables

### 1. Contact Form Endpoint (`VITE_FORM_ENDPOINT`)

**Purpose**: Form submission endpoint for the contact form

**Setup with Formspree** (Recommended):
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Click "New Form"
4. Name it "Intrinsic Momentum Contact Form"
5. Copy the endpoint URL (looks like `https://formspree.io/f/xyzabc123`)
6. Add to `.env`:
   ```env
   VITE_FORM_ENDPOINT=https://formspree.io/f/xyzabc123
   ```

**Alternative Services**:
- Formspree (Free tier: 50 submissions/month)
- Form submit (formsubmit.co) - Free
- GetForm (getform.io) - Free tier available
- Custom backend API

---

### 2. PayPal Payment Links

**Purpose**: Payment processing for coaching program registrations

**Setup Steps**:

1. **Create PayPal Business Account**
   - Go to [https://www.paypal.com/business](https://www.paypal.com/business)
   - Sign up or upgrade existing account to Business
   - Complete business verification

2. **Create Payment Buttons**

   For each program, create a payment button:

   a. Log into PayPal Business account

   b. Go to: **Merchant Services** → **PayPal Buttons**

   c. Click **Create New Button**

   d. Configure button:
      - Type: **Buy Now** or **Subscribe** (for recurring)
      - Item name: `Intrinsic Foundations` (or appropriate program name)
      - Price: Set program price
      - Currency: USD (or your currency)

   e. Advanced Options:
      - **Success URL**: `https://intrinsicmomentummindset.com/payment-success`
      - **Cancel URL**: `https://intrinsicmomentummindset.com/services`
      - Collect shipping address: **No** (for coaching services)
      - Collect buyer's email: **Yes**

   f. Click **Create Button**

   g. Copy the button link (not the HTML code, just the URL)

3. **Add to Environment**:
   ```env
   VITE_PAYPAL_INTRINSIC_FOUNDATIONS=https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ABC123
   VITE_PAYPAL_INTRINSIC_MOMENTUM=https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DEF456
   VITE_PAYPAL_MINDSET_IMMERSION=https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GHI789
   ```

**Alternative: PayPal.me Links**:
- Format: `https://paypal.me/yourhandle/AMOUNT`
- Example: `https://paypal.me/intrinsicmomentum/997`
- Simpler but less customizable

**Important Security Notes**:
- The application validates PayPal URLs before redirect
- Only `paypal.com` and `www.paypal.com` domains are allowed
- Invalid URLs will show an error instead of redirecting

---

## Optional Environment Variables

### 3. Sentry Error Tracking (`VITE_SENTRY_DSN`)

**Purpose**: Automated error tracking and monitoring in production

**Setup**:
1. Go to [https://sentry.io/](https://sentry.io/)
2. Sign up for free account
3. Create new project:
   - Platform: **React**
   - Alert frequency: **On every new issue**
4. Copy the DSN from project settings
5. Add to `.env`:
   ```env
   VITE_SENTRY_DSN=https://abc123def456@o789012.ingest.sentry.io/1234567
   ```

**Privacy Configuration**:
The application is configured to:
- Mask all user input text
- Block media URLs
- Not capture sensitive form data
- Sample 10% of normal sessions
- Capture 100% of error sessions

### 4. Application Environment (`VITE_APP_ENV`)

**Purpose**: Distinguishes between development, staging, and production

**Values**:
- `development` - Local development
- `staging` - Staging/test environment
- `production` - Production environment

**Usage**:
```env
# Development
VITE_APP_ENV=development

# Production
VITE_APP_ENV=production
```

---

## Platform-Specific Setup

### Vercel Deployment

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - Name: `VITE_FORM_ENDPOINT`
   - Value: Your Formspree URL
   - Environment: Production (and Preview if needed)
3. Repeat for all variables
4. Redeploy to apply changes

### Netlify Deployment

1. Go to Site Settings → Build & Deploy → Environment
2. Click **Edit variables**
3. Add each variable as Key/Value pairs
4. Click **Save**
5. Trigger new deployment

### Local Development

1. Copy `.env.example` to `.env`
2. Fill in development values:
   ```env
   VITE_FORM_ENDPOINT=https://formspree.io/f/your-test-form
   VITE_PAYPAL_INTRINSIC_FOUNDATIONS=https://paypal.me/test/1.00
   VITE_SENTRY_DSN=
   VITE_APP_ENV=development
   ```
3. Use test/sandbox PayPal links for development

---

## Validation & Testing

### Test Contact Form
1. Run locally: `npm run dev`
2. Navigate to Contact page
3. Fill out form and submit
4. Check Formspree dashboard for submission

### Test Payment Flow
1. Navigate to Services → Register
2. Fill out registration form
3. Click "Continue to Payment"
4. Should redirect to PayPal (use sandbox for testing)

### Test Error Tracking
1. Set `VITE_SENTRY_DSN` in `.env`
2. Run: `npm run dev`
3. Trigger an error intentionally
4. Check Sentry dashboard for error

---

## Security Best Practices

✅ **DO:**
- Keep `.env` files out of git (already in `.gitignore`)
- Use environment variables for all sensitive data
- Use separate values for development and production
- Rotate API keys periodically
- Use PayPal Sandbox for development/testing

❌ **DON'T:**
- Never commit `.env` files to git
- Never hardcode API keys in source code
- Never share `.env` files publicly
- Never use production keys in development

---

## Troubleshooting

### Contact Form Not Working
- ✓ Check `VITE_FORM_ENDPOINT` is set correctly
- ✓ Verify Formspree form is active
- ✓ Check browser console for errors
- ✓ Test with curl:
  ```bash
  curl -X POST https://formspree.io/f/YOUR_ID \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","message":"test"}'
  ```

### PayPal Redirect Not Working
- ✓ Check PayPal URL format is correct
- ✓ Verify URL contains `paypal.com` domain
- ✓ Check browser console for validation errors
- ✓ Test URL directly in browser

### Sentry Errors Not Appearing
- ✓ Verify `VITE_SENTRY_DSN` is set
- ✓ Check Sentry project is active
- ✓ Ensure `VITE_APP_ENV` is not `development` (Sentry only runs in production)
- ✓ Check browser console for Sentry initialization errors

---

## Support

For questions or issues:
- Email: contact@intrinsicmomentummindset.com
- GitHub Issues: [Create an issue](https://github.com/krisarmstrong/intrinsicmomentummindset-com/issues)

---

**Last Updated**: November 2025
**Author**: Kris Armstrong
