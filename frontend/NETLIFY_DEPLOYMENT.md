# Netlify Deployment Guide

This guide will help you deploy your Education Point frontend to Netlify.

## Prerequisites

- Your backend is already deployed to Render at: https://education-point.onrender.com
- You have a GitHub repository with your code

## Deployment Steps

### 1. Push your code to GitHub

Make sure all your changes are committed and pushed to your GitHub repository.

### 2. Sign up/Login to Netlify

Go to [Netlify](https://www.netlify.com/) and sign up or log in.

### 3. Create a new site from Git

- Click on "New site from Git"
- Choose your Git provider (GitHub)
- Authorize Netlify to access your repositories
- Select your Education Point repository

### 4. Configure build settings

- **Branch to deploy**: `main` (or your default branch)
- **Build command**: `cd frontend && npm install && npm run build`
- **Publish directory**: `frontend/dist`

### 5. Advanced build settings

Add the following environment variable:
- Key: `VITE_API_URL`
- Value: `https://education-point.onrender.com/api`

### 6. Deploy site

Click on "Deploy site" and wait for the build to complete.

### 7. Configure custom domain (optional)

- Go to "Domain settings"
- Click on "Add custom domain"
- Follow the instructions to set up your custom domain

## Troubleshooting

- If you encounter CORS issues, make sure your backend's CORS configuration includes your Netlify domain.
- If you see a "Page not found" error when refreshing routes, check that the Netlify redirects are properly configured.

## Monitoring

After deployment, monitor your application to ensure it's working correctly:
- Test all API calls
- Check for any console errors
- Verify that all features are working as expected

## Updating Your Deployment

Any new commits pushed to your GitHub repository will automatically trigger a new build on Netlify.