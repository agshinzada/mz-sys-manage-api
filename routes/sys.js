const express = require("express");
const router = express.Router();
const sysModule = require("../modules/sys_module");
const auth = require("../middleware/auth");
const logger = require("../logger");

router.get("/status", (req, res) => {
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
router.get("/status/orderkind", (req, res) => {
  sysModule
    .getOrderkindCodes()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.get("/brands", (req, res) => {
  sysModule
    .getBrands()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.get("/regions", (req, res) => {
  sysModule
    .getRegions()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/status/search", auth, (req, res) => {
  sysModule
    .getStatusCodesBySearch(req.query.q)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/status/orderkin/search", auth, (req, res) => {
  sysModule
    .getOrderkindCodesBySearch(req.query.q)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/status", auth, (req, res) => {
  sysModule
    .postStatus(req.body)
    .then((response) => {
      res.status(200).send("Əlavə edildi!");
    })
    .catch((error) => {
      logger.error(`POST /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.post("/status/orderkind", auth, (req, res) => {
  sysModule
    .postOrderkind(req.body)
    .then((response) => {
      res.status(200).send("Əlavə edildi!");
    })
    .catch((error) => {
      logger.error(`POST /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/status/:id", auth, (req, res) => {
  sysModule
    .putStatus(req.params.id, req.body)
    .then((response) => {
      res.status(200).send("Düzəliş edildi!");
    })
    .catch((error) => {
      logger.error(`POST /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.put("/status/orderkind/:id", auth, (req, res) => {
  sysModule
    .putOrderkind(req.params.id, req.body)
    .then((response) => {
      res.status(200).send("Düzəliş edildi!");
    })
    .catch((error) => {
      logger.error(`POST /sys/status/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/regions", auth, (req, res) => {
  sysModule
    .postRegion(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Əlavə edildi");
      }
    })
    .catch((error) => {
      logger.error(`POST /clients/regions error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/regions/:id", auth, (req, res) => {
  sysModule
    .putRegion(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /clients/regions error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/brands/:name", auth, (req, res) => {
  sysModule
    .getBrandsBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /clients/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/brands", auth, (req, res) => {
  sysModule
    .postBrand(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Əlavə edildi");
      }
    })
    .catch((error) => {
      logger.error(`POST /clients/brands error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/brands/:id", auth, (req, res) => {
  sysModule
    .putBrand(req.body, req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(500).send(dat.ErrorMessage);
      } else {
        res.status(200).send("Düzəliş edildi");
      }
    })
    .catch((error) => {
      logger.error(`PUT /clients/brands error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
