import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  BrainCircuit, 
  LogOut, 
  User, 
  Menu, 
  X,
  Boxes
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/sales', label: 'Sales', icon: ShoppingCart },
    { path: '/demand', label: 'Demand Prediction', icon: TrendingUp },
    { path: '/ai-advice', label: 'AI Advice', icon: BrainCircuit },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Boxes className="brand-icon" size={28} />
          <span className="brand-title">Smart Inventory</span>
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="nav-user-section">
            <div className="user-badge">
              <User size={16} />
              <span>{username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
