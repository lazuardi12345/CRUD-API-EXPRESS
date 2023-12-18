const express = require("express");
const router = express.Router();
const db = require("../config/config");

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all items
router.get("/peminjamans", (req, res) => {
  const sql = "SELECT * FROM peminjamans";

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
router.get("/peminjamans/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM peminjamans WHERE id = ${id}`;

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
router.post("/peminjamans", (req, res) => {
  const {
    userId,
    nama_employee,
    inventoryId,
    tanggal_mulai_peminjaman,
    tanggal_akhir_peminjaman,
    verifikasiPeminjaman,
    verifikasiPengembalian,
  } = req.body;

  const sql = `
    INSERT INTO peminjamans (
      userId,
      nama_employee,
      inventoryId,
      nama_barang,
      tanggal_mulai_peminjaman,
      tanggal_akhir_peminjaman,
      verifikasiPeminjaman,
      verifikasiPengembalian
    ) VALUES (
      '${userId}',
      '${nama_employee}',
      '${inventoryId}',
      '${tanggal_mulai_peminjaman}',
      '${tanggal_akhir_peminjaman}',
      '${verifikasiPeminjaman}',
      '${verifikasiPengembalian}'
    )`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
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
router.put("/peminjamans/:id", (req, res) => {
  const {
    nama_employee,
    tanggal_mulai_peminjaman,
    tanggal_akhir_peminjaman,
    verifikasiPeminjaman,
    verifikasiPengembalian,
  } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE peminjamans SET 
      nama_employee = '${nama_employee}',
      tanggal_mulai_peminjaman = '${tanggal_mulai_peminjaman}',
      tanggal_akhir_peminjaman = '${tanggal_akhir_peminjaman}',
      verifikasiPeminjaman = '${verifikasiPeminjaman}',
      verifikasiPengembalian = '${verifikasiPengembalian}'
    WHERE id = ${id}`;

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
router.delete("/peminjamans/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM peminjamans WHERE id = ${id}`;

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

// Read peminjamans join inventories
router.get("/peminjamans-join-inventories/", (req, res) => {
  const sql = `SELECT inventories.nama_barang, peminjamans.*
              FROM peminjamans
              INNER JOIN inventories ON peminjamans.inventoryId = inventories.id;`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: `Error fetching data, ${err}`,
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

// Update "verifikasiPeminjaman"
router.put("/verifikasi-peminjaman/:id", (req, res) => {
  const {
    verifikasiPeminjaman
  } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE peminjamans SET 
      verifikasiPeminjaman = '${verifikasiPeminjaman}'
    WHERE id = ${id}`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: `Error fetching data, ${err}`,
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

// Update "verifikasiPengembalian"
router.put("/verifikasi-pengembalian/:id", (req, res) => {
  const {
    verifikasiPengembalian
  } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE peminjamans SET 
      verifikasiPengembalian = '${verifikasiPengembalian}'
    WHERE id = ${id}`;

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: `Error fetching data, ${err}`,
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

module.exports = router;
