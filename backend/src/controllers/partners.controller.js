const Partner = require("../models/Partner");

async function getAll(req, res, next) {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: partners.length, data: partners });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const partner = await Partner.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Partner added", data: partner });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!partner) return res.status(404).json({ success: false, message: "Partner not found" });
    res.json({ success: true, message: "Partner updated", data: partner });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!partner) return res.status(404).json({ success: false, message: "Partner not found" });
    res.json({ success: true, message: "Partner removed" });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
