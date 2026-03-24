
const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/auth.controller");
const { listUsers, removeUser, updateUser } = require("../controllers/users.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");




router.post("/google", [
  body("credential").notEmpty().withMessage("Google credential is required"),
], validate, ctrl.googleAuth);


router.post("/send-otp", [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("purpose").optional().isIn(["signup", "login"]),
  body("name").optional().trim().isLength({ max: 100 }),
], validate, ctrl.sendOTP);


router.post("/verify-otp", [
  body("email").isEmail().normalizeEmail(),
  body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  body("purpose").optional().isIn(["signup", "login"]),
], validate, ctrl.verifyOTP);


router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
], validate, ctrl.login);


router.post("/refresh", ctrl.refresh);



router.post("/logout",  protect, ctrl.logout);
router.get("/me",       protect, ctrl.getMe);
router.put("/change-password", protect, [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
], validate, ctrl.changePassword);




router.get("/users",    protect, restrictTo("admin"), listUsers);


router.post("/register", protect, restrictTo("admin"), [
  body("name").trim().notEmpty().isLength({ max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body("role").optional().isIn(["editor", "admin"]),
], validate, ctrl.register);


router.patch("/users/:id/approve", protect, restrictTo("admin"), [
  body("role").isIn(["editor", "admin"]).withMessage("Role must be editor or admin"),
], validate, ctrl.approveUser);


router.patch("/users/:id", protect, restrictTo("admin"), updateUser);


router.delete("/users/:id", protect, restrictTo("admin"), removeUser);

module.exports = router;