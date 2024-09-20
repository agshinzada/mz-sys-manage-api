const express = require("express");
const router = express.Router();
const orderModule = require("../modules/order_module");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  orderModule
    .getBrands()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
