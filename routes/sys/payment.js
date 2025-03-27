const express = require("express");
const router = express.Router();
const paymentModule = require("../../modules/sys/payment_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  paymentModule
    .getPayments()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /payments/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/delayed", auth, (req, res) => {
  paymentModule
    .getDelayedPayments()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /payments/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/remain", auth, (req, res) => {
  paymentModule
    .getPaymentRemain(req.query)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /payments/remain error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/search", auth, (req, res) => {
  let funcName;
  switch (req.body.param) {
    case 1:
      funcName = "getPaymentsByRecordId";
      break;
    case 2:
      funcName = "getPaymentsByDeviceId";
      break;
    case 3:
      funcName = "getPaymentsByOrderId";
      break;
    case 4:
      funcName = "getPaymentsByClientCode";
      break;
    case 5:
      funcName = "getPaymentsByStatus";
      break;

    default:
      break;
  }
  paymentModule[funcName](req.body.value)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /payments/search error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/status", auth, (req, res) => {
  paymentModule
    .updatePaymentStatus(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`POST /payments/status error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
