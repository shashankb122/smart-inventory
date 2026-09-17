import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAIAdvice } from '../services/api';
import Loading from '../components/Loading';
import { 
  BrainCircuit, 
  Search, 
  AlertCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp,
  ArrowRight,
  Boxes
} from 'lucide-react';

const AIAdvice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProductId = location.state?.productId || '1';

  const [productIdInput, setProductIdInput] = useState(initialProductId);
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdvice = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');

    try {
      const result = await getAIAdvice(idToFetch);
      setAdviceData(result);
    } catch (err) {
      console.error('Failed to fetch AI advice:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server at http://localhost:8081. Verify server status and CORS.');
      } else if (err.response?.status === 404) {
        setError(`Product ID #${idToFetch} was not found in the inventory system.`);
      } else {
        setError(err.response?.data?.message || `Failed to generate AI advice for Product ID #${idToFetch}.`);
      }
      setAdviceData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProductId) {
      fetchAdvice(initialProductId);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!productIdInput.trim()) {
      setError('Please enter a valid Product ID.');
      return;
    }
    fetchAdvice(productIdInput.trim());
  };

  const getRiskBadgeInfo = (riskLevel = '') => {
    const level = riskLevel.toUpperCase();
    if (level === 'LOW') {
      return { class: 'risk-low', label: 'LOW RISK', icon: ShieldCheck };
    }
    if (level === 'MEDIUM' || level === 'MODERATE') {
      return { class: 'risk-medium', label: 'MEDIUM RISK', icon: AlertTriangle };
    }
    if (level === 'HIGH' || level === 'CRITICAL') {
      return { class: 'risk-high', label: 'HIGH RISK', icon: AlertTriangle };
    }
    return { class: 'risk-medium', label: riskLevel || 'UNKNOWN RISK', icon: AlertCircle };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex-align">
            <BrainCircuit className="text-purple" size={28} />
            <span>AI Inventory Advisor</span>
          </h1>
          <p className="page-subtitle">GenAI driven stock risk analysis and automated inventory optimization</p>
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
              placeholder="Enter Product ID for AI analysis (e.g. 1)..."
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-purple btn-icon">
            <Sparkles size={18} />
            <span>Generate AI Insights</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading && <Loading message={`Generating AI advisory report for Product #${productIdInput}...`} />}

      {!loading && adviceData && (
        <div className="ai-advisor-panel">
          {/* AI Banner Card */}
          <div className="ai-card-header">
            <div className="ai-brand-badge">
              <Sparkles size={16} />
              <span>AI Engine Analysis</span>
            </div>
            <div className="ai-product-details">
              <span className="product-id-tag">Product ID #{adviceData.productId}</span>
              <h2>{adviceData.productName || 'Wireless Mouse'}</h2>
            </div>
          </div>

          <div className="ai-card-content">
            {/* Risk Assessment & Recommendation Row */}
            <div className="ai-summary-grid">
              <div className="ai-stat-box">
                <span className="ai-box-label">Calculated Risk Level</span>
                {(() => {
                  const riskInfo = getRiskBadgeInfo(adviceData.riskLevel);
                  const IconComp = riskInfo.icon;
                  return (
                    <div className={`risk-pill ${riskInfo.class}`}>
                      <IconComp size={18} />
                      <span>{riskInfo.label}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="ai-stat-box">
                <span className="ai-box-label">Recommended Strategy</span>
                <div className="recommendation-text">{adviceData.recommendation || 'Maintain stock levels'}</div>
              </div>
            </div>

            {/* Detailed AI Explanation Box */}
            <div className="ai-explanation-box">
              <div className="explanation-title flex-align">
                <BrainCircuit size={20} className="text-purple" />
                <span>Detailed Advisory Breakdown</span>
              </div>
              <p className="explanation-body">
                {adviceData.explanation || 'No explanation provided by AI service.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="ai-actions-row">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/demand', { state: { productId: adviceData.productId } })}
              >
                <TrendingUp size={16} />
                <span>View Full Demand Metrics</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/sales', { state: { productId: adviceData.productId } })}
              >
                <Boxes size={16} />
                <span>Record New Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !adviceData && !error && (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-icon bg-purple-light">
              <BrainCircuit size={36} className="text-purple" />
            </div>
            <h3>AI Advisory Console</h3>
            <p>Enter a Product ID above to trigger AI stock risk classification and automated order optimization.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvice;
