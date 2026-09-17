import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { 
  Package, 
  Boxes, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  BrainCircuit,
  PlusCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to Spring Boot backend at http://localhost:8081. Verify backend status & CORS settings.');
      } else {
        setError(err.response?.data?.message || 'Failed to load inventory dashboard metrics.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading message="Fetching dashboard metrics from backend..." />;
  }

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Overview</h1>
          <p className="page-subtitle">Real-time metrics, stock levels, and revenue stats</p>
        </div>
        <button className="btn btn-secondary btn-icon" onClick={fetchDashboard} title="Refresh Dashboard">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>
            <strong>Error loading dashboard:</strong> {error}
          </div>
        </div>
      )}

      {data && (
        <>
          {/* KPI Stat Cards Grid */}
          <div className="stats-grid">
            <StatCard
              title="Total Products"
              value={data.totalProducts ?? 0}
              icon={Package}
              color="indigo"
              subtitle="Registered in system"
            />
            <StatCard
              title="Total Stock Units"
              value={(data.totalStockUnits ?? 0).toLocaleString()}
              icon={Boxes}
              color="emerald"
              subtitle="Units currently in inventory"
            />
            <StatCard
              title="Inventory Value"
              value={formatCurrency(data.totalInventoryValue)}
              icon={DollarSign}
              color="blue"
              subtitle="Valuation of stock on hand"
            />
            <StatCard
              title="Total Sales"
              value={data.totalSales ?? 0}
              icon={ShoppingCart}
              color="purple"
              subtitle="Completed sale transactions"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(data.totalRevenue)}
              icon={TrendingUp}
              color="teal"
              subtitle="Gross revenue earned"
            />
            <StatCard
              title="Low Stock Products"
              value={data.lowStockProducts ?? 0}
              icon={AlertTriangle}
              color={data.lowStockProducts > 0 ? 'rose' : 'slate'}
              subtitle={data.lowStockProducts > 0 ? 'Action required immediately' : 'All items sufficiently stocked'}
            />
          </div>

          {/* Quick Actions Panel */}
          <div className="section-card">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <div className="action-card" onClick={() => navigate('/products')}>
                <div className="action-icon-wrapper bg-indigo-light">
                  <Package size={24} className="text-indigo" />
                </div>
                <div className="action-info">
                  <h3>Manage Products</h3>
                  <p>View product catalog & add inventory</p>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </div>

              <div className="action-card" onClick={() => navigate('/sales')}>
                <div className="action-icon-wrapper bg-emerald-light">
                  <PlusCircle size={24} className="text-emerald" />
                </div>
                <div className="action-info">
                  <h3>Record Sale</h3>
                  <p>Process new customer orders & update stock</p>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </div>

              <div className="action-card" onClick={() => navigate('/demand')}>
                <div className="action-icon-wrapper bg-blue-light">
                  <TrendingUp size={24} className="text-blue" />
                </div>
                <div className="action-info">
                  <h3>Demand Prediction</h3>
                  <p>Check reorder points & 7/30 day forecasts</p>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </div>

              <div className="action-card" onClick={() => navigate('/ai-advice')}>
                <div className="action-icon-wrapper bg-purple-light">
                  <BrainCircuit size={24} className="text-purple" />
                </div>
                <div className="action-info">
                  <h3>AI Inventory Advisor</h3>
                  <p>Get AI recommendations & stock risk analysis</p>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </div>
            </div>
          </div>

          {/* Low Stock Items List Section */}
          <div className="section-card">
            <div className="section-header-flex">
              <div>
                <h2 className="section-title">Low Stock Alert Center</h2>
                <p className="section-subtitle">Products requiring immediate reordering</p>
              </div>
              <span className={`badge ${data.lowStockProducts > 0 ? 'badge-danger' : 'badge-success'}`}>
                {data.lowStockProducts > 0 ? `${data.lowStockProducts} Low Stock` : 'Stock Healthy'}
              </span>
            </div>

            {data.lowStockItems && data.lowStockItems.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Current Stock</th>
                      <th>Reorder Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStockItems.map((item, idx) => (
                      <tr key={item.productId || item.id || idx}>
                        <td>#{item.productId || item.id}</td>
                        <td className="font-semibold">{item.productName || item.name}</td>
                        <td className="text-rose font-bold">{item.currentStock || item.stock} units</td>
                        <td>
                          <span className="badge badge-danger">Reorder Required</span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/demand`)}
                          >
                            Check Demand
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon bg-emerald-light">
                  <Boxes size={32} className="text-emerald" />
                </div>
                <h3>No Low Stock Alerts</h3>
                <p>All inventory items are currently above their minimum safety stock threshold.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
