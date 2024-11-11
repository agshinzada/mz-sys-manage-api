const express = require("express");
const router = express.Router();
const deliveryModule = require("../../modules/client/delivery_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  deliveryModule
    .getDelivery()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/delivery error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/:name", auth, (req, res) => {
  deliveryModule
    .getDeliveryBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/delivery/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/", auth, (req, res) => {
  deliveryModule
    .postDelivery(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Əlavə edildi");
      }
    })
    .catch((error) => {
      logger.error(`POST /clients/delivery error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/:id", auth, (req, res) => {
  deliveryModule
    .putDelivery(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /clients/delivery error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
