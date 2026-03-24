

const User = require("../models/User");


async function listUsers(req, res, next) {
    try {
        const users = await User.find().select("-password -refreshToken").sort({ createdAt: 1 });
        res.json({ success: true, data: users.map(u => u.toSafeObject()) });
    } catch (err) { next(err); }
}


async function removeUser(req, res, next) {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot remove your own account" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User removed" });
    } catch (err) { next(err); }
}


async function updateUser(req, res, next) {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot modify your own account here" });
        }
        const allowed = {};
        if (req.body.isActive !== undefined) allowed.isActive = req.body.isActive;
        if (req.body.role !== undefined && ["admin", "editor"].includes(req.body.role)) allowed.role = req.body.role;

        const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User updated", data: user.toSafeObject() });
    } catch (err) { next(err); }
}

module.exports = { listUsers, removeUser, updateUser };
