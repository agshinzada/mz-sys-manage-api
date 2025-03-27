const express = require("express");
const router = express.Router();
const orderModule = require("../../modules/sys/order_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  orderModule
    .getOrders()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /orders/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/delayed", auth, (req, res) => {
  orderModule
    .getDelayedOrders()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /orders/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/lines", auth, (req, res) => {
  orderModule
    .getOrderLinesByOrderId(req.query.orderId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /orders/lines error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/logo/filter", auth, (req, res) => {
  orderModule
    .getLogoOrdersByFilter(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`POST /orders/logo/filter error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/logo/search", auth, (req, res) => {
  orderModule
    .getLogoOrdersBySearch(req.query.q)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`POST /orders/logo/filter error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/status", auth, (req, res) => {
  orderModule
    .updateOrderStatus(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`POST /orders/status error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/search", auth, (req, res) => {
  let funcName;
  switch (req.body.param) {
    case 1:
      funcName = "getOrdersByRecordId";
      break;
    case 2:
      funcName = "getOrdersByDeviceId";
      break;
    case 3:
      funcName = "getOrdersByOrderId";
      break;
    case 4:
      funcName = "getOrdersByClientCode";
      break;
    case 5:
      funcName = "getOrdersByStatus";
      break;

    default:
      break;
  }
  orderModule[funcName](req.body.value)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /orders/search error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
