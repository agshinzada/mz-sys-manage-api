const express = require("express");
const router = express.Router();
const userModule = require("../../modules/sys/user_module");
const auth = require("../../middleware/auth");
const logger = require("../../logger");
var jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  userModule
    .loginUser(req.body)
    .then((response) => {
      if (response.length > 0) {
        const { 0: user } = response;
        const token = jwt.sign(
          { id: user.ID, username: user.USERNAME },
          process.env.SECRET_KEY,
          {
            expiresIn: "24hr",
          }
        );
        user.TOKEN = token;
        res.status(200).send(user);
      } else {
        res.status(401).send("İstifadəçi adı və ya şifrə yanlışdır!");
      }
    })
    .catch((error) => {
      logger.error(`GET /auth/login error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.get("/users", auth, (req, res) => {
  userModule
    .getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /auth/users/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.post("/register", auth, (req, res) => {
  userModule
    .registerUser(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      logger.error(`GET /auth/users/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

router.put("/users/password/:id", auth, (req, res) => {
  userModule
    .putUserPassword(req.params.id, req.body)
    .then((response) => {
      res.status(200).send("Düzəliş edildi!");
    })
    .catch((error) => {
      logger.error(`PUT /auth/users/password error : ${error.message}`);
      res.status(500).send(error.message);
    });
});
router.put("/users/:id", auth, (req, res) => {
  userModule
    .putUser(req.params.id, req.body)
    .then((response) => {
      res.status(200).send("Düzəliş edildi!");
    })
    .catch((error) => {
      logger.error(`PUT /auth/users/ error : ${error.message}`);
      res.status(500).send(error.message);
    });
});

module.exports = router;
