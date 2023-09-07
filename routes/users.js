const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const userController = require("../controllers/userController");

router.post(
  "/new-user",
  userMiddleware.checkSignUpData,
  userController.createUser
);

router.get("/login", userMiddleware.checkGetData, userController.getData);

router.post("/login", userMiddleware.checkGetToken, userController.getToken);

router.get("/", userMiddleware.checkGetData, userController.getData);
router.get("/:id", userController.getUsernameById);
module.exports = router;
