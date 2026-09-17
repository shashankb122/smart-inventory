import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recordSale } from '../services/api';
import { 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  ArrowLeft, 
  TrendingUp, 
  BrainCircuit,
  PackageCheck
} from 'lucide-react';

const Sales = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProductId = location.state?.productId || '';

  const [formData, setFormData] = useState({
    productId: initialProductId,
    quantity: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSale, setLastSale] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pid = parseInt(formData.productId, 10);
    const qty = parseInt(formData.quantity, 10);

    if (isNaN(pid) || pid <= 0) {
      setError('Please enter a valid positive Product ID.');
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity greater than 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await recordSale({
        productId: pid,
        quantity: qty
      });

      setLastSale(response);
    } catch (err) {
      console.error('Failed to record sale:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server at http://localhost:8081. Verify server status and CORS.');
      } else if (err.response && err.response.data) {
        const msg = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || 'Failed to record sale. Please check Product ID & stock availability.';
        setError(msg);
      } else {
        setError('Failed to process sale transaction.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewSale = () => {
    setLastSale(null);
    setFormData({ productId: '', quantity: 1 });
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Record Sale Transaction</h1>
          <p className="page-subtitle">Process customer sales orders and dynamically update inventory stock levels</p>
        </div>
      </div>

      <div className="grid-split">
        {/* Sales Order Form Panel */}
        <div className="section-card">
          <div className="card-header-with-icon">
            <ShoppingCart className="text-emerald" size={24} />
            <h2>Sales Order Form</h2>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="sales-form">
            <div className="form-group">
              <label htmlFor="productId">Product ID *</label>
              <input
                type="number"
                min="1"
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Enter Product ID (e.g. 1)"
                required
              />
              <span className="input-hint">The numeric ID of the product being purchased</span>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity Sold *</label>
              <input
                type="number"
                min="1"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter Quantity (e.g. 5)"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner-small"></span> Processing Sale...
                </span>
              ) : (
                <>
                  <PackageCheck size={18} />
                  <span>Submit Order & Record Sale</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Receipt / Result Panel */}
        <div className="section-card">
          {lastSale ? (
            <div className="receipt-container">
              <div className="receipt-header">
                <div className="receipt-badge bg-emerald-light text-emerald">
                  <CheckCircle2 size={24} />
                  <span>Sale Processed Successfully!</span>
                </div>
                <div className="sale-id-tag">Transaction #{lastSale.saleId || lastSale.id}</div>
              </div>

              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-label">Product Name:</span>
                  <span className="receipt-val font-semibold">{lastSale.productName || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Product ID:</span>
                  <span className="receipt-val font-mono">#{lastSale.productId}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Quantity Sold:</span>
                  <span className="receipt-val font-bold">{lastSale.quantity} units</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Remaining Stock:</span>
                  <span className="receipt-val text-indigo font-bold">{lastSale.remainingStock} units</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Sale Date & Time:</span>
                  <span className="receipt-val">
                    {lastSale.saleDate ? new Date(lastSale.saleDate).toLocaleString() : 'Just Now'}
                  </span>
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-row total-row">
                  <span className="receipt-label">Total Amount:</span>
                  <span className="receipt-val total-amount">{formatCurrency(lastSale.totalAmount)}</span>
                </div>
              </div>

              <div className="receipt-actions">
                <button className="btn btn-secondary btn-block" onClick={handleNewSale}>
                  <Receipt size={16} />
                  <span>Record Another Sale</span>
                </button>
                <div className="btn-row-flex">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/demand', { state: { productId: lastSale.productId } })}
                  >
                    <TrendingUp size={16} />
                    <span>Check Demand</span>
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/ai-advice', { state: { productId: lastSale.productId } })}
                  >
                    <BrainCircuit size={16} />
                    <span>AI Advice</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon bg-emerald-light">
                <Receipt size={36} className="text-emerald" />
              </div>
              <h3>Transaction Receipt Preview</h3>
              <p>Enter a Product ID and Quantity on the left to complete a sale order and view the instant receipt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
