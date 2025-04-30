import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the CORS middleware
import invoiceRoutes from './routes/invoiceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import deliveryChallanRoutes from './routes/deliveryChallanRoutes.js';


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin only
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific HTTP methods
  credentials: true, // If you need to send cookies or other credentials
}));
app.use(express.json());

app.use('/api', authRoutes); // Register + Login
app.use('/api/invoices', invoiceRoutes); // Invoice Routes
app.use('/api/quotation', quotationRoutes); // Quotation Routes
app.use('/api/delivery-challan', deliveryChallanRoutes);




const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
