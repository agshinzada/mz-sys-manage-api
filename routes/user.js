const express = require("express");
const router = express.Router();
const userModule = require("../modules/user_module");
const auth = require("../middleware/auth");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    users
      .loginUser(req.body)
      .then((response) => {
        if (response.length > 0) {
          const { 0: user } = response;
          const token = jwt.sign(
            { id: user.ID, username: user.USERNAME },
            process.env.SECRET_KEY,
            {
              expiresIn: "1hr",
            }
          );
          user.TOKEN = token;
          res.status(200).send(user);
        } else {
          res.status(401).send("İstifadəçi adı və ya şifrə yanlışdır!");
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
  } else {
  }
});

module.exports = router;
