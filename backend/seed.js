require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./Models/Product');

const RAW_PATH = path.join(__dirname, 'products_balanced.json'); // output of clean_products.js

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');

    const cleaned = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));
    console.log(`Loaded ${cleaned.length} products`);

    await Product.deleteMany({});
    console.log('Cleared existing products collection');

    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
      const batch = cleaned.slice(i, i + BATCH_SIZE);
      try {
        const result = await Product.insertMany(batch, { ordered: false });
        inserted += result.length;
        console.log(`Inserted batch ${i / BATCH_SIZE + 1}: ${result.length} products`);
      } catch (err) {
        // ordered:false means one bad doc in a batch won't stop the rest
        console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, err.message);
      }
    }

    console.log(`Done. Total inserted: ${inserted} / ${cleaned.length}`);
  } catch (err) {
    console.error('Seed script failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
