import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/dashboard";
import ParentDashboard from './Parents/dashboard';
import ParentsProfile from './Parents/profile';
import TutorDashboard from './Tutor/dashboard';
import TutorsProfile from './Tutor/profile';
import TransactionDashboard from './Transaction/dashboard';
import AdminsDashboard from './Admins/dashboard';
import PendingUsersDashboard from './PendingUsers/dashboard';
import UserDetail from './PendingUsers/UserDetail';
import LoginScreen from './Auth/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <title>
        Ustaad
      </title>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginScreen/>} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/parent-dashboard" 
          element={
            <PrivateRoute>
              <ParentDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/parent-profile/:id" 
          element={
            <PrivateRoute>
              <ParentsProfile/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/tutor-dashboard" 
          element={
            <PrivateRoute>
              <TutorDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/tutor-profile/:id" 
          element={
            <PrivateRoute>
              <TutorsProfile/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/transaction-dashboard" 
          element={
            <PrivateRoute>
              <TransactionDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admins-dashboard" 
          element={
            <PrivateRoute>
              <AdminsDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/pending-users" 
          element={
            <PrivateRoute>
              <PendingUsersDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/pending-users/:userId" 
          element={
            <PrivateRoute>
              <UserDetail/>
            </PrivateRoute>
          } 
        />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<LoginScreen/>} />
      </Routes>
    </>
  );
}

export default App;
