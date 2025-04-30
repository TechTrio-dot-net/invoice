import mongoose from 'mongoose';

const deliveryChallanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  challanNumber: {
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
      unit: String
    }
  ],
  dispatchDate: {
    type: Date,
    required: true
  },
  deliveryMode: {
    type: String,
    enum: ['Courier', 'Transport', 'Hand Delivery', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered'],
    default: 'pending'
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

const DeliveryChallan = mongoose.model('DeliveryChallan', deliveryChallanSchema);
export default DeliveryChallan;
