const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../config/config");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all items
router.get("/inventories", (req, res) => {
  const sql = "SELECT * FROM inventories";

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: "Error fetching data",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "GET SUCCESS",
        data: data,
      });
    }
  });
});

// Read item by Id
router.get("/inventories/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM inventories WHERE id = ${id}`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: "Error fetching data",
        data: [],
      });
    } else {
      if (data.length === 0) {
        res.status(404).send({
          status: false,
          message: "Item not found",
          data: [],
        });
      } else {
        res.send({
          status: true,
          message: "GET SUCCESS",
          data: data,
        });
      }
    }
  });
});

// Create new item
router.post("/inventories", upload.single("image"), (req, res) => {
  const { nama_barang, category, deskripsi, alamat, stok, status } = req.body;
  const image = req.file.filename; // Ambil nama file gambar yang diunggah

  const sql = `INSERT INTO inventories (nama_barang, category, deskripsi, alamat, image, stok, status) VALUES ('${nama_barang}', '${category}', '${deskripsi}', '${alamat}', '${image}', '${stok}', '${status}')`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: "Error creating data",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Data Created",
        data: data,
      });
    }
  });
});

// Update item
router.put("/inventories/:id", upload.single("image"), (req, res) => {
  const { nama_barang, category, deskripsi, alamat, stok, status } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;

  const sql = `UPDATE inventories SET nama_barang = '${nama_barang}', category = '${category}', deskripsi = '${deskripsi}', alamat = '${alamat}', image = ${image ? `'${image}'` : 'image'}, stok = '${stok}', status = '${status}' WHERE id = ${id}`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: "Error updating data",
        data: [],
      });
    } else {
      if (data.affectedRows === 0) {
        res.status(404).send({
          status: false,
          message: "Item not found",
          data: [],
        });
      } else {
        res.send({
          status: true,
          message: "Update Success",
          data: data,
        });
      }
    }
  });
});

// Delete item
router.delete("/inventories/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM inventories WHERE id = ${id}`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: "Error deleting data",
        data: [],
      });
    } else {
      if (data.affectedRows === 0) {
        res.status(404).send({
          status: false,
          message: "Item not found",
          data: [],
        });
      } else {
        res.send({
          status: true,
          message: "Delete Success",
          data: data,
        });
      }
    }
  });
});

//increase outStok
router.put('/increaseOutStok/:id', (req, res) => {
  const inventoryId = req.params.id;

  // Query untuk update outStock dan inStock
  const sql = `UPDATE inventories SET outStok = outStok + 1, 
              inStok = stok - outStok, 
              status = CASE 
              WHEN (stok - outStok) = 0 
              THEN 'disewa' ELSE 'tersedia' 
              END WHERE id = ${inventoryId}`
  
  // Eksekusi query
  db.query(sql, [inventoryId], (err, results) => {
    if (err) {
      console.error('Error updating inventory:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Inventory updated successfully');
      res.status(200).send('Inventory updated successfully');
    }
  });
});

//decrease outStok
router.put('/decreaseOutStok/:id', (req, res) => {
  const inventoryId = req.params.id;

  // Query untuk update outStock dan inStock
  const sql = `UPDATE inventories SET outStok = outStok - 1, 
              inStok = stok - outStok, 
              status = CASE 
              WHEN (stok - outStok) = 0 
              THEN 'disewa' ELSE 'tersedia' 
              END WHERE id = ${inventoryId}`
  
  // Eksekusi query
  db.query(sql, [inventoryId], (err, results) => {
    if (err) {
      console.error('Error updating inventory:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Inventory updated successfully');
      res.status(200).send('Inventory updated successfully');
    }
  });
});
module.exports = router;
