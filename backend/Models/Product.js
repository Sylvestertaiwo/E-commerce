const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    originalId: { type: String, sparse: true },
    name: { type: String, required: true },
    brand: { type: String, default: 'Generic' },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, default: 'General' },
    categoryPath: { type: [String], default: [] },
    description: { type: String, default: '' },
    retailPrice: { type: Number, default: null },
    discountedPrice: { type: Number, default: null },
    rating: { type: Number, default: null }, 
    ratingsCount: { type: Number, default: null },
    mainCategory: { type: String, default: '' },
    images: { type: [String], default: [] },
    productUrl: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
