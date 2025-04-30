import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    tradeName: { type: String },
    gstin: { type: String },
    address: { type: String },

    gstType: {
      type: String,
      enum: ['CGST+SGST', 'IGST', 'None'],
      default: 'None'
    },

    items: [itemSchema],

    totalAmount: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    totalAmountWithGST: { type: Number, required: true },

    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Cancelled'],
      default: 'Pending'
    },

    // 🔥 Add this field to associate the invoice with a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
