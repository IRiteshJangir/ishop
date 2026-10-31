const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0, // in percentage, e.g. 10
    },
    finalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    categoryName: {
      type: String,
      default: '',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: false,
    },
    brandName: {
      type: String,
      default: '',
    },
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
      },
    ],
    colorNames: [String],
    colorHexes: [String],
    teaserText: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    images: [String],
    rating: {
      type: Number,
      default: 5.0,
    },
    numReviews: {
      type: Number,
      default: 152,
    },
    countInStock: {
      type: Number,
      default: 50,
    },
    isTopSelling: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    memorySizes: {
      type: [String],
      default: ['128GB', '256GB', '512GB'],
    },
    screenSizes: {
      type: [String],
      default: ['6.1 inch', '6.7 inch'],
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Refurbished'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
