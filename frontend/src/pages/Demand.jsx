import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDemandPrediction } from '../services/api';
import Loading from '../components/Loading';
import { 
  TrendingUp, 
  Search, 
  AlertCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle,
  BrainCircuit,
  Boxes
} from 'lucide-react';

const formatUnits = (value) => {
  const number = Number(value ?? 0);

  if (number === 0) {
    return '0 units';
  }

  if (number < 1) {
    return `≈ ${number.toFixed(1)} units`;
  }

  return `≈ ${Math.round(number)} units`;
};

const formatDailySales = (value) => {
  const number = Number(value ?? 0);

  if (number === 0) {
    return '0 units/day';
  }

  return `${number.toFixed(2)} units/day`;
};

const Demand = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProductId = location.state?.productId || '1';

  const [productIdInput, setProductIdInput] = useState(initialProductId);
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDemand = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');

    try {
      const result = await getDemandPrediction(idToFetch);
      setDemandData(result);
    } catch (err) {
      console.error('Failed to fetch demand prediction:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server at http://localhost:8081. Verify server status and CORS.');
      } else if (err.response?.status === 404) {
        setError(`Product ID #${idToFetch} was not found in the inventory database.`);
      } else {
        setError(err.response?.data?.message || `Failed to fetch demand metrics for Product ID #${idToFetch}.`);
      }
      setDemandData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProductId) {
      fetchDemand(initialProductId);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!productIdInput.trim()) {
      setError('Please enter a valid Product ID.');
      return;
    }
    fetchDemand(productIdInput.trim());
  };

  const getRecommendationBadge = (rec = '') => {
    const text = rec.toUpperCase();
    if (text.includes('SUFFICIENT') || text.includes('SAFE') || text.includes('HEALTHY')) {
      return { class: 'badge-success', icon: CheckCircle, text: rec };
    }
    if (text.includes('REORDER') || text.includes('LOW') || text.includes('CRITICAL')) {
      return { class: 'badge-danger', icon: AlertTriangle, text: rec };
    }
    return { class: 'badge-warning', icon: AlertCircle, text: rec };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Demand Prediction & Analytics</h1>
          <p className="page-subtitle">Algorithmic safety stock, lead time analysis, and 7/30 day demand forecasting</p>
        </div>
      </div>

      {/* Lookup Form */}
      <div className="filter-card">
        <form onSubmit={handleSearch} className="search-form-flex">
          <div className="search-input-wrapper flex-grow">
            <Search size={18} className="search-icon" />
            <input
              type="number"
              min="1"
              className="search-input"
              placeholder="Enter Product ID to predict demand (e.g. 1)..."
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-icon">
            <TrendingUp size={18} />
            <span>Analyze Demand</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading && <Loading message={`Calculating demand forecasting for Product #${productIdInput}...`} />}

      {!loading && demandData && (
        <>
          {/* Main Product Header Card */}
          <div className="section-card demand-header-card">
            <div className="demand-product-info">
              <div className="product-tag">Product ID #{demandData.productId}</div>
              <h2 className="demand-product-name">{demandData.productName || 'Unnamed Product'}</h2>
              <div className="stock-level-badge">
                <Boxes size={18} />
                <span>Current Stock: <strong>{demandData.currentStock ?? 0} units</strong></span>
              </div>
            </div>

            <div className="recommendation-box">
              <span className="recommendation-label">System Recommendation</span>
              {(() => {
                const badge = getRecommendationBadge(demandData.recommendation);
                const IconComp = badge.icon;
                return (
                  <div className={`recommendation-badge ${badge.class}`}>
                    <IconComp size={20} />
                    <span>{badge.text}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Forecast & Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-header">
                <Calendar size={18} className="text-indigo" />
                <span>Estimated 7-Day Demand</span>
              </div>
              <div className="metric-value">{formatUnits(demandData.estimated7DayDemand)}</div>
              <div className="metric-desc">Expected sales over the next 7 days</div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <Calendar size={18} className="text-teal" />
                <span>Estimated 30-Day Demand</span>
              </div>
              <div className="metric-value">{formatUnits(demandData.estimated30DayDemand)}</div>
              <div className="metric-desc">Expected sales over the next 30 days</div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <TrendingUp size={18} className="text-emerald" />
                <span>Average Daily Sales</span>
              </div>
              <div className="metric-value">{formatDailySales(demandData.averageDailySales)}</div>
            <div className="metric-desc">
  {Number(demandData.averageDailySales ?? 0) > 0
    ? `Typical sales rate: ~${Number(demandData.averageDailySales).toFixed(1)} units/day`
    : 'No sales recorded yet'}
</div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <Clock size={18} className="text-amber" />
                <span>Lead Time</span>
              </div>
              <div className="metric-value">{demandData.leadTimeDays ?? 0} Days</div>
              <div className="metric-desc">Vendor fulfillment lead time</div>
            </div>
          </div>

          {/* Advanced Safety Stock & Reorder Point Details */}
          <div className="section-card">
            <h2 className="section-title">Reorder Point & Inventory Buffer Parameters</h2>
            <div className="parameters-grid">
              <div className="parameter-card">
                <div className="param-title">Lead Time Demand</div>
                <div className="param-value">{Number(demandData.leadTimeDemand ?? 0).toFixed(2)} units</div>
                <p className="param-text">Expected demand while awaiting vendor order delivery.</p>
              </div>

              <div className="parameter-card">
                <div className="param-title">Safety Stock</div>
                <div className="param-value text-indigo">{Number(demandData.safetyStock ?? 0).toFixed(2)} units</div>
                <p className="param-text">Buffer inventory maintained to guard against demand spikes.</p>
              </div>

              <div className="parameter-card highlight-param">
                <div className="param-title">Calculated Reorder Point</div>
                <div className="param-value text-rose">{Number(demandData.reorderPoint ?? 0).toFixed(2)} units</div>
                <p className="param-text">Stock trigger point at which a new order must be placed.</p>
              </div>
            </div>

            <div className="demand-footer-flex">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/ai-advice', { state: { productId: demandData.productId } })}
              >
                <BrainCircuit size={18} />
                <span>Get AI Strategic Advice for this Product</span>
              </button>
            </div>
          </div>
        </>
      )}

      {!loading && !demandData && !error && (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-icon bg-indigo-light">
              <TrendingUp size={36} className="text-indigo" />
            </div>
            <h3>Demand Analytics Lookup</h3>
            <p>Enter a numeric Product ID above to calculate stock burn rate, lead time demand, and 30-day forecast.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demand;