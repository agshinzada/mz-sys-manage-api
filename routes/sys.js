const express = require("express");
const router = express.Router();
const sysModule = require("../modules/sys_module");
const auth = require("../middleware/auth");
const logger = require("../logger");

router.get("/status", auth, (req, res) => {
  sysModule
    .getStatusCodes()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
