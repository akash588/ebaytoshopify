const express = require("express");
const app = express();
const CronJob = require("cron").CronJob;
// const schedule = require("node-schedule");
// var osu = require("node-os-utils");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const shopify = require("./controller/Shopify/ShopifyWebhook");
const EbaytokenUpdate = require("./controller/Ebay/ebayAccessTokenUpdate");
const getEbayproduct = require("./controller/Ebay/getallproduct");
const ShopifyProduct = require("./controller/Shopify/getallproductShopify");
const updateshopify = require("./controller/Shopify/updateShopifyProduct");

const getSKUItemByID = require("./controller/Ebay/getSKUbyItemId");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json({ limit: "125mb" }));

const CONNECTION_URL =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const port = 7000;

mongoose.connect(
  CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Connected to Database")
);

// updateshopify()
// fetch()
// ShopifyProduct()

// EbaytokenUpdate()
// getEbayproduct();
getSKUItemByID()

app.post("/shopify", async (req, res) => {
  //  console.log(req.body)
  await shopify(req.body);
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// var jobs = [
//   new CronJob({
//       cronTime: "0 */8 * * *", //every 8 hours
//       onTick: function() {
//         EbaytokenUpdate();
//       },
//       start: true, //don't start immediately
//       timeZone: 'America/Los_Angeles'
//   }),
//   // new CronJob({
//   //     cronTime: "00 00 9 * * 1", //9 am Monday morning
//   //     onTick: function() {
//   //         jobMondayMorning();
//   //     },
//   //     start: false,
//   //     timeZone: 'America/Los_Angeles'
//   // }),
// ];

// jobs.forEach(function(job) {
//   job.start(); //start the jobs
// });

process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error.message);
});

process.on("uncaughtException", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log("uncaughtException", error.message);
});

process.on("exit", (code) => {
  console.log(`About to exit with code: ${code}`);
});

process.on("SIGKILL", function (code) {
  console.log("SIGKILL received...", code);
});

process.once("SIGINT", function (code) {
  console.log("SIGINT received...", code);
});

// vs.

process.once("SIGTERM", function (code) {
  console.log("SIGTERM received...", code);
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = app;
