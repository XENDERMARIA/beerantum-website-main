const router = require("express").Router();
const ctrl = require("../controllers/partners.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

router.get("/", ctrl.getAll);
router.post("/", protect, restrictTo("admin", "editor"), ctrl.create);
router.put("/:id", protect, restrictTo("admin", "editor"), ctrl.update);
router.delete("/:id", protect, restrictTo("admin"), ctrl.remove);

module.exports = router;
