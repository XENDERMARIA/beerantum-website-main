const router = require("express").Router();
const ctrl = require("../controllers/content.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

router.get("/", ctrl.getAll);
router.get("/:key", ctrl.getByKey);
router.put("/:key", protect, restrictTo("admin", "editor"), ctrl.upsert);

module.exports = router;
