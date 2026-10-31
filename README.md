# SWOO TECH MART - Full-Stack E-Commerce & Admin Portal

A modern, high-performance, and secure full-stack electronic marketplace with an integrated administrative portal, engineered to match the provided design specifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), JavaScript, [Lucide Icons](https://lucide.dev/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [Mongoose](https://mongoosejs.com/), [JWT](https://jwt.io/), [Bcrypt.js](https://www.npmjs.com/package/bcryptjs), [Multer](https://www.npmjs.com/package/multer) |
| **Database** | [MongoDB](https://www.mongodb.com/) (with automatic in-memory fallback for zero-friction local execution) |
| **Security** | Helmet HTTP security headers, CORS origin protection, JWT Bearer authentication, Role-based route guards (Admin/User), Bcrypt salt hashing, input sanitization |

---

## 📁 Professional Folder Structure

```
ishop/
├── backend/                             # Node.js & Express REST API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                    # MongoDB / Mongoose connection & resilience
│   │   │   ├── jwt.js                   # JWT token creation & validation
│   │   │   └── store.js                 # Fallback in-memory data store with seeded items
│   │   ├── controllers/
│   │   │   ├── authController.js        # Authentication, profile & user management
│   │   │   ├── productController.js     # Products search, filters, pagination, CRUD
│   │   │   ├── categoryController.js    # Category list, add, edit, delete
│   │   │   ├── brandController.js       # Brand list, add, edit, delete
│   │   │   ├── colorController.js       # Color palette list, add, edit, delete
│   │   │   └── orderController.js       # Checkout, order placement, order status updates
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT verify & admin authorization guard
│   │   │   ├── errorMiddleware.js       # 404 & unified error handler
│   │   │   └── uploadMiddleware.js      # Multer file upload (images up to 10MB)
│   │   ├── models/
│   │   │   ├── User.js                  # User schema with salted bcrypt passwords
│   │   │   ├── Product.js               # Product schema with price calculations, colors, specs
│   │   │   ├── Category.js              # Category schema with slug & image
│   │   │   ├── Brand.js                 # Brand schema with slug & logo
│   │   │   ├── Color.js                 # Color schema with hex code & slug
│   │   │   └── Order.js                 # Order schema with shipping address & payment
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # /api/auth
│   │   │   ├── productRoutes.js         # /api/products
│   │   │   ├── categoryRoutes.js        # /api/categories
│   │   │   ├── brandRoutes.js           # /api/brands
│   │   │   ├── colorRoutes.js           # /api/colors
│   │   │   ├── orderRoutes.js           # /api/orders
│   │   │   └── uploadRoutes.js          # /api/upload
│   │   ├── seeder/
│   │   │   └── seed.js                  # Database seeding script
│   │   └── server.js                    # Express app bootstrap & middleware orchestration
│   ├── uploads/                         # Uploaded product & category images directory
│   ├── .env                             # Backend environment variables
│   └── package.json
│
├── frontend/                            # Next.js & React Frontend Application
│   ├── public/
│   │   └── images/                      # Assets, logos, reference mockups
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js                # Global root layout with providers & metadata
│   │   │   ├── page.js                  # Homepage (Hero slider, flash deals, categories)
│   │   │   ├── shop/page.js             # Catalog page (Filters by Brand, Price, Rating, Color, Memory)
│   │   │   ├── product/[slug]/page.js   # Single Product Details, Frequently Bought Together, Tabs
│   │   │   ├── cart/page.js             # Shopping Cart with quantity selectors & order summary
│   │   │   ├── checkout/page.js         # Checkout with Billing details & Payment methods
│   │   │   ├── about/page.js            # About Us page (Stats, SWAT logistics, History timeline, Leaderships)
│   │   │   ├── contact/page.js          # Contact Us with Form, Headquarters info, Google Map
│   │   │   ├── login/page.js            # Login with shield graphic illustration & demo accounts
│   │   │   ├── register/page.js         # Register with security graphic illustration
│   │   │   ├── profile/page.js          # User Account Info, Order history, Address, Password
│   │   │   └── admin/
│   │   │       ├── layout.js            # Admin sidebar & top search bar layout
│   │   │       ├── page.js              # Admin Dashboard with metrics & recent orders
│   │   │       ├── categories/page.js   # Admin Categories table (Active, Edit, Delete)
│   │   │       ├── categories/add/page.js# Add Category form with drag & drop
│   │   │       ├── colors/page.js       # Admin Colors table with hex color preview swatches
│   │   │       ├── colors/add/page.js   # Add Color form with live color picker
│   │   │       ├── brands/page.js       # Admin Brands table
│   │   │       ├── brands/add/page.js   # Add Brand Category form with image upload
│   │   │       ├── products/page.js     # Admin Products table (Price formula, stock pills)
│   │   │       ├── products/add/page.js # Create New Product with rich text spec editor
│   │   │       ├── orders/page.js       # Admin Orders manager with status dropdowns
│   │   │       └── users/page.js        # Admin Users table
│   │   ├── components/
│   │   │   ├── header/Header.js         # Top bar, Logo, Navigation, Search, Wishlist, Cart
│   │   │   ├── footer/Footer.js         # Footer columns, Newsletter, Payment badges
│   │   │   └── ui/SocialIcons.js        # Clean SVG social media icons
│   │   ├── context/
│   │   │   ├── AuthContext.js           # Global authentication state & local persistence
│   │   │   ├── CartContext.js           # Cart state, calculations, localStorage persistence
│   │   │   └── WishlistContext.js       # Wishlist state & localStorage persistence
│   │   └── lib/
│   │       ├── api.js                   # Unified API fetch client with token handling
│   │       └── mockData.js              # Rich catalog matching exact mockup specifications
│   ├── tailwind.config.js               # Brand color definitions (Teal, Slate, Indigo)
│   └── package.json
│
└── package.json                         # Root workspace orchestration
```

---

## 🚀 Step-by-Step Running Guide

### 1. Start the Backend API Server
Open a terminal in the project directory:
```bash
cd backend
npm run dev
```
*The server will start on port `5000`: http://localhost:5000*
*(Note: If MongoDB is running on port 27017 or a `MONGODB_URI` is provided, it connects automatically; if not, the system activates the zero-friction fallback store so all APIs, logins, and operations function immediately!)*

### 2. Start the Frontend Application
Open a second terminal:
```bash
cd frontend
npm run dev
```
*The Next.js storefront will start on port `3000`: http://localhost:3000*

---

## 🔑 Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ishop.com` | `adminpassword123` | Storefront + Full Admin Panel (`/admin`) |
| **Customer** | `swoo@gmail.com` | `password123` | Storefront + Customer Profile & Orders (`/profile`) |

---

## 🎨 Page & Feature Overview

### 1. Storefront Experience (SWOO TECH MART)
- **Homepage (`/`)**: Hero banner slider with deals, category menu sidebar, flash deals countdown with live ticking timer, best-seller product grid, laptops/phones showcase, and recently viewed shelf.
- **Catalog & Shop Page (`/shop`)**: Multi-faceted filter sidebar with Brands checkboxes, Price range slider, Star ratings, Color swatches, Storage sizes, and dynamic sorting (Price low-high, high-low, rating, best-selling).
- **Single Product Page (`/product/[slug]`)**: Multi-angle image gallery, color variant picker, storage size buttons, buy box with quantity counter, **"Frequently Bought Together" bundle builder** with real-time bundle price computation, and rich description/review tabs.
- **Shopping Cart (`/cart`)**: Real-time quantity adjustment, discount savings badges, in-stock indicators, subtotal/shipping/tax order summary, and checkout progression.
- **Checkout (`/checkout`)**: Multi-step billing details, order items breakdown, and payment methods (Direct Bank Transfer, Cash on Delivery, and PayPal).
- **About Us (`/about`)**: Company milestones timeline (1997-2023), SWAT logistics force banner, 3 pillars (Authentic, Fast, Affordable), corporate gallery, and leadership profiles.
- **Contact Us (`/contact`)**: Inquiries form, US headquarters & UK branch info, and embedded interactive Google Map.
- **Authentication (`/login` & `/register`)**: Split-screen design with custom security shield illustration and TLS protection badges.
- **Customer Profile (`/profile`)**: Interactive tabs for Account Info, Order History, Saved Addresses, and Password changes.

### 2. Administrative Portal (`/admin`)
- **Dashboard (`/admin`)**: High-level KPI cards (Total Revenue, Total Orders, Active Catalog, Customers) and real-time recent order activity.
- **Categories (`/admin/categories` & `/add`)**: Full CRUD table with Active badges, slug generator, and 10MB drag-and-drop category image upload.
- **Colors (`/admin/colors` & `/add`)**: Color palette manager with hex color previews, hex input with native color picker, and slugs.
- **Brands (`/admin/brands` & `/add`)**: Brand catalog with logo uploads, slug management, and status controls.
- **Products (`/admin/products` & `/add`)**: Comprehensive catalog table displaying the exact `Original | Discount% | Final Price` formula, stock badges, top-selling badges, and product creation featuring a **rich formatting specification editor**.
- **Orders (`/admin/orders`)**: Complete customer order tracking with status dropdowns (Pending, Processing, Shipped, Delivered, Cancelled).
- **Users (`/admin/users`)**: Customer and administrator registry with role designations and joined timestamps.

---

## 🌐 Production Hosting & Deployment

For full instructions on launching this application to **Vercel** (Frontend), **Render/Railway** (Backend), and **MongoDB Atlas** (Cloud Database), see the complete deployment manual:

👉 **[DEPLOYMENT.md](file:///c:/Users/Hp/Desktop/ishop/DEPLOYMENT.md)**

All API endpoints, registration data, bcrypt passwords, and JWT authentications are verified and directly connected to MongoDB.
