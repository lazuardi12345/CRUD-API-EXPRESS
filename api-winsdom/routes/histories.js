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
  const { userId, inventoryId, idPeminjaman, kondisi } = req.body;
  const sql = `INSERT INTO histories (userId, inventoryId, idPeminjaman, kondisi) VALUES ('${userId}', '${inventoryId}', '${idPeminjaman}', '${kondisi}')`;

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
  const { userId, inventoryId, idPeminjaman, kondisi } = req.body;
  const id = req.params.id;
  const sql = `UPDATE histories SET userId = '${userId}', inventoryId = '${inventoryId}', idPeminjaman = '${idPeminjaman}', kondisi = '${kondisi}' WHERE id = ${id}`;

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

module.exports = router;
