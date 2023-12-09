const { PrismaClient } = require("@prisma/client");
const express = require("express");
const request = require("supertest");
const router = require("../routes/userPrisma");

const prisma = new PrismaClient();
const app = express();
app.use("/", router);

describe("test handlers", function () {
  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect Prisma after all tests
  });

  test("respond to /employees", async () => {
    try {
      const response = await request(app).get("/employees");
      const getEmployees = await prisma.employee.findMany();
      expect(response.body).toEqual({
        status: true,
        message: "GET SUCCESS",
        data: getEmployees,
      });
    } catch (err) {
      console.error(err);
    }
  });

  test("post to /employees", async () => {
    try {
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

      const { userId, nama_employee, alamat, no_hp, jenis_kelamin, umur } =
        reqBody;
      const createEmployee = await prisma.employee.create({
        data: {
          userId,
          nama_employee,
          alamat,
          no_hp,
          jenis_kelamin,
          umur,
        },
      });

      expect(response.body).toEqual({
        status: true,
        message: "Data Created",
        data: {
          id: createEmployee.id,
          data: createEmployee,
        },
      });
    } catch (err) {
      console.error(err);
    }
  });
});
