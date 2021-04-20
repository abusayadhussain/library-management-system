const express = require("express");
const router = express.Router();

const {
  create,
  authorById,
  read,
  update,
  remove,
  list,
} = require("../controllers/author");
const { requireSignIn, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/author/:authorId", read);
router.post("/author/create/:userId", requireSignIn, isAuth, isAdmin, create);
router.put(
  "/author/:authorId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  update
);
router.delete(
  "/author/:authorId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  remove
);
router.get("/authors", list);

router.param("userId", userById);
router.param("authorId", authorById);

module.exports = router;
