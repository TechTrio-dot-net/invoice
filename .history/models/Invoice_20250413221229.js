import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  rate: Number,
  amount: Number,
  unit: String
});

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  clientName: String,
  tradeName: String,
  gstin: String,
  address: String,
  gstType: String,
  items: [itemSchema],
  totalAmount: Number,
  gstAmount: Number,
  totalAmountWithGST: Number,
  status: {
    type: String,
    default: 'unpaid'
  },
  vehicleNumber: String,
  transporterName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Invoice', invoiceSchema);
