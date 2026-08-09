Deployment to Vercel

Quick steps to deploy this Next.js frontend to Vercel:

1. Sign in to Vercel and import the Git repository.
2. In Project Settings -> Environment Variables, add:
   - `NEXT_PUBLIC_API_URL` = `https://fastapi-management-system.onrender.com` (or your backend URL)
3. Set the following build settings (defaults usually work):
   - Build Command: `npm run build`
   - Output Directory: _(leave blank for Next.js)_
4. Deploy. Vercel will run the build and publish the app.

Notes
- Keep your backend URL in Vercel environment variables rather than hardcoding secrets.
- If you want automatic migrations or a server-side backend deploy, deploy the FastAPI backend separately (e.g., Render, Railway) and configure `NEXT_PUBLIC_API_URL` accordingly.
