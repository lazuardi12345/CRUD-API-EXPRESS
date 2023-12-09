const express = require("express");
const request = require("supertest");
const router = require("../routes/users");
const db = require("../config/config");

const app = express();
app.use("/", router);

describe("test handler", function () {
  test("respond to /", async () => {
    try {
      const response = await request(app).get("/");
      expect(response.text).toContain("Cannot GET /"); // Sesuaikan dengan respons yang diharapkan
    } catch (err) {
      console.error(err);
    }
  });

  test("respond to /employees", async () => {
    const response = await request(app).get("/employees");
    const sql = `SELECT * FROM employees`;

    db.query(sql, (err, data) => {
      expect(err).toBeNull();
      expect(response.body).toEqual({
        status: true,
        message: "GET SUCCESS",
        data: data,
      });
    });
  });

  test("post to /employees", async () => {
    const reqBody = {
      userId: 3,
      nama_employee: "fajar",
      alamat: "kp babakan des tarikolot",
      no_hp: "08123142355",
      jenis_kelamin: "pria",
      umur: 23,
    };

    const response = await request(app)
      .post("/employees")
      .send(reqBody)
      .set("Accept", "application/json");

    try {
      const { userId, nama_employee, alamat, no_hp, jenis_kelamin, umur } =
        reqBody;
      const sql = `INSERT INTO employees (userId, nama_employee, alamat, no_hp, jenis_kelamin, umur) VALUES
            ( '${userId}', '${nama_employee}', '${alamat}', '${no_hp}', '${jenis_kelamin}', ${umur})`;

      db.query(sql, (err, data) => {
        expect(err).toBeNull();
        expect(response.body).toEqual({
          status: true,
          message: "Data Created",
          data: {
            id: data.insertId,
            fields: reqBody,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  });

  afterAll((done) => {
    db.end(done);
  });
});
