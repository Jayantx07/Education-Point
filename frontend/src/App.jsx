import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/layout/Layout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage')); // Added ProfilePage import
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading...</h3>
                <div className="flex space-x-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="course/:id" element={<CourseDetailsPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="profile" element={<ProfilePage />} /> {/* Added ProfilePage Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
