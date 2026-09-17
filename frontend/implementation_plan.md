# Implementation Plan - Smart Inventory & Demand Prediction Frontend

Build a modern, responsive React + Vite frontend in JavaScript/JSX for the Smart Inventory and Demand Prediction System, interfacing with the Spring Boot backend (`http://localhost:8081`).

## User Review Required

> [!IMPORTANT]
> - **Backend Unmodified**: No backend files will be touched or recreated.
> - **Port & CORS**: The frontend will run on Vite's local dev server (`http://localhost:5173`). If Spring Boot blocks API calls due to CORS, you will need to add `@CrossOrigin(origins = "*")` or allow `http://localhost:5173` on your Spring Boot controllers.

## Proposed Changes

### 1. Project Initialization & Dependencies
- Create Vite React setup (JavaScript/JSX).
- Dependencies: `axios`, `react-router-dom`, `lucide-react` (for clean dashboard icons).

### 2. Centralized API Service (`src/services/api.js`)
- Base URL: `http://localhost:8081`
- Axios Request Interceptor: Automatically attaches `Authorization: Bearer <token>` from `localStorage`.
- Response Interceptor: Catches 401 Unauthorized to trigger logout/redirect.
- Exported API methods for:
  - Auth: `loginUser`, `registerUser`
  - Dashboard: `getDashboardStats`
  - Products: `getProducts`, `createProduct`
  - Sales: `recordSale`
  - Demand: `getDemandPrediction`
  - AI Advice: `getAIAdvice`

### 3. Components (`src/components/`)
- `Navbar.jsx`: Responsive top navigation / sidebar with logo, navigation links, user badge, and Logout button.
- `ProtectedRoute.jsx`: Wrapper component redirecting to `/login` if JWT token is absent.
- `StatCard.jsx`: Reusable card component for dashboard metrics with icon, title, value, and accent color.
- `Loading.jsx`: Clean loading spinner component.

### 4. Pages (`src/pages/`)
- `Login.jsx` (`/login`): Form for username and password, stores JWT token, username, role on success, redirects to `/dashboard`.
- `Register.jsx` (`/register`): Form for username, email, password, displays success alert and redirects to `/login`.
- `Dashboard.jsx` (`/dashboard`): Displays 6 stat cards (`totalProducts`, `totalStockUnits`, `totalInventoryValue`, `totalSales`, `totalRevenue`, `lowStockProducts`), low stock items alert list, quick navigation actions.
- `Products.jsx` (`/products`): Product table listing ID, Name, Price, Stock; plus an Add Product form/modal.
- `Sales.jsx` (`/sales`): Form to enter Product ID and Quantity, submitting to `POST /api/sales` and rendering a sale summary receipt.
- `Demand.jsx` (`/demand`): Product ID lookup form, displaying daily sales, 7-day & 30-day estimated demand, lead time, safety stock, reorder point, and color-coded recommendation badge.
- `AIAdvice.jsx` (`/ai-advice`): Product ID lookup form, styled AI Inventory Advisor panel showing risk level badge (LOW/MEDIUM/HIGH), recommendation, and detailed explanation text.

### 5. Styling (`src/App.css`, `src/index.css`)
- Clean, modern administrative dashboard styling using CSS variables (slate, indigo, emerald, amber, rose color palettes).
- Responsive layout grid, clean typography, form controls, table views, status badges, and alert banners.

## Verification Plan

### Automated Verification
- Run `npm run build` to ensure 0 JSX or JavaScript compilation errors.

### Manual Verification
1. Launch app with `npm run dev`.
2. Register a new user (`/register`) and log in (`/login`).
3. Confirm JWT token, username, and role are saved in `localStorage`.
4. Navigate to `/dashboard` and verify data fetched from `GET /api/inventory/dashboard`.
5. Navigate to `/products` and test viewing and adding products.
6. Navigate to `/sales` and record a sale (`POST /api/sales`).
7. Navigate to `/demand` and test product demand lookup (`GET /api/inventory/demand/1`).
8. Navigate to `/ai-advice` and test AI advice lookup (`GET /api/ai/advice/1`).
9. Click **Logout** and verify `localStorage` clearance and immediate redirection to `/login`.
10. Attempt visiting `/dashboard` directly without a token to confirm route protection.
