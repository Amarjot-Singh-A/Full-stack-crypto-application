/****************************************************************************************
 * This file contains unit test for server/app.js
 ****************************************************************************************/

// Require the files and modules
require("dotenv").config();
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

// Test for /signin Route
describe("Test the /signin route", () => {
  test("should be loggedIn", async () => {
    const response = await request
      .post("/signin")
      .set("Accept", "application/json")
      .send({
        email: process.env.TEST_USER,
        password: process.env.TEST_USER_PASSWORD,
      });
    expect(response.status).toEqual(200);
    expect(response.body.loggedIn).toEqual(true);
  });
});

