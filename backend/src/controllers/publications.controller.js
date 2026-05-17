const Publication = require("../models/Publication");

async function getAll(req, res, next) {
  try {
    const publications = await Publication.find({ isActive: true }).sort({ order: 1, year: -1 }).lean();
    res.json({ success: true, count: publications.length, data: publications });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const publication = await Publication.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Publication added", data: publication });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!publication) return res.status(404).json({ success: false, message: "Publication not found" });
    res.json({ success: true, message: "Publication updated", data: publication });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!publication) return res.status(404).json({ success: false, message: "Publication not found" });
    res.json({ success: true, message: "Publication removed" });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
