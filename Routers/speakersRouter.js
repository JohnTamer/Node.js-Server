const express = require("express");
const { body, query, param } = require("express-validator");
const speakerRouter = express.Router();
const controller = require("../Controllers/speakerController.js");
isAuth = require("./../middleWare/authMW.js");
speakerRouter
  .route("/speakers/:id?")
  .get(isAuth, controller.getSpeakers)
  .post(controller.createSpeaker)
  .put(isAuth, controller.updateSpeaker)
  .delete(isAuth, controller.deleteSpeaker);

module.exports = speakerRouter;
