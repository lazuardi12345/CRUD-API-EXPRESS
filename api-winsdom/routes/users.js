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

//Read employees join users
router.get("/employees-join-users", (req, res) => {
  const sql = `SELECT users.NIK, users.role, employees.userId, employees.id, employees.nama_employee, employees.alamat, 
  employees.no_hp, employees.jenis_kelamin, employees.umur
  FROM employees
  INNER JOIN users ON employees.userId = users.id;`;
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

// Read employee join users by userId
router.get("/employees-join-users/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT users.NIK, users.role, employees.id, employees.userId, 
  employees.nama_employee, employees.alamat, employees.no_hp, employees.jenis_kelamin, 
  employees.umur
  FROM employees
  INNER JOIN users ON employees.userId = users.id
  WHERE userId = ${userId}`;
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
  const { userId, nama_employee, alamat, no_hp, jenis_kelamin, umur } =
    req.body;

  // Pastikan userId memiliki nilai yang valid
  if (!userId || userId === "undefined") {
    return res.status(400).send({
      status: false,
      message: "userId is required and must have a valid value",
      data: [],
    });
  }

  // Gunakan parameterized query
  const sql = `INSERT INTO employees (userId, nama_employee, alamat, no_hp, jenis_kelamin, umur) VALUES ('${userId}', '${nama_employee}', '${alamat}', '${no_hp}', '${jenis_kelamin}', '${umur}' )`;

  // Gunakan parameterized values
  db.query(
    sql,
    [userId, nama_employee, alamat, no_hp, jenis_kelamin, umur],
    (err, data) => {
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
    }
  );
});

// Update employee
router.put("/employees/:id", (req, res) => {
  const { nama, alamat, no_hp, jenis_kelamin, umur } = req.body;
  const id = req.params.id;
  const sql = `UPDATE employees SET nama_employee = '${nama}', alamat = '${alamat}', no_hp = 
  '${no_hp}', jenis_kelamin = '${jenis_kelamin}', umur = '${umur}' WHERE id = ${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: `Error updating data, ${err}`,
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

//Update employees join users
router.put("/employees-join-users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { nama, alamat, no_hp, jenis_kelamin, umur, role } = req.body;
  const sql = `UPDATE employees
JOIN users ON employees.userId = users.id
SET employees.nama_employee = '${nama}', employees.alamat = '${alamat}', 
employees.no_hp = '${no_hp}', employees.jenis_kelamin = '${jenis_kelamin}', employees.umur = 
'${umur}', users.role = '${role}'
WHERE employees.userId = ${userId}`;
  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send({
        status: false,
        message: `Error updating data, ${err}`,
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

// Delete user
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM users WHERE id = ${id}`;
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
