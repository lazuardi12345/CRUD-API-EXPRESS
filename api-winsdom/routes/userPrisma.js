const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.send({
      status: true,
      message: "GET SUCCESS",
      data: employees,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error fetching data",
      data: [],
    });
  }
});

// Read employee by Id
router.get("/employees/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: id },
    });

    if (!employee) {
      res.status(404).send({
        status: false,
        message: "Employee not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "GET SUCCESS",
        data: employee,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error fetching data",
      data: [],
    });
  }
});

// Create new employee
router.post("/employees", async (req, res) => {
  const { userId, nama, alamat, no_hp, jenis_kelamin, umur } = req.body;
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        userId,
        nama,
        alamat,
        no_hp,
        jenis_kelamin,
        umur,
      },
    });

    res.send({
      status: true,
      message: "Data Created",
      data: newEmployee,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error creating data",
      data: [],
    });
  }
});

// Update employee
router.put("/employees/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, nama, alamat, no_hp, jenis_kelamin, umur } = req.body;

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: id },
      data: {
        userId,
        nama,
        alamat,
        no_hp,
        jenis_kelamin,
        umur,
      },
    });

    if (!updatedEmployee) {
      res.status(404).send({
        status: false,
        message: "Employee not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Update Success",
        data: updatedEmployee,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error updating data",
      data: [],
    });
  }
});

// Delete employee
router.delete("/employees/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: id },
    });

    if (!deletedEmployee) {
      res.status(404).send({
        status: false,
        message: "Employee not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Delete Success",
        data: deletedEmployee,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error deleting data",
      data: [],
    });
  }
});

module.exports = router;
