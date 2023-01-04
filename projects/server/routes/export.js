const router = require("express").Router();
const { exports1 } = require("../controllers/index");
require("dotenv").config();

const mysql = require("mysql");

const fs = require("fs");

router.get("/stock", exports1.showAllStockData);
// router.get("/export_detail", exports1.getexportByName)

// Create a connection to the database

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Dudelwer123++",
  database: "delisha",
});

router.get("/stock/csv", exports1.exportcsv);

module.exports = router;
