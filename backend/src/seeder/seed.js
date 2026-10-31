const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Color = require('../models/Color');
const Order = require('../models/Order');

const store = require('../config/store');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ishop';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Color.deleteMany();
    await Order.deleteMany();

    // Insert categories, brands, colors
    const createdCategories = await Category.insertMany(store.categories.map(({ _id, ...c }) => c));
    const createdBrands = await Brand.insertMany(store.brands.map(({ _id, ...b }) => b));
    const createdColors = await Color.insertMany(store.colors.map(({ _id, ...col }) => col));

    // Insert users with hashed passwords
    await User.create([
      {
        name: 'Admin',
        email: 'admin@ishop.com',
        password: 'adminpassword123',
        role: 'admin',
        phone: '+1 0231 4554 452',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      {
        name: 'Mark Cole',
        email: 'swoo@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '+1 0231 4554 452',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        addresses: [
          {
            firstName: 'Mark',
            lastName: 'Cole',
            company: 'Tech Studio',
            country: 'United States (US)',
            street: '742 Evergreen Terrace',
            apartment: 'Apt 2B',
            city: 'Seattle',
            state: 'Washington',
            zipCode: '98101',
            phone: '+1 0231 4554 452',
            isDefault: true,
          }
        ]
      }
    ]);

    // Insert products
    await Product.insertMany(store.products.map(({ _id, ...p }) => p));

    console.log('✅ Database successfully seeded with full catalog, users, categories, colors, and brands!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
