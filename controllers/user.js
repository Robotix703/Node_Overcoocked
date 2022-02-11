require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res) => {
  console.log(req.body.invitationCode)
  console.log(process.env.INVITECODE)
  if (req.body.invitationCode !== process.env.INVITECODE) {
    res.status(500).json({
      message: "Wrong invitation code"
    });
    return;
  }

  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      phoneNumber: req.body.phoneNumber
    });

    user.save()
      .then(result => {
        res.status(201).json({
          result
        });
      })
      .catch(error => {
        res.status(500).json({
          errorMessage: error
        });
      });
  });
};

exports.userLogin = (req, res) => {
  let fetchUser;

  User.findOne({ email: req.body.email })
    .then(user => {
      fetchUser = user;

      if (!user) {
        return res.status(401).json({
          message: "Mauvaise Email"
        });
      }
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Mauvaise Mot de passe"
        });
      }

      const token = jwt.sign(
        {
          email: fetchUser.email,
          userId: fetchUser._id
        },
        process.env.JWT,
        { expiresIn: "12h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: parseInt(process.env.TOKENLIFETIME) * 60 * 60,
        userId: fetchUser._id
      });
    })
    .catch(error => {
      return res.status(401).json({
        errorMessage: error
      });
    });
};
