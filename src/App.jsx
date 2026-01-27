import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
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
import ContractDashboard from './Contracts/dashboard';

function App() {
  return (
    <>
      <title>Ustaad Admin Side</title>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginScreen />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/parent-dashboard"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <ParentDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/parent-profile/:id"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <ParentsProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/tutor-dashboard"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <TutorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/tutor-profile/:id"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <TutorsProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/transaction-dashboard"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <TransactionDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admins-dashboard"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN"]}>
              <AdminsDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/pending-users"
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <PendingUsersDashboard />
            </PrivateRoute>
          }
        />

        <Route 
          path="/contracts-dashboard" 
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN","ADMIN"]}>
              <ContractDashboard/>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/pending-users/:userId" 
          element={
            <PrivateRoute requiredRole={["SUPER_ADMIN", "ADMIN"]}>
              <UserDetail />
            </PrivateRoute>
          }
        />

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    </>
  );
}

export default App;
