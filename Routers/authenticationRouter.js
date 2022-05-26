const express = require("express");
const { body, query, param } = require("express-validator");
const authenticationRouter = express.Router();
const controller = require("./../Controllers/authenticationController.js");
isAuth = require("./../middleware/authMW");
//post;
authenticationRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("email cannot be empty"),
    body("password").notEmpty().withMessage("password cannot be empty"),
  ],
  controller.login
);

//register;
authenticationRouter.post(
  "/register",
  [
    body("isSpeaker").isBoolean().withMessage("Have to be boolean"),
    body("fullname").notEmpty().withMessage("fullname cannot be empty"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be atleast 8 characters")
      .isAlpha()
      .withMessage("password must be alphabetical"),
    body("email").isEmail().withMessage("your email must be correct"),
    body("address")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .isObject()
      .withMessage("Address should be filled all"),
    body("address.city")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .notEmpty()
      .withMessage("city field is empty")
      .isAlpha()
      .withMessage("city must be a string"),
    body("address.street")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .notEmpty()
      .withMessage("street field is empty")
      .isAlpha()
      .withMessage("street number must be a string"),
    body("address.building")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .notEmpty()
      .withMessage("building field is empty")
      .isInt()
      .withMessage("Building must be integer number"),
    body("image")
      .if(body("isSpeaker").equals("true"))
      .bail()
      .isString()
      .withMessage("image should be string"),
    body("role")
      .custom((value) => {
        let roleArray = ["student", "speaker"];
        if (roleArray.includes(value)) {
          return true;
        } else false;
      })
      .withMessage("you should be an"),
  ],
  controller.register
);

authenticationRouter.post(
  "/changepassword",
  isAuth,

  controller.changePassword
);

module.exports = authenticationRouter;
