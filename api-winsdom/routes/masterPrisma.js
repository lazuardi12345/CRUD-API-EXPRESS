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
router.get("/inventories", async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany();
    res.send({
      status: true,
      message: "GET SUCCESS",
      data: inventories,
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
router.get("/inventories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: id },
    });

    if (!inventory) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "GET SUCCESS",
        data: inventory,
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
router.post("/inventories", async (req, res) => {
  const {
    nama_barang,
    category,
    deskripsi,
    alamat,
    image,
    stok,
    outStok,
    inStok,
    status,
  } = req.body;
  try {
    const newInventory = await prisma.inventory.create({
      data: {
        nama: nama_barang,
        category,
        deskripsi,
        alamat,
        image,
        stok,
        outStok,
        inStok,
        status,
      },
    });

    res.send({
      status: true,
      message: "Data Created",
      data: newInventory,
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
router.put("/inventories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    nama_barang,
    category,
    deskripsi,
    alamat,
    image,
    stok,
    outStok,
    inStok,
    status,
  } = req.body;

  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: id },
      data: {
        nama: nama_barang,
        category,
        deskripsi,
        alamat,
        image,
        stok,
        outStok,
        inStok,
        status,
      },
    });

    if (!updatedInventory) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Update Success",
        data: updatedInventory,
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
router.delete("/inventories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedInventory = await prisma.inventory.delete({
      where: { id: id },
    });

    if (!deletedInventory) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Delete Success",
        data: deletedInventory,
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
