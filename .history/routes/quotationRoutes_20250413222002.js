import express from 'express';
import Quotation from '../models/Quotation.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create Quotation
router.post('/quotations', protect, async (req, res) => {
  try {
    const {
      invoiceNumber,
      clientName,
      tradeName,
      address,
      items,
      status
    } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const quotation = new Quotation({
      userId: req.user.id,
      invoiceNumber,
      clientName,
      tradeName,
      address,
      items,
      totalAmount,
      gstAmount: 'Extra',
      totalAmountWithGST: `${totalAmount} + Extra`,
      status
    });

    await quotation.save();
    res.status(201).json({ message: 'Quotation created', quotation });
  } catch (err) {
    res.status(500).json({ message: 'Error creating quotation', error: err.message });
  }
});

// ✅ Get All Quotations
router.get('/quotations', protect, async (req, res) => {
  try {
    const quotations = await Quotation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(quotations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quotations', error: err.message });
  }
});

// ✅ Get Single Quotation
router.get('/:id', protect, async (req, res) => {
  try {
    const quotation = await Quotation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    res.status(200).json(quotation);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quotation', error: err.message });
  }
});

// ✅ Update Quotation
router.put('/:id', protect, async (req, res) => {
  try {
    const quotation = await Quotation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const {
      invoiceNumber,
      clientName,
      tradeName,
      address,
      items,
      status
    } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    quotation.invoiceNumber = invoiceNumber;
    quotation.clientName = clientName;
    quotation.tradeName = tradeName;
    quotation.address = address;
    quotation.items = items;
    quotation.totalAmount = totalAmount;
    quotation.gstAmount = 'Extra';
    quotation.totalAmountWithGST = `${totalAmount} + Extra`;
    quotation.status = status;

    const updated = await quotation.save();
    res.status(200).json({ message: 'Quotation updated', quotation: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quotation', error: err.message });
  }
});

// ✅ Delete Quotation
router.delete('/:id', protect, async (req, res) => {
  try {
    const quotation = await Quotation.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting quotation', error: err.message });
  }
});

export default router;
