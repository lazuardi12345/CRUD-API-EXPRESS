const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API Endpoint untuk Upload Gambar
router.post("/upload/images", upload.single("image"), (req, res) => {
  const image = req.file;
  // Lakukan sesuatu dengan gambar yang diunggah
  res.json({ message: "Image uploaded successfully", data: image });
});

// API Endpoint untuk Mengambil Semua Gambar
router.use("/images", express.static(path.join(__dirname, "uploads")));

module.exports = router;
