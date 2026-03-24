const Contact = require("../models/Contact");


async function submit(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been received! We will get back to you within 48 hours.",
      data: { id: contact._id },
    });
  } catch (err) {
    next(err);
  }
}


async function getAll(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const [submissions, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: submissions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}


async function updateStatus(req, res, next) {
  try {
    const { status, adminNotes } = req.body;
    const update = { status };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (status !== "new") {
      update.handledBy = req.user.id;
      update.handledAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Submission not found" });

    res.json({ success: true, message: "Status updated", data: contact });
  } catch (err) {
    next(err);
  }
}


async function remove(req, res, next) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Submission not found" });
    res.json({ success: true, message: "Submission deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit, getAll, updateStatus, remove };
