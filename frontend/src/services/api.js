import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');

      // Redirect to login if not already on login/register page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// Dashboard API
export const getDashboardData = async () => {
  const response = await api.get('/api/inventory/dashboard');
  return response.data;
};

// Products APIs
export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/api/products', productData);
  return response.data;
};
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data;
};

export const updateProductStock = async (id, stock) => {
  const response = await api.patch(
    `/api/products/${id}/stock?stock=${stock}`
  );
  return response.data;
};

// Sales API
export const recordSale = async (saleData) => {
  const response = await api.post('/api/sales', saleData);
  return response.data;
};

// Demand Prediction API
export const getDemandPrediction = async (productId) => {
  const response = await api.get(`/api/inventory/demand/${productId}`);
  return response.data;
};

// AI Advice API
export const getAIAdvice = async (productId) => {
  const response = await api.get(`/api/ai/advice/${productId}`);
  return response.data;
};

export default api;
