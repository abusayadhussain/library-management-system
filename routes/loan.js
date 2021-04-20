const express = require("express");
const router = express.Router();

const {
    create,
    loanById,
    read,
    remove,
    update,
    list,
    returnLoan,
    genrateExcel,
    verifyLoan
  } = require("../controllers/loan");
const { requireSignIn, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/loan/:loanId/:userId", requireSignIn, isAuth, read);
router.post("/loan/create/:userId", requireSignIn, isAuth, create);
router.delete(
  "/loan/:loanId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/loan/:loanId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  update
);

router.get("/loans/:userId",
requireSignIn,
isAuth,
isAdmin,
 list
 );
router.post(
    "/return-loan/:loanId/:userId",
    requireSignIn,
    isAuth,
    returnLoan
)

router.get(
  "/verify-loan/:loanId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  verifyLoan
)

router.get(
    "/generate-loan-data/:userId",
    requireSignIn,
    isAuth,
    isAdmin,
    genrateExcel
)


router.param("userId", userById);
router.param("loanId", loanById);

module.exports = router;