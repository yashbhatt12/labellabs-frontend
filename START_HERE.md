# 🚀 START HERE - LabelLabs Frontend Setup

Welcome! You have the complete LabelLabs frontend ready to go. Follow these steps:

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages. Takes 2-3 minutes.

## Step 2: Test Locally

```bash
npm run dev
```

Open your browser and visit: http://localhost:3000

You should see the LabelLabs homepage with:
- Carousel banner
- 4 category cards
- Featured products (loaded from backend)
- Navigation and footer

## Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name it: `labellabs-frontend`
4. Make it PUBLIC
5. Don't initialize with README
6. Click "Create repository"

## Step 4: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: LabelLabs frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/labellabs-frontend.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username!

## Step 5: Deploy on AWS Amplify

1. Go to https://console.aws.amazon.com/amplify
2. Click "Create app" → "Host web app"
3. Select "GitHub"
4. Connect and authorize
5. Select repository: `labellabs-frontend`
6. Select branch: `main`
7. Confirm build settings (auto-detected for Next.js)
8. **IMPORTANT:** Add environment variables:
   - NEXT_PUBLIC_API_URL = http://16.171.4.87:3001
   - NEXT_PUBLIC_RAZORPAY_KEY = rzp_test_xxxxx
   - NEXT_PUBLIC_APP_NAME = LabelLabs
   - NEXT_PUBLIC_MIN_ORDER_VALUE = 3000
   - NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD = 10000
   - NEXT_PUBLIC_GST_RATE = 18
   - NEXT_PUBLIC_SHIPPING_COST = 300
9. Click "Save and deploy"
10. Wait 5-10 minutes
11. Visit your Amplify domain!

## Important Files

- **package.json** - Dependencies (DO NOT EDIT)
- **.env.local** - Local environment (already configured for you)
- **app/** - All React pages and components
- **.gitignore** - Files to exclude from GitHub
- **README.md** - Project information

## Folder Structure

```
labellabs-frontend/
├── app/                    # All React code
│   ├── components/         # Reusable components
│   ├── lib/               # API client, auth utilities
│   ├── products/          # Products pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Payment page
│   ├── login/             # Login page
│   ├── register/          # Registration (with GST!)
│   ├── orders/            # Order pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── types.ts           # TypeScript types
│   └── globals.css        # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.local             # Environment variables (configured)
├── .env.example           # Template (for reference)
├── .gitignore             # Git ignore rules
└── README.md              # Project info
```

## Backend Connection

Your frontend is configured to call the backend at:
```
http://16.171.4.87:3001
```

Make sure the backend is running before testing features like:
- User registration
- Login
- Fetching products
- Creating orders

## Next Steps After Deployment

1. Test with backend running
2. Deploy backend (if not already done)
3. Test full flow: Register → Login → Browse → Checkout
4. Monitor for errors (Amplify console)
5. Go live! 🚀

## Troubleshooting

### "npm install" fails
- Check Node.js is installed: `node --version`
- Delete node_modules and try again
- Clear npm cache: `npm cache clean --force`

### "npm run dev" shows blank page
- Check backend is running at http://16.171.4.87:3001
- Check .env.local has correct API_URL
- Check browser console (F12) for errors

### Deployment fails on Amplify
- Check build logs in Amplify console
- Verify npm install works locally first
- Ensure all environment variables are set

### API calls not working
- Backend must be running
- Check NEXT_PUBLIC_API_URL in .env.local
- Check Network tab (F12) for exact error

## Support

- Email: support@sna-infotech.co.in
- Phone: 022-42182620
- Hours: Monday-Saturday, 10 AM - 6 PM IST

## You're All Set! 🎉

Everything is configured and ready to go. Just run:

```bash
npm install
npm run dev
```

Enjoy! 🚀
