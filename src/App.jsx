import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard/dashboard";
import ParentDashboard from './Parents/dashboard';
import ParentsProfile from './Parents/profile';
import TutorDashboard from './Tutor/dashboard';
import TutorsProfile from './Tutor/profile';
import TransactionDashboard from './Transaction/dashboard';
import LoginScreen from './Auth/Login'
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <>
      <title>
        Ustaad
      </title>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginScreen />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="/parent-dashboard" element={<PrivateRoute> <ParentDashboard /> </PrivateRoute>} />
        <Route path="/parent-profile" element={<PrivateRoute> <ParentsProfile /> </PrivateRoute>} />
        <Route
          path="/tutor-dashboard"
          element={
            <PrivateRoute>
              <TutorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tutor-profile"
          element={
            <PrivateRoute>
              <TutorsProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction-dashboard"
          element={
            <PrivateRoute>
              <TransactionDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
