const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');

const {
  signup,
  signin,
} = require("../controllers/auth");


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,  './upload-profile-image');
  },
  filename: function(req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/signup",upload.single('profileImage') ,signup);
router.post("/signin", signin);
// router.get("/signout", signout);

module.exports = router;
