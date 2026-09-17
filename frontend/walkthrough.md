# Smart Inventory & Demand Prediction - React Frontend Walkthrough

The React + Vite frontend for the **Smart Inventory and Demand Prediction System** has been fully created, built, and launched.

## 🚀 Application Summary

- **Frontend URL**: [http://localhost:5174/](http://localhost:5174/) (or `http://localhost:5173/` if available)
- **Backend Target URL**: `http://localhost:8081`
- **Tech Stack**: React 18, Vite 5, JavaScript (JSX), Axios, React Router v6, Lucide Icons, Custom Dashboard CSS

---

## 📂 Files Created

| File Path | Description |
| :--- | :--- |
| `src/services/api.js` | Centralized Axios instance configured for `http://localhost:8081`, with request interceptors for `Authorization: Bearer <token>` and 401 redirect response interceptors. |
| `src/components/ProtectedRoute.jsx` | Route guard component that checks for `localStorage` JWT token and redirects unauthenticated users to `/login`. |
| `src/components/Navbar.jsx` | Responsive top bar / mobile menu with brand logo, active page highlights, logged-in username badge, and Logout button. |
| `src/components/StatCard.jsx` | Reusable metric card with icons, title, value, color accent, and status indicators. |
| `src/components/Loading.jsx` | Reusable animated loading spinner for data fetching states. |
| `src/pages/Login.jsx` | Authentication page calling `POST /api/auth/login`, storing JWT token, username, and role, then navigating to `/dashboard`. |
| `src/pages/Register.jsx` | Registration page calling `POST /api/auth/register`, displaying success/error banners, and redirecting to `/login`. |
| `src/pages/Dashboard.jsx` | Overview dashboard displaying 6 KPI stat cards (`totalProducts`, `totalStockUnits`, `totalInventoryValue`, `totalSales`, `totalRevenue`, `lowStockProducts`), quick action links, and Low Stock Alert Center table. |
| `src/pages/Products.jsx` | Inventory management page displaying product table (ID, Name, Price, Stock, Badges, Quick Actions) and an Add Product modal. |
| `src/pages/Sales.jsx` | Sales transaction page submitting orders to `POST /api/sales`, generating an instant digital sales receipt showing Sale ID, total amount, and remaining stock. |
| `src/pages/Demand.jsx` | Demand forecasting page calling `GET /api/inventory/demand/{productId}`, rendering daily sales, 7d/30d demand, lead time, safety stock, reorder point, and recommendation badge. |
| `src/pages/AIAdvice.jsx` | AI Inventory Advisor console calling `GET /api/ai/advice/{productId}`, displaying risk level badge (`LOW`, `MEDIUM`, `HIGH`), strategic recommendation, and detailed GenAI breakdown. |
| `src/App.jsx` & `src/main.jsx` | Main React entry point and router layout definitions. |
| `src/App.css` & `src/index.css` | Complete administrative dashboard styling, CSS variables, tables, badges, modals, and responsive layout rules. |

---

## ⚙️ Connected Backend APIs

| Endpoint | Method | Component / Page | Feature |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `Register.jsx` | User Registration |
| `/api/auth/login` | `POST` | `Login.jsx` | User Authentication & Token Generation |
| `/api/inventory/dashboard` | `GET` | `Dashboard.jsx` | Metrics summary & low stock alerts |
| `/api/products` | `GET` / `POST` | `Products.jsx` | Product catalog listing & product creation |
| `/api/sales` | `POST` | `Sales.jsx` | Sales order processing & stock deduction |
| `/api/inventory/demand/{id}` | `GET` | `Demand.jsx` | Demand forecasting & reorder point calculation |
| `/api/ai/advice/{id}` | `GET` | `AIAdvice.jsx` | AI risk classification & stock advice |

---

## ⚠️ Important CORS Requirement

Since the frontend is running live on **`http://localhost:5174`** (or `http://localhost:5173`), ensure your Spring Boot controllers have CORS configured to accept requests from this origin:

```java
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:5173"})
```

---

## 🧪 Verification & Build Status

1. **Package Installation**: `npm install` completed with 0 errors (`axios`, `react-router-dom`, `lucide-react`).
2. **Production Build**: Executed `npm run build` — compiled cleanly in 2.64s with 0 errors.
3. **Live Dev Server**: Running on [http://localhost:5174/](http://localhost:5174/).
