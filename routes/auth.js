const express = require("express");
const router = express.Router();
const multer = require("multer");


const {
  signup,
  signin,
} = require("../controllers/auth");

//storage for image to store with multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,  './upload-profile-image');
  },
  filename: function(req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname);
  }
});

//filtering to store only jpg or img file to store
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//creating multer for storage limit and filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/signup",upload.single('profileImage') ,signup);
router.post("/signin", signin);


module.exports = router;
