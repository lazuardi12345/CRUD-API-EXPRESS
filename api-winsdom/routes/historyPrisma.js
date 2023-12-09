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
router.get("/histories", async (req, res) => {
  try {
    const histories = await prisma.history.findMany();
    res.send({
      status: true,
      message: "GET SUCCESS",
      data: histories,
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
router.get("/histories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const history = await prisma.history.findUnique({
      where: { id: id },
    });

    if (!history) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "GET SUCCESS",
        data: history,
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
router.post("/histories", async (req, res) => {
  const { userId, inventoryId, idPeminjaman, kondisi } = req.body;

  try {
    const newHistory = await prisma.history.create({
      data: {
        userId,
        inventoryId,
        idPeminjaman,
        kondisi,
      },
    });

    res.send({
      status: true,
      message: "Data Created",
      data: newHistory,
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
router.put("/histories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, inventoryId, idPeminjaman, kondisi } = req.body;

  try {
    const updatedHistory = await prisma.history.update({
      where: { id: id },
      data: {
        userId,
        inventoryId,
        idPeminjaman,
        kondisi,
      },
    });

    if (!updatedHistory) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Update Success",
        data: updatedHistory,
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
router.delete("/histories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedHistory = await prisma.history.delete({
      where: { id: id },
    });

    if (!deletedHistory) {
      res.status(404).send({
        status: false,
        message: "Item not found",
        data: [],
      });
    } else {
      res.send({
        status: true,
        message: "Delete Success",
        data: deletedHistory,
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
