const Content = require("../models/Content");


async function getByKey(req, res, next) {
  try {
    const content = await Content.findOne({ key: req.params.key }).lean();
    if (!content) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, data: content });
  } catch (err) { next(err); }
}


async function getAll(req, res, next) {
  try {
    const contents = await Content.find().lean();
    
    const map = {};
    contents.forEach((c) => { map[c.key] = c.data; });
    res.json({ success: true, data: map });
  } catch (err) { next(err); }
}


async function upsert(req, res, next) {
  try {
    const { key } = req.params;
    const { section, data } = req.body;

    const content = await Content.findOneAndUpdate(
      { key },
      { key, section, data, updatedBy: req.user.id },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, message: "Content updated", data: content });
  } catch (err) { next(err); }
}

module.exports = { getByKey, getAll, upsert };
