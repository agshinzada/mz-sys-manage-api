const express = require("express");
const cors = require("cors");

const app = express();
const port = 5188;

const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/order");
const userRoute = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/auth", userRoute);

app.get("/api", (req, res) => {
  res.status(200).send("Server connected!");
});

app.listen(port, () => console.log(`Server started! PORT:${port}`));
