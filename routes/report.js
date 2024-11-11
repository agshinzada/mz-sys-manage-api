const express = require("express");
const router = express.Router();
const reportModule = require("../modules/report_module");
const auth = require("../middleware/auth");
const logger = require("../logger");

router.get("/retrification", auth, (req, res) => {
  reportModule
    .getReportRetrification()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /report/retrification error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
