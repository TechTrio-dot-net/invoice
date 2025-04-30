import express from 'express';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// GST Calculation
const calculateGST = (items, gstType) => {
  let totalAmount = 0;
  let gstAmount = 0;

  items.forEach(item => {
    totalAmount += item.amount;
  });

  if (gstType === 'CGST+SGST' || gstType === 'IGST') {
    gstAmount = totalAmount * 0.18; // 18% GST
  }

  const totalAmountWithGST = totalAmount + gstAmount;
  return { totalAmount, gstAmount, totalAmountWithGST };
};

// Create Invoice
router.post('/invoices', async (req, res) => {
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
    });

    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating invoice', error: err.message });
  }
});

// Get All Invoices
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
});

// Get Single Invoice
router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice', error: err.message });
  }
});

// Update Invoice
router.put('/invoices/:id', async (req, res) => {
  try {
    const { invoiceNumber, clientName, tradeName, gstin, address, gstType, items, status } = req.body;

    const { totalAmount, gstAmount, totalAmountWithGST } = calculateGST(items, gstType);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
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
        status,
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ message: 'Error updating invoice', error: err.message });
  }
});

// Delete Invoice
router.delete('/invoices/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invoice', error: err.message });
  }
});

export default router;
