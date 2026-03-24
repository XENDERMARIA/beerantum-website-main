const Event = require("../models/Event");


async function getAll(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.status) filter.status = req.query.status;

    const events = await Event.find(filter)
      .sort({ date: req.query.status === "past" ? -1 : 1 })
      .lean();
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
}


async function getOne(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}


async function create(req, res, next) {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Event created", data: event });
  } catch (err) {
    next(err);
  }
}


async function update(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event updated", data: event });
  } catch (err) {
    next(err);
  }
}


async function remove(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
