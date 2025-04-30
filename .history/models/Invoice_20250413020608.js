import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: { // 👈 Add this line to track the owner of the invoice
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

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
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
