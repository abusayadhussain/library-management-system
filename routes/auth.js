const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignIn,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
