const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware untuk menangani kesalahan umum
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Read all items
router.get("/peminjamans", async (req, res) => {
  try {
    const peminjamans = await prisma.peminjaman.findMany();
    res.send({
      status: true,
      message: "GET SUCCESS",
      data: peminjamans,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error fetching data",
      data: [],
    });
  }
});

// Read item by Id
router.get("/peminjamans/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id: id },
    });

    if (!peminjaman) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "GET SUCCESS",
        data: peminjaman,
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

// Create new item
router.post("/peminjamans", async (req, res) => {
  const {
    userId,
    nama_employee,
    inventoryId,
    nama_barang,
    tanggalPeminjaman,
    tanggalPengembalian,
    verifikasiPeminjaman,
    kondisi,
    catatan,
    inStok,
    outStok,
  } = req.body;

  try {
    const newPeminjaman = await prisma.peminjaman.create({
      data: {
        userId,
        nama_employee,
        inventoryId,
        nama_barang,
        tanggalPeminjaman,
        tanggalPengembalian,
        verifikasiPeminjaman,
        kondisi,
        catatan,
        inStok,
        outStok,
      },
    });

    res.send({
      status: true,
      message: "Data Created",
      data: newPeminjaman,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error creating data",
      data: [],
    });
  }
});

// Update item
router.put("/peminjamans/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    userId,
    nama_employee,
    inventoryId,
    nama_barang,
    tanggalPeminjaman,
    tanggalPengembalian,
    verifikasiPeminjaman,
    kondisi,
    catatan,
    inStok,
    outStok,
  } = req.body;

  try {
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id: id },
      data: {
        userId,
        nama_employee,
        inventoryId,
        nama_barang,
        tanggalPeminjaman,
        tanggalPengembalian,
        verifikasiPeminjaman,
        kondisi,
        catatan,
        inStok,
        outStok,
      },
    });

    if (!updatedPeminjaman) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Update Success",
        data: updatedPeminjaman,
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

// Delete item
router.delete("/peminjamans/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedPeminjaman = await prisma.peminjaman.delete({
      where: { id: id },
    });

    if (!deletedPeminjaman) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Delete Success",
        data: deletedPeminjaman,
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
