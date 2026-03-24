const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/contact.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 200 }),
  body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10–2000 characters"),
];


router.post("/", contactValidation, validate, ctrl.submit);


router.get("/", protect, restrictTo("admin", "editor"), ctrl.getAll);
router.patch("/:id/status", protect, restrictTo("admin", "editor"), ctrl.updateStatus);
router.delete("/:id", protect, restrictTo("admin"), ctrl.remove);

module.exports = router;
