const express = require("express");
const router = express.Router();
const brands = require("../modules/brand_module");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  brands
    .getBrands()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/", auth, (req, res) => {
  brands
    .postBrand(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.put("/", auth, (req, res) => {
  brands
    .putBrand(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.put("/status", auth, (req, res) => {
  brands
    .changeBrandStatus(req.query)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/search", (req, res) => {
  brands
    .getBrandBySearch(req.query.q)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:abbr", (req, res) => {
  brands
    .getClientBrandsByAbbr(req.params.abbr)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
