const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (getDbStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'user',
      });

      // Synchronize in-memory store
      store.users.push({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '/images/default-avatar.png',
        addresses: user.addresses || [],
        createdAt: user.createdAt,
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      // In-memory fallback
      const userExists = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        rawPassword: password,
        role: 'user',
        phone: '',
        avatar: '/images/default-avatar.png',
        addresses: [],
        createdAt: new Date(),
      };

      store.users.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar,
        },
        token: generateToken(newUser._id, newUser.role),
      });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    if (getDbStatus()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
          },
          token: generateToken(user._id, user.role),
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // In-memory fallback
      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = (user.rawPassword && user.rawPassword === password) ||
                      (await bcrypt.compare(password, user.password).catch(() => false));

      if (isMatch) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
          },
          token: generateToken(user._id, user.role),
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            addresses: user.addresses,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const user = store.users.find(u => u._id === req.user._id || u.email === req.user.email);
      if (user) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            addresses: user.addresses || [],
          },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone !== undefined ? phone : user.phone;
        if (password) {
          user.password = password;
        }
        if (address) {
          user.addresses = [address];
        }
        const updated = await user.save();
        return res.json({
          success: true,
          user: {
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            phone: updated.phone,
            avatar: updated.avatar,
            addresses: updated.addresses,
          },
          token: generateToken(updated._id, updated.role),
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const user = store.users.find(u => u._id === req.user._id || u.email === req.user.email);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          user.rawPassword = password;
        }
        if (address) {
          user.addresses = [address];
        }
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            addresses: user.addresses,
          },
          token: generateToken(user._id, user.role),
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    if (getDbStatus()) {
      const users = await User.find({}).select('-password');
      return res.json({ success: true, count: users.length, users });
    } else {
      const safe = store.users.map(({ password, rawPassword, ...u }) => u);
      return res.json({ success: true, count: safe.length, users: safe });
    }
  } catch (error) {
    console.error('Get Users Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error retrieving users' });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');

    // Remove from in-memory store
    const storeIdx = store.users.findIndex(u => u._id === id || u.email === id);
    if (storeIdx !== -1) {
      store.users.splice(storeIdx, 1);
    }

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const user = isObjectId ? await User.findById(id) : await User.findOne({ email: id });
      if (user) {
        await user.deleteOne();
        return res.json({ success: true, message: 'User deleted successfully' });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      return res.json({ success: true, message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Delete User Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error deleting user' });
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const mongoose = require('mongoose');

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be "user" or "admin"' });
    }

    // Update in store
    const storeUser = store.users.find(u => u._id === id || u.email === id);
    if (storeUser) {
      storeUser.role = role;
    }

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      let user = isObjectId ? await User.findById(id) : await User.findOne({ email: id });
      if (user) {
        user.role = role;
        await user.save();
        return res.json({
          success: true,
          message: `User role updated to ${role}`,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      if (storeUser) {
        return res.json({
          success: true,
          message: `User role updated to ${role}`,
          user: {
            _id: storeUser._id,
            name: storeUser.name,
            email: storeUser.email,
            role: storeUser.role,
            phone: storeUser.phone,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Role Error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating user role' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
};
