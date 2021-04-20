const express = require("express");
const router = express.Router();

const {
  create,
  bookById,
  read,
  remove,
  update,
  list,
  listRelated,
  listAuthors,
  listSearch,
} = require("../controllers/book");
const { requireSignIn, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { authorById } = require("../controllers/author");

router.get("/book/:bookId", read);
router.post("/book/create/:userId", requireSignIn, isAuth, isAdmin, create);
router.delete(
  "/book/:bookId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/book/:bookId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  update
);

router.get("/books", list);
router.get("/books/search", listSearch);
router.get("/books/related/:bookId", listRelated);
router.get("/books/authors", listAuthors);



router.param("userId", userById);
router.param("bookId", bookById);
router.param("authorId", authorById);
module.exports = router;
