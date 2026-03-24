const TeamMember = require("../models/TeamMember");


async function getAll(req, res, next) {
  try {
    const members = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, count: members.length, data: members });
  } catch (err) {
    next(err);
  }
}


async function getOne(req, res, next) {
  try {
    const member = await TeamMember.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}


async function create(req, res, next) {
  try {
    const member = await TeamMember.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Team member added", data: member });
  } catch (err) {
    next(err);
  }
}


async function update(req, res, next) {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }
    res.json({ success: true, message: "Team member updated", data: member });
  } catch (err) {
    next(err);
  }
}


async function remove(req, res, next) {
  try {
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }
    res.json({ success: true, message: "Team member removed" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
