const Advisor = require("../models/Advisor");

async function getAll(req, res, next) {
  try {
    const advisors = await Advisor.find({ isActive: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: advisors.length, data: advisors });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const advisor = await Advisor.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Advisor added", data: advisor });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const advisor = await Advisor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!advisor) return res.status(404).json({ success: false, message: "Advisor not found" });
    res.json({ success: true, message: "Advisor updated", data: advisor });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const advisor = await Advisor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!advisor) return res.status(404).json({ success: false, message: "Advisor not found" });
    res.json({ success: true, message: "Advisor removed" });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
