import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});


const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
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
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
