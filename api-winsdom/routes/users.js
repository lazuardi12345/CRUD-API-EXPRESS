const express = require("express");
const router = express.Router();
const db = require("../config/config");

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all employees
router.get("/employees", (req, res) => {
  const sql = `SELECT * FROM employees`;

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

// Read employee by Id
router.get("/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM employees WHERE id = ${id}`;

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
          message: "Employee not found",
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

// Create new employee
router.post("/employees", (req, res) => {
  const { userId, nama, alamat, no_hp, jenis_kelamin, umur } = req.body;
  const sql = `INSERT INTO employees (userId, nama, alamat, no_hp, jenis_kelamin, umur) VALUES ('${userId}', '${nama}', '${alamat}', '${no_hp}', '${jenis_kelamin}', '${umur}')`;

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

// Update employee
router.put("/employees/:id", (req, res) => {
  const { userId, nama, alamat, no_hp, jenis_kelamin, umur } = req.body;
  const id = req.params.id;
  const sql = `UPDATE employees SET userId = '${userId}', nama = '${nama}', alamat = '${alamat}', no_hp = '${no_hp}', jenis_kelamin = '${jenis_kelamin}', umur = '${umur}' WHERE id = ${id}`;

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
          message: "Employee not found",
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

// Delete employee
router.delete("/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM employees WHERE id = ${id}`;

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
          message: "Employee not found",
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
