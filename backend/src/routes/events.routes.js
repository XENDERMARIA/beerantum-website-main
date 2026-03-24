
const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/events.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const eventValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("date").isISO8601().withMessage("Valid start date required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("status").isIn(["upcoming", "ongoing", "past"]).withMessage("Invalid status"),
];

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", protect, restrictTo("admin", "editor"), eventValidation, validate, ctrl.create);
router.put("/:id", protect, restrictTo("admin", "editor"), eventValidation, validate, ctrl.update);
router.delete("/:id", protect, restrictTo("admin"), ctrl.remove);

module.exports = router;
