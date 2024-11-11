const express = require("express");
const router = express.Router();
const serviceModule = require("../../modules/mobim/service_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");

router.get("/", auth, (req, res) => {
  serviceModule
    .getServices()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /services error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.get("/tasks", auth, (req, res) => {
  serviceModule
    .getServiceTasks()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /services/tasks error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/tasks/:name", auth, (req, res) => {
  serviceModule
    .getServiceTasksBySearch(req.params.name)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /services/tasks/:name error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/tasks/open", auth, (req, res) => {
  serviceModule
    .changeAllTaskDate(0)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/open error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/tasks/close", auth, (req, res) => {
  serviceModule
    .changeAllTaskDate(1)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/close error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/tasks/date", auth, (req, res) => {
  serviceModule
    .changeTaskDate(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/date error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

// router.post("/", auth, (req, res) => {
//   brandModule
//     .postBrand(req.body)
//     .then((response) => {
//       const dat = (response && response[0]) || [];
//       if (dat?.ErrorNumber) {
//         res.status(500).send(dat.ErrorMessage);
//       } else {
//         res.status(200).send("Əlavə edildi");
//       }
//     })
//     .catch((error) => {
//       logger.error(`POST /clients/brands error : ${error.message}`);
//       res.status(500).send(error.message);
//     });
// });

// router.put("/:id", auth, (req, res) => {
//   brandModule
//     .putBrand(req.body, req.params.id)
//     .then((response) => {
//       const dat = (response && response[0]) || [];
//       if (dat?.ErrorNumber) {
//         res.status(500).send(dat.ErrorMessage);
//       } else {
//         res.status(200).send("Düzəliş edildi");
//       }
//     })
//     .catch((error) => {
//       logger.error(`PUT /clients/brands error : ${error.message}`);
//       res.status(500).send(error.message);
//     });
// });

module.exports = router;
