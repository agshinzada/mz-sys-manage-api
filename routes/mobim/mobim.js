const express = require("express");
const router = express.Router();
const mobimModule = require("../../modules/mobim/mobim_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/users", auth, (req, res) => {
  mobimModule
    .getMobimUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /mobim/users error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
