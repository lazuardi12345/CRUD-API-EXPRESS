const express = require("express");
const router = express.Router();
const db = require("../config/config");

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all items
router.get("/histories", (req, res) => {
  const sql = "SELECT * FROM histories";

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
router.get("/histories/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM histories WHERE id = ${id}`;

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
router.post("/histories", (req, res) => {
  const {
    idPeminjaman,
    tanggalPengembalian,
    kondisi,
    catatan,
  } = req.body;
  const sql = `INSERT INTO histories (idPeminjaman, tanggalPengembalian,  kondisi, catatan) VALUES ('${idPeminjaman}', '${tanggalPengembalian}', '${kondisi}', '${catatan}')`;

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
router.put("/histories/:id", (req, res) => {
  const {
    idPeminjaman,
    tanggalPengembalian,
    kondisi,
    catatan,
  } = req.body;
  const id = req.params.id;
  const sql = `UPDATE histories SET idPeminjaman = '${idPeminjaman}', tanggalPengembalian = '${tanggalPengembalian}', kondisi = '${kondisi}' catatan = '${catatan}' WHERE id = ${id}`;

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
router.delete("/histories/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM histories WHERE id = ${id}`;

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

// Read all items histories join peminjamans
router.get("/histories-join-peminjamans", (req, res) => {
  const sql = `SELECT histories.id, peminjamans.id as idPeminjaman, employees.userId, employees.nama_employee, inventories.nama_barang, 
  peminjamans.tanggal_mulai_peminjaman, peminjamans.tanggal_akhir_peminjaman, 
  histories.tanggalPengembalian, histories.kondisi, histories.catatan
  FROM peminjamans
  JOIN employees ON peminjamans.userId = employees.userId
  JOIN inventories ON peminjamans.inventoryId = inventories.id
  JOIN histories ON peminjamans.id = histories.idPeminjaman`;
  

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

// Read item histories join peminjamans by UserId
router.get("/histories-join-peminjamans/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT histories.id, peminjamans.id as idPeminjaman, employees.userId, employees.nama_employee, inventories.nama_barang, 
  peminjamans.tanggal_mulai_peminjaman, peminjamans.tanggal_akhir_peminjaman, 
  histories.tanggalPengembalian, histories.kondisi, histories.catatan
  FROM peminjamans
  JOIN employees ON peminjamans.userId = employees.userId
  JOIN inventories ON peminjamans.inventoryId = inventories.id
  JOIN histories ON peminjamans.id = histories.idPeminjaman
  WHERE employees.userId = '${userId}'`;
  

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

module.exports = router;
