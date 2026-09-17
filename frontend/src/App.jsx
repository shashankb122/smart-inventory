import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Demand from './pages/Demand';
import AIAdvice from './pages/AIAdvice';
import './App.css';

// Layout wrapper for authenticated pages that shows the Navbar
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Inventory Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedLayout>
              <Sales />
            </ProtectedLayout>
          }
        />
        <Route
          path="/demand"
          element={
            <ProtectedLayout>
              <Demand />
            </ProtectedLayout>
          }
        />
        <Route
          path="/ai-advice"
          element={
            <ProtectedLayout>
              <AIAdvice />
            </ProtectedLayout>
          }
        />

        {/* Default Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
