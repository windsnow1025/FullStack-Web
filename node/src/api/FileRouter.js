const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({storage: storage});

// File Upload Endpoint
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }

  // Generate file access URL
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  return res.status(200).json({url: url});
});

module.exports = router;
