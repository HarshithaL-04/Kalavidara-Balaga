/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Explore from './pages/Explore';
import PerformerRegistration from './pages/PerformerRegistration';
import PerformerDashboard from './pages/PerformerDashboard';
import AdminPanel from './pages/AdminPanel';
import PerformerProfilePage from './pages/PerformerProfilePage';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'performer' | 'user' }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role && profile?.role !== 'admin') return <Navigate to="/" />; // Admins can see everything
  
  return <>{children}</>;
};


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/performer/:id" element={<PerformerProfilePage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            
            <Route 
              path="/register-performer" 
              element={
                <ProtectedRoute>
                  <PerformerRegistration />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute role="performer">
                  <PerformerDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

