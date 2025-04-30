import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  quotationNumber: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  tradeName: {
    type: String
  },
  address: {
    type: String
  },
  items: [
    {
      description: String,
      quantity: Number,
      rate: Number,
      amount: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  gstAmount: {
    type: String,
    default: 'Extra'
  },
  totalAmountWithGST: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  }
}, { timestamps: true });

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;
