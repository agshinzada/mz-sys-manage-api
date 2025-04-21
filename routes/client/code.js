const express = require("express");
const router = express.Router();
const codeModule = require("../../modules/client/code_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.post("/createcode", auth, (req, res) => {
  codeModule
    .createCodes(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`POST /clients/codes/createcode error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/createsticker", auth, (req, res) => {
  codeModule
    .createStickerCodes(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(
        `POST /clients/codes/createsticker error : ${error.message}`
      );
      res.status(500).send(error.message);
    });
});

router.post("/check", auth, (req, res) => {
  codeModule
    .checkClientCode(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`POST /clients/check error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/bulk", auth, (req, res) => {
  codeModule
    .insertBulkClients(req.body)
    .then((response) => {
      res.status(200).send("Müştərilər uğurla əlavə edildi!");
    })
    .catch((error) => {
      logger.error(`POST /clients/bulk error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/bulk/sticker", auth, (req, res) => {
  codeModule
    .insertBulkStickers(req.body)
    .then((response) => {
      res.status(200).send("Stikerlər uğurla əlavə edildi!");
    })
    .catch((error) => {
      logger.error(`POST /clients/bulk/sticker error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/routes", auth, (req, res) => {
  codeModule
    .getRoutes()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/codes error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
