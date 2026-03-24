const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/team.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const memberValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("role").trim().notEmpty().withMessage("Role is required").isLength({ max: 100 }),
  body("education").trim().notEmpty().withMessage("Education is required"),
  body("bio").optional().isLength({ max: 500 }),
  body("photoUrl").optional().isURL().withMessage("Must be a valid URL"),
  body("isLeadership").optional().isBoolean(),
  body("order").optional().isInt({ min: 1 }),
];


router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);


router.post("/", protect, restrictTo("admin", "editor"), memberValidation, validate, ctrl.create);
router.put("/:id", protect, restrictTo("admin", "editor"), memberValidation, validate, ctrl.update);
router.delete("/:id", protect, restrictTo("admin"), ctrl.remove);

module.exports = router;
