const Achievement = require("../models/Achievement");

async function getAll(req, res, next) {
  try {
    const achievements = await Achievement.find({ isActive: true }).sort({ order: 1, year: -1 }).lean();
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const achievement = await Achievement.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Achievement added", data: achievement });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, message: "Achievement updated", data: achievement });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, message: "Achievement removed" });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
