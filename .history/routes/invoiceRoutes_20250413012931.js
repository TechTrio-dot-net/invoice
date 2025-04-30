import express from 'express';
import Invoice from '../models/Invoice.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const calculateGST = (items, gstType) => {
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.amount;
  });

  const gstAmount = (gstType === 'CGST+SGST' || gstType === 'IGST') ? totalAmount * 0.18 : 0;
  const totalAmountWithGST = totalAmount + gstAmount;
  return { totalAmount, gstAmount, totalAmountWithGST };
};

// 🔒 Create Invoice
router.post('/invoices', protect, async (req, res) => {
  try {
    const { invoiceNumber, clientName, tradeName, gstin, address, gstType, items, status } = req.body;

    const { totalAmount, gstAmount, totalAmountWithGST } = calculateGST(items, gstType);

    const newInvoice = new Invoice({
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
      //tenantId: req.user._id  // 🔑 Save tenant info
    });

    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ message: 'Error creating invoice', error: err.message });
  }
});

// 🔒 Get All Invoices for current user
router.get('/invoices', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ tenantId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
});

// 🔒 Get Single Invoice by ID if it belongs to the user
router.get('/invoices/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, tenantId: req.user._id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice', error: err.message });
  }
});

// 🔒 Update Invoice
router.put('/invoices/:id', protect, async (req, res) => {
  try {
    const { invoiceNumber, clientName, tradeName, gstin, address, gstType, items, status } = req.body;

    const { totalAmount, gstAmount, totalAmountWithGST } = calculateGST(items, gstType);

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user._id },  // 🔐 Ensure tenant owns this
      {
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
        status
      },
      { new: true }
    );

    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found or unauthorized' });

    res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ message: 'Error updating invoice', error: err.message });
  }
});

// 🔒 Delete Invoice
router.delete('/invoices/:id', protect, async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user._id
    });

    if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found or unauthorized' });

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invoice', error: err.message });
  }
});

export default router;
