const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/config");

// Register
router.post("/register", async (req, res) => {
  try {
    const { NIK, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (NIK, password, role) VALUES ('${NIK}', '${hashedPassword}', '${role}')`;

    db.query(sql, (err, data) => {
      if (err) {
        res.status(500).send({
          status: false,
          message: "Error creating user",
          data: [],
        });
      } else {
        res.send({
          status: true,
          message: "User registered successfully",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "Error creating user",
      data: [],
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { NIK, password } = req.body;

    const sql = `SELECT * FROM users WHERE NIK = '${NIK}'`;

    db.query(sql, async (err, data) => {
      if (err) {
        res.status(500).send({
          status: false,
          message: "Error fetching user",
          data: [],
        });
      } else {
        if (data.length === 0) {
          res.status(404).send({
            status: false,
            message: "User not found",
            data: [],
          });
        } else {
          const user = data[0];
          const match = await bcrypt.compare(password, user.password);

          if (match) {
            // Generate JWT token
            const token = jwt.sign(
              { userId: user.id, role: user.role },
              "secret_key",
              {
                expiresIn: "1h",
              }
            );

            res.send({
              status: true,
              message: "Login successful",
              token: token,
            });
          } else {
            res.status(401).send({
              status: false,
              message: "Invalid password",
              data: [],
            });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "Error logging in",
      data: [],
    });
  }
});

module.exports = router;
