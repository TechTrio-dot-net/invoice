import express from 'express';
import DeliveryChallan from '../models/DeliveryChallan.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create Delivery Challan
router.post('/', protect, async (req, res) => {
  try {
    const {
      challanNumber,
      clientName,
      tradeName,
      address,
      items,
      dispatchDate,
      deliveryMode,
      status,
      remarks
    } = req.body;

    const challan = new DeliveryChallan({
      userId: req.user.id,
      challanNumber,
      clientName,
      tradeName,
      address,
      items,
      dispatchDate,
      deliveryMode,
      status,
      remarks
    });

    await challan.save();
    res.status(201).json({ message: 'Delivery Challan created', challan });
  } catch (err) {
    res.status(500).json({ message: 'Error creating challan', error: err.message });
  }
});

// ✅ Get All Challans (for logged-in user)
router.get('/', protect, async (req, res) => {
  try {
    const challans = await DeliveryChallan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(challans);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching challans', error: err.message });
  }
});

// ✅ Get Single Challan
router.get('/:id', protect, async (req, res) => {
  try {
    const challan = await DeliveryChallan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!challan) return res.status(404).json({ message: 'Delivery Challan not found' });
    res.status(200).json(challan);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching challan', error: err.message });
  }
});

// ✅ Update Challan
router.put('/:id', protect, async (req, res) => {
  try {
    const challan = await DeliveryChallan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!challan) return res.status(404).json({ message: 'Delivery Challan not found' });

    const {
      challanNumber,
      clientName,
      tradeName,
      address,
      items,
      dispatchDate,
      deliveryMode,
      status,
      remarks
    } = req.body;

    challan.challanNumber = challanNumber;
    challan.clientName = clientName;
    challan.tradeName = tradeName;
    challan.address = address;
    challan.items = items;
    challan.dispatchDate = dispatchDate;
    challan.deliveryMode = deliveryMode;
    challan.status = status;
    challan.remarks = remarks;

    const updated = await challan.save();
    res.status(200).json({ message: 'Delivery Challan updated', challan: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating challan', error: err.message });
  }
});

// ✅ Delete Challan
router.delete('/:id', protect, async (req, res) => {
  try {
    const challan = await DeliveryChallan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!challan) return res.status(404).json({ message: 'Delivery Challan not found' });
    res.status(200).json({ message: 'Delivery Challan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting challan', error: err.message });
  }
});

export default router;
