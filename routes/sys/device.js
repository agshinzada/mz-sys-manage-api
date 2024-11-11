const express = require("express");
const router = express.Router();
const devModule = require("../../modules/sys/device_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/:id", auth, (req, res) => {
  devModule
    .getDeviceDetailById(req.params.id)
    .then((response) => {
      res.status(200).send(...response);
    })
    .catch((error) => {
      logger.error(`GET /devices/id error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
