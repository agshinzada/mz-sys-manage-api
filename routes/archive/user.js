const express = require("express");
const router = express.Router();
const userModule = require("../../modules/archive/user_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  userModule
    .getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /archive/users error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/:name", auth, (req, res) => {
  userModule
    .getUserBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /archive/users/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/", auth, (req, res) => {
  userModule
    .postUser(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Əlavə edildi");
      }
    })
    .catch((error) => {
      logger.error(`POST /archive/users error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/pass/:id", auth, (req, res) => {
  userModule
    .putUserPassword(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /archive/users error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.put("/:id", auth, (req, res) => {
  userModule
    .putUser(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /archive/users error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
