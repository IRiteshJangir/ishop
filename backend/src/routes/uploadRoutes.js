const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    const file = req.files && req.files[0] ? req.files[0] : req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Please provide an image file' });
    }
    const fileUrl = `/uploads/${file.filename}`;
    const port = process.env.PORT || 5000;
    const fullUrl = `http://localhost:${port}${fileUrl}`;
    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      fullUrl,
      filename: file.filename,
    });
  });
});

module.exports = router;
