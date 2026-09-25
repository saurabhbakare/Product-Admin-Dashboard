# Product Admin Dashboard 🚀

A modern, responsive, and robust **Product Management Admin Dashboard** built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **Axios**, integrated with the free [DummyJSON API](https://dummyjson.com).

🔗 **Live Application Demo**: [https://product-admin-dashboard-blue-eta.vercel.app](https://product-admin-dashboard-blue-eta.vercel.app)  
📦 **GitHub Repository**: [https://github.com/saurabhbakare/Product-Admin-Dashboard](https://github.com/saurabhbakare/Product-Admin-Dashboard)

---

## 📋 Table of Contents
1. [Overview & Tech Stack](#-overview--tech-stack)
2. [Features Implemented](#-features-implemented)
3. [Quick Setup & Local Running](#-quick-setup--local-running)
4. [Architecture & Design Choices](#-architecture--design-choices)
5. [Technical Challenges & Fixes](#-technical-challenges--fixes)
6. [Role of AI Assistance](#-role-of-ai-assistance)
7. [Project File Structure](#-project-file-structure)

---

## 💻 Overview & Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: React 19 & [Lucide React Icons](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Backend API**: [DummyJSON API](https://dummyjson.com/)

---

## ✨ Features Implemented

### 1. 🔑 Authentication & Protected Routes
- Login page at `/login` accepting username `emilys` and password `emilyspass`.
- Interactive error alerts for invalid credentials & quick "Auto-fill Demo Credentials" button.
- Token and user session saved in `localStorage`.
- Shared Axios request interceptor attaches `Authorization: Bearer <token>` to all API requests.
- Shared Axios response interceptor handles `401 Unauthorized` errors automatically.
- Route protection redirects unauthenticated visitors trying to open `/products` or `/products/[id]`.
- Navbar with user profile avatar, handle `@emilys`, and Logout button.

### 2. 📦 Product Listing (Desktop Table + Mobile Cards)
- Displays image thumbnail, title, brand, category, price, rating stars, stock badge, and action buttons.
- **Desktop View**: Full-featured, responsive data table with sortable column headers.
- **Mobile View**: Optimized responsive card list layout for mobile screens.

### 3. 📄 Custom Pagination Logic (No Libraries Used)
- Server-side pagination with `limit` and `skip`.
- Page size selector (`10`, `20`, `50` items per page).
- Range indicator text (e.g. `Showing 21–40 of 194 items`).
- Numbered page buttons with smart ellipsis (`...`) and Previous/Next buttons.

### 4. 🔍 Debounced Search
- Instant live search using `/products/search?q=`.
- `useDebounce` hook waits 400ms after the user stops typing before making API calls.
- Resets page to 1 automatically when search input changes.
- **Race condition safety**: Uses `AbortController` in Axios requests to cancel old in-flight requests when fast typing occurs.

### 5. 🏷️ Category Filter & Sorting
- Category filter dropdown powered by `/products/category-list`.
- Sort dropdown for **Price**, **Rating**, and **Title**, with Ascending/Descending toggle (`order=asc|desc`).
- Clickable column headers directly in the desktop table to trigger sorting.
- "Reset Filters" button to clear all query parameters back to default.

### 6. 🖼️ Product Details Page (`/products/[id]`)
- Detailed product view displaying image gallery with interactive thumbnail switcher.
- Product details: Title, Brand, Category, Price, Discount badge, Rating stars, Stock, Warranty, Return policy, Shipping info.
- Customer reviews section with reviewer names, ratings, dates, and comments.
- Elegant 404 "Product Not Found" fallback page for invalid or missing product IDs.

### 7. ✏️ Add, Edit & Delete (Optimistic Local Overlay)
- Modal form with real-time validation (title required, price > 0, stock >= 0, category required).
- Submit locking: Disables submit buttons and shows spinners during request execution to prevent fast double-clicks.
- Deletion confirmation dialog ("Confirm Product Deletion") before removal.
- Optimistic local state layer ensures created, updated, and deleted products persist across table pagination, filtering, and page navigation during the session.

### 8. 🌐 URL Search Parameter Synchronization
- All view states (`page`, `limit`, `search`, `category`, `sortBy`, `order`) are synced directly to URL search params.
- Refreshing the browser or sharing the URL preserves the exact dashboard view.
- Invalid query parameters (`?page=xyz`, `?limit=999`, `?page=-5`) are safely normalized with default fallbacks without breaking the UI.

### 9. ⏳ Loading, Empty & Error States
- Skeleton loaders during data fetch.
- Clear empty state message when search/filter returns 0 products.
- Error state card with an interactive **Retry Loading** button when network calls fail.

---

## 🛠️ Quick Setup & Local Running

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/saurabhbakare/Product-Admin-Dashboard.git
   cd Product-Admin-Dashboard/product-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.
5. Log in using test credentials:
   - **Username**: `emilys`
   - **Password**: `emilyspass`

---

## 🏛️ Architecture & Design Choices

1. **Modular Service Layer (`src/services/`)**:
   - Kept API call logic isolated from UI components in `authService.js` and `productService.js`.
   - Utilized a single centralized Axios instance (`axios.js`) with request/response interceptors.

2. **Custom Hook Abstraction (`src/hooks/useDebounce.js`)**:
   - Extracted debouncing logic into a reusable hook to keep component state clean and prevent unnecessary network calls.

3. **URL State as Single Source of Truth (`src/utils/urlParams.js`)**:
   - Rather than duplicating state in multiple React components, URL query parameters serve as the primary truth for pagination, filtering, and sorting.

---

## ⚠️ Technical Challenges & Fixes

### Problem 1: Fast Typing Race Conditions in Search
- **Challenge**: When a user types rapidly (e.g. typing "phone"), multiple API requests fire. If request #1 for "ph" takes 2000ms due to network latency while request #2 for "phone" takes 200ms, request #1 might resolve last and overwrite the table with outdated results for "ph".
- **Fix**: Implemented `AbortController` signals inside `productService.js`. Whenever a new search request is triggered, `activeAbortControllerRef.current.abort()` cancels the previous in-flight request instantly, ensuring only the latest response updates the state.

### Problem 2: DummyJSON API Limitation (Search vs Category Filter)
- **Challenge**: DummyJSON API does not natively support combining search (`/products/search?q=`) and category filtering (`/products/category/{cat}`) in a single API query.
- **Fix**: When both search and category parameters are active, our dashboard fetches search results or category results from the API and performs secondary in-memory filtering against the selected category. A subtle notice is also rendered on screen to inform the user.

### Problem 3: Mock API Non-Persistence for Add/Edit/Delete
- **Challenge**: DummyJSON mock endpoints (`/products/add`, `PUT /products/[id]`, `DELETE /products/[id]`) simulate HTTP 200 responses but do not mutate the central database on DummyJSON servers.
- **Fix**: Built an optimistic local state overlay (`localAddedProducts`, `localUpdatedProducts`, `localDeletedProductIds`). This overlay merges client-side mutations on top of API results seamlessly across pagination and filtering.

---

## 🤖 Role of AI Assistance

AI tools were utilized during development to:
1. **Accelerate Layout & Component Drafting**: Generated clean Tailwind CSS markup for responsive table and mobile card layouts.
2. **Refine Edge Case Handling**: Assisted in crafting URL parameter sanitization utility logic (`parseQueryParams`) to catch dirty inputs (`page=abc`).
3. **Verify API Interceptor Patterns**: Reinforced best practices for Axios response interceptors handling `401 Unauthorized` redirects in Next.js App Router client components.

---

## 📂 Project File Structure

```
product-admin-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind CSS v4 & theme styling
│   │   ├── layout.js                # Root layout with AuthProvider & metadata
│   │   ├── page.js                  # Root page redirecting to /products or /login
│   │   ├── login/
│   │   │   └── page.js              # Login page with demo auto-fill
│   │   └── products/
│   │       ├── page.js              # Main Admin Dashboard (Table, Cards, Search, Modals)
│   │       └── [id]/
│   │           └── page.js          # Product details page & customer reviews
│   ├── components/
│   │   ├── Navbar.js                # Header with user avatar and logout
│   │   ├── SearchFilterBar.js       # Search input, category dropdown, sort options
│   │   ├── ProductTable.js          # Desktop sortable table view
│   │   ├── ProductCards.js          # Mobile responsive cards view
│   │   ├── Pagination.js            # Custom pagination control bar
│   │   ├── ProductModal.js          # Add / Edit form dialog with validation
│   │   ├── DeleteConfirmModal.js    # Delete confirmation modal
│   │   ├── LoadingSpinner.js        # Skeleton loader
│   │   └── ErrorState.js            # Network error card with Retry trigger
│   ├── context/
│   │   └── AuthContext.js           # Auth context & route protection
│   ├── hooks/
│   │   └── useDebounce.js           # Input debouncing hook
│   ├── services/
│   │   ├── axios.js                 # Shared Axios configuration & interceptors
│   │   ├── authService.js           # Login & session API calls
│   │   └── productService.js        # Product CRUD & search API requests with AbortController
│   └── utils/
│       └── urlParams.js             # Query param parser & serializer
├── package.json
└── README.md
```
