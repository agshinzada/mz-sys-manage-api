const express = require("express");
const router = express.Router();
const logModule = require("../../modules/client/log_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  logModule
    .getLogs()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /logs error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.get("/search", auth, (req, res) => {
  logModule
    .getLogsBySearch(req.query.q)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /logs error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
