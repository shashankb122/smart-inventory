import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && <div className="stat-icon-wrapper"><Icon className="stat-icon" size={22} /></div>}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
