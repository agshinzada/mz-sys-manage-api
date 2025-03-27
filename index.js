const express = require("express");
const cors = require("cors");

const app = express();
const port = 5189;

const orderRoute = require("./routes/sys/order");
const paymentRoute = require("./routes/sys/payment");
const deviceRoute = require("./routes/sys/device");
const userRoute = require("./routes/sys/user");
const regionRoute = require("./routes/client/region");
const categoryRoute = require("./routes/client/clcategory");
const discountRoute = require("./routes/client/discount");
const campaignRoute = require("./routes/client/campaign");
const deliveryRoute = require("./routes/client/delivery");
const visitRoute = require("./routes/client/visit");
const clientUserRoute = require("./routes/client/user");
const clientCodeRoute = require("./routes/client/code");
const clientLogRoute = require("./routes/client/log");
const mobimDeviceRoute = require("./routes/mobim/device");
const mobimConnRoute = require("./routes/mobim/connection");
const mobimServiceRoute = require("./routes/mobim/service");
const mobimRoute = require("./routes/mobim/mobim");
const reportService = require("./routes/report");
const sysService = require("./routes/sys");
const archiveUserRoute = require("./routes/archive/user");
const archiveLogRoute = require("./routes/archive/log");
const logger = require("./logger");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/devices", deviceRoute);
app.use("/api/auth", userRoute);
app.use("/api/sys", sysService);

app.use("/api/clients/regions", regionRoute);
app.use("/api/clients/category", categoryRoute);
app.use("/api/clients/discounts", discountRoute);
app.use("/api/clients/campaigns", campaignRoute);
app.use("/api/clients/delivery", deliveryRoute);
app.use("/api/clients/visits", visitRoute);
app.use("/api/clients/users", clientUserRoute);
app.use("/api/clients/codes", clientCodeRoute);
app.use("/api/clients/logs", clientLogRoute);

app.use("/api/mobim/devices", mobimDeviceRoute);
app.use("/api/mobim/connections", mobimConnRoute);
app.use("/api/mobim/services", mobimServiceRoute);
app.use("/api/mobim", mobimRoute);

app.use("/api/reports", reportService);

app.use("/api/archive/users", archiveUserRoute);
app.use("/api/archive/logs", archiveLogRoute);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/api", (req, res) => {
  res.status(200).send("Server connected!");
});

app.listen(port, () => console.log(`Server started! PORT:${port}`));
