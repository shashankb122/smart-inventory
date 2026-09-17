import React, { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStock
} from '../services/api';
import Loading from '../components/Loading';
import { 
  Package, 
  Plus, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X,
  TrendingUp,
  BrainCircuit,
  ShoppingCart,
  Pencil,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    currentStock: '',
    minimumStock: '',
    leadTimeDays: '',
    supplier: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [stockProduct, setStockProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAmount, setStockAmount] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProductsList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to Spring Boot backend at http://localhost:8081. Verify server status and CORS.');
      } else if (err.response?.status === 404) {
        setError('The GET /api/products endpoint returned 404. Ensure your Spring Boot product controller is configured.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch product list from backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      newProduct.currentStock === '' ||
      newProduct.minimumStock === '' ||
      newProduct.leadTimeDays === '' ||
      !newProduct.supplier
    ) {
      setFormError('Please fill in all product fields.');
      return;
    }

    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        currentStock: parseInt(newProduct.currentStock, 10),
        minimumStock: parseInt(newProduct.minimumStock, 10),
        leadTimeDays: parseInt(newProduct.leadTimeDays, 10),
        supplier: newProduct.supplier
      };

      console.log('Creating product:', payload);

      await createProduct(payload);

      setFormSuccess('Product created successfully!');

      setNewProduct({
        name: '',
        category: '',
        price: '',
        currentStock: '',
        minimumStock: '',
        leadTimeDays: '',
        supplier: ''
      });

      setTimeout(() => {
        setShowAddModal(false);
        setFormSuccess('');
        fetchProductsList();
      }, 1200);

    } catch (err) {
      console.error('Failed to create product:', err);

      if (err.response?.data) {
        const msg =
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data.message || 'Failed to create product.';

        setFormError(msg);
      } else {
        setFormError('Failed to create product. Check backend API logs.');
      }

    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      id: product.id || product.productId,
      name: product.name || product.productName || '',
      price: product.price ?? '',
      category: product.category || '',
      currentStock: product.currentStock ?? product.stock ?? product.stockQuantity ?? 0,
      minimumStock: product.minimumStock ?? '',
      supplier: product.supplier || '',
      leadTimeDays: product.leadTimeDays ?? ''
    });

    setFormError('');
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !editingProduct.name ||
      editingProduct.price === '' ||
      !editingProduct.category ||
      editingProduct.minimumStock === '' ||
      !editingProduct.supplier ||
      editingProduct.leadTimeDays === ''
    ) {
      setFormError('Please fill in all product fields.');
      return;
    }

    setActionLoading(true);
    setFormError('');

    try {
      const payload = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: parseFloat(editingProduct.price),
        currentStock: parseInt(editingProduct.currentStock, 10),
        minimumStock: parseInt(editingProduct.minimumStock, 10),
        supplier: editingProduct.supplier,
        leadTimeDays: parseInt(editingProduct.leadTimeDays, 10)
      };

      await updateProduct(editingProduct.id, payload);

      setShowEditModal(false);
      setEditingProduct(null);

      await fetchProductsList();

    } catch (err) {
      console.error('Failed to update product:', err);

      setFormError(
        err.response?.data?.message ||
        'Failed to update product.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    if (stockAmount === '' || Number(stockAmount) < 0) {
      setFormError('Please enter a valid stock quantity.');
      return;
    }

    setActionLoading(true);
    setFormError('');

    try {
      const id = stockProduct.id || stockProduct.productId;
      await updateProductStock(
        id,
        parseInt(stockAmount, 10)
      );

      setShowStockModal(false);
      setStockProduct(null);
      setStockAmount('');

      await fetchProductsList();

    } catch (err) {
      console.error('Failed to update stock:', err);

      setFormError(
        err.response?.data?.message ||
        'Failed to update stock.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = p.name || p.productName || '';
    const id = (p.id || p.productId || '').toString();
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || id.includes(query);
  });

  if (loading) {
    return <Loading message="Loading product list from backend..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Management</h1>
          <p className="page-subtitle">View and manage inventory product catalog</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-secondary btn-icon" onClick={fetchProductsList}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-icon" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>
            <strong>Product API Alert:</strong> {error}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-stats">
          Total: <strong>{products.length}</strong> products
        </div>
      </div>

      {/* Products Table */}
      <div className="section-card">
        {filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Price ($)</th>
                  <th>Stock Quantity</th>
                  <th>Stock Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const id = product.id || product.productId || (idx + 1);
                  const name = product.name || product.productName || 'Unnamed Product';
                  const price = product.price != null ? Number(product.price).toFixed(2) : '0.00';
                  const stock = product.currentStock ?? product.stock ?? product.stockQuantity ?? 0;
                  const minimumStock = product.minimumStock ?? 10;
                  const isLowStock = stock <= minimumStock;

                  return (
                    <tr key={id}>
                      <td className="font-mono">#{id}</td>
                      <td className="font-semibold text-primary">{name}</td>
                      <td>${price}</td>
                      <td className="font-bold">{stock} units</td>
                      <td>
                        <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`}>
                          {isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-inline">
                          {/* Record Sale */}
                          <button 
                            className="btn-icon-action"
                            title="Record Sale"
                            onClick={() => navigate('/sales', { state: { productId: id } })}
                          >
                            <ShoppingCart size={16} />
                          </button>

                          {/* Edit Product */}
                          <button
                            className="btn-icon-action"
                            title="Edit Product"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Increase Stock */}
                          <button
                            className="btn-icon-action"
                            title="Add Stock"
                            onClick={() => {
                              setStockProduct(product);
                              setStockAmount('');
                              setFormError('');
                              setShowStockModal(true);
                            }}
                          >
                            <PlusCircle size={16} />
                          </button>

                          {/* Demand Prediction */}
                          <button 
                            className="btn-icon-action"
                            title="Demand Prediction"
                            onClick={() => navigate('/demand', { state: { productId: id } })}
                          >
                            <TrendingUp size={16} />
                          </button>

                          {/* AI Advice */}
                          <button 
                            className="btn-icon-action"
                            title="AI Advice"
                            onClick={() => navigate('/ai-advice', { state: { productId: id } })}
                          >
                            <BrainCircuit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon bg-indigo-light">
              <Package size={36} className="text-indigo" />
            </div>
            <h3>{searchQuery ? 'No matching products found' : 'No products available'}</h3>
            <p>
              {searchQuery
                ? 'Try adjusting your search query to find the item.'
                : 'Get started by adding your first product to the inventory.'}
            </p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              <span>Add First Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title flex-align">
                <Package size={20} className="text-indigo" />
                <span>Add New Product</span>
              </div>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Mouse"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 89.99"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currentStock">Initial Stock *</label>
                  <input
                    type="number"
                    min="0"
                    id="currentStock"
                    name="currentStock"
                    value={newProduct.currentStock}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minimumStock">Minimum Stock *</label>
                  <input
                    type="number"
                    min="0"
                    id="minimumStock"
                    name="minimumStock"
                    value={newProduct.minimumStock}
                    onChange={handleInputChange}
                    placeholder="e.g. 10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="leadTimeDays">Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    id="leadTimeDays"
                    name="leadTimeDays"
                    value={newProduct.leadTimeDays}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier *</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={newProduct.supplier}
                  onChange={handleInputChange}
                  placeholder="e.g. Logitech"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title flex-align">
                <Pencil size={20} className="text-indigo" />
                <span>Edit Product</span>
              </div>

              <button
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleUpdateProduct}
              className="modal-form"
            >
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.minimumStock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        minimumStock: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.leadTimeDays}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        leadTimeDays: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Supplier *</label>
                <input
                  type="text"
                  value={editingProduct.supplier}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      supplier: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showStockModal && stockProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title flex-align">
                <PlusCircle size={20} className="text-indigo" />
                <span>Update Stock</span>
              </div>

              <button
                className="btn-close"
                onClick={() => setShowStockModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleUpdateStock}
              className="modal-form"
            >
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={stockProduct.name || stockProduct.productName || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="text"
                  value={`${stockProduct.currentStock ?? stockProduct.stock ?? stockProduct.stockQuantity ?? 0} units`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>New Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={stockAmount}
                  onChange={(e) => {
                    setStockAmount(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g. 150"
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStockModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Updating...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;