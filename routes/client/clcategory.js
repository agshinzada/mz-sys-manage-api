const express = require("express");
const router = express.Router();
const categoryModule = require("../../modules/client/clcategory_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  categoryModule
    .getCategory()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/category error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/:name", auth, (req, res) => {
  categoryModule
    .getCategoryBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/category/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/", auth, (req, res) => {
  categoryModule
    .postCategory(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Əlavə edildi");
      }
    })
    .catch((error) => {
      logger.error(`POST /clients/category error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/:id", auth, (req, res) => {
  categoryModule
    .putCategory(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /clients/category error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
