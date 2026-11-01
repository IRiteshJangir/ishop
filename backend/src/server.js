const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB, getDbStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const colorRoutes = require('./routes/colorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security & Utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SWOO TECH MART & ISHOP E-Commerce REST API is running smoothly',
    version: '1.0.0',
    documentation: '/api',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      brands: '/api/brands',
      colors: '/api/colors',
      orders: '/api/orders',
      uploads: '/api/upload',
    },
  });
});

// Health Check Route for Hosting Probes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: getDbStatus() ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/product', productRoutes); // Alias for /product and /product/create
app.use('/products', productRoutes); // Alias for /products
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
const ALT_PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 [Server Running]: Backend server active on primary port ${PORT}`);
  console.log(`🌐 [API Endpoints]: http://localhost:${PORT}/api/products`);
});

if (PORT !== ALT_PORT) {
  const altServer = app.listen(ALT_PORT, () => {
    console.log(`🚀 [Dual-Port Support]: Also listening on port ${ALT_PORT} (http://localhost:${ALT_PORT}/product/create)`);
  });
  altServer.on('error', (err) => {
    // Gracefully ignore if port 5001 is already taken by another process
    if (err.code !== 'EADDRINUSE') {
      console.warn(`[Port ${ALT_PORT} Notice]:`, err.message);
    }
  });
}

module.exports = app;
