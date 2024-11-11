const express = require("express");
const router = express.Router();
const visitModule = require("../../modules/client/visit_module");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  visitModule
    .getVisitDay()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/visits error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/:name", auth, (req, res) => {
  visitModule
    .getVisitDayBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/visits/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
