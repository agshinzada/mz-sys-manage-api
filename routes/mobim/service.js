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

router.get("/tasks/:value", auth, (req, res) => {
  serviceModule
    .getServiceTasksBySearch(req.params.value)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /services/tasks/value error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/tasks/open", auth, (req, res) => {
  serviceModule
    .putTasksDate()
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        throw Error(dat.ErrorMessage);
      } else {
        res.status(200).send("Tasklar aktiv edildi!");
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/open error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.put("/tasks/status/bulk", auth, (req, res) => {
  serviceModule
    .putBulkTaskStatus(req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        throw Error(dat.ErrorMessage);
      } else {
        res.status(200).send("Tasklar aktiv edildi!");
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/id error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.put("/tasks/status/:id", auth, (req, res) => {
  serviceModule
    .putTaskStatus(req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        throw Error(dat.ErrorMessage);
      } else {
        res.status(200).send("Task aktiv edildi!");
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/tasks/id error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/status/:id", auth, (req, res) => {
  serviceModule
    .putServiceStatus(req.params.id)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/id error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/:id", auth, (req, res) => {
  serviceModule
    .putService(req.params.id, req.body)
    .then((response) => {
      const dat = (response && response[0]) || [];
      if (dat?.ErrorNumber) {
        res.status(200).send({ error: true, response: dat });
      } else {
        res.status(200).send({ error: false, response });
      }
    })
    .catch((error) => {
      logger.error(`PUT /services/id error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
