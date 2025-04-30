import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import invoiceRoutes from './routes/invoiceRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Set up routes
app.use('/api', invoiceRoutes);

// MongoDB URI from .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
