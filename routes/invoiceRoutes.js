import express from 'express';
import Invoice from '../models/Invoice.js';
import DeliveryChallan from '../models/DeliveryChallan.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GST Calculation Logic
const calculateGST = (items, gstType) => {
  let totalAmount = 0;
  let gstAmount = 0;

  items.forEach(item => {
    totalAmount += item.amount;
  });

  if (gstType === 'CGST+SGST' || gstType === 'IGST') {
    gstAmount = totalAmount * 0.18;
  }

  const totalAmountWithGST = totalAmount + gstAmount;
  return { totalAmount, gstAmount, totalAmountWithGST };
};

// ✅ Create Invoice & Delivery Challan
router.post('/', protect, async (req, res) => {
  try {
    const {
      invoiceNumber,
      clientName,
      tradeName,
      gstin,
      address,
      gstType,
      items,
      status,
      vehicleNumber,
      transporterName
    } = req.body;

    const { totalAmount, gstAmount, totalAmountWithGST } = calculateGST(items, gstType);

    const newInvoice = new Invoice({
      userId: req.user.id,
      invoiceNumber,
      clientName,
      tradeName,
      gstin,
      address,
      gstType,
      items,
      totalAmount,
      gstAmount,
      totalAmountWithGST,
      status,
      vehicleNumber,
      transporterName
    });

    await newInvoice.save();

    // Auto-create delivery challan
    const newChallan = new DeliveryChallan({
      userId: req.user.id,
      challanNumber: invoiceNumber,
      clientName,
      tradeName,
      address,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit || 'pcs'
      })),
      dispatchDate: new Date(),
      deliveryMode: transporterName ? 'Transport' : 'Other',
      status: 'dispatched',
      remarks: `Auto-generated from Invoice #${invoiceNumber}`
    });

    await newChallan.save();

    res.status(201).json({
      message: 'Invoice & Delivery Challan created',
      invoice: newInvoice,
      deliveryChallan: newChallan
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating invoice', error: err.message });
  }
});

// ✅ Get All Invoices
router.get('/', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
});

// ✅ Get Single Invoice
router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice', error: err.message });
  }
});

// ✅ Update Invoice
router.put('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const {
      invoiceNumber,
      clientName,
      tradeName,
      gstin,
      address,
      gstType,
      items,
      status,
      vehicleNumber,
      transporterName
    } = req.body;

    const { totalAmount, gstAmount, totalAmountWithGST } = calculateGST(items, gstType);

    invoice.invoiceNumber = invoiceNumber;
    invoice.clientName = clientName;
    invoice.tradeName = tradeName;
    invoice.gstin = gstin;
    invoice.address = address;
    invoice.gstType = gstType;
    invoice.items = items;
    invoice.status = status;
    invoice.totalAmount = totalAmount;
    invoice.gstAmount = gstAmount;
    invoice.totalAmountWithGST = totalAmountWithGST;
    invoice.vehicleNumber = vehicleNumber;
    invoice.transporterName = transporterName;

    const updated = await invoice.save();
    res.status(200).json({ message: 'Invoice updated', invoice: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating invoice', error: err.message });
  }
});

// ✅ Delete Invoice
router.delete('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invoice', error: err.message });
  }
});

export default router;
