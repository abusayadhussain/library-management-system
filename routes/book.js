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
  listBySearch,
  listSearch,
} = require("../controllers/book");
const { requireSignIn, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

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
router.get("/books/related/:productId", listRelated);
router.get("/books/authors", listAuthors);
router.post("/books/by/search", listBySearch);


router.param("userId", userById);
router.param("bookId", bookById);

module.exports = router;
