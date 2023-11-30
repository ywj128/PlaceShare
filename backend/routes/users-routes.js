const express = require("express");
const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("email").normalizeEmail().isEmail(),
    check("name").notEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
