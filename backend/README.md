# Education Point Backend

This is the backend API for the Education Point web application.

## Deployment on Render

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: education-point-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start

### Environment Variables

Make sure to set the following environment variables in Render:

- `PORT`: 10000 (or any port Render assigns)
- `NODE_ENV`: production
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `EMAIL_USER`: Your email for sending notifications
- `EMAIL_PASS`: Your email password or app password

## API Documentation

The API is available at the following endpoints:

- `/api/courses` - Course management
- `/api/users` - User management
- `/api/contact` - Contact form submissions
- `/api/testimonials` - Testimonials management

## Local Development

```bash
npm install
npm run dev
```