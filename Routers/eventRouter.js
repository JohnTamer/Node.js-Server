const express = require("express");
const { body, query, param } = require("express-validator");
const eventRouter = express.Router();
const controller = require("../Controllers/eventController.js");
isAuth = require("./../middleWare/authMW.js");
eventRouter
  .route("/events/:id?")
  .get(isAuth, controller.getEvents)
  .post(
    isAuth,
    [
      body("title").isString().withMessage("Title should be string"),
      body("eventDate").isEmpty().withMessage("Event Date should not be empty"),
      body("mainSpeaker").isInt().withMessage("main speaker should be number"),
      body("speakers")
        .isArray()
        .withMessage("speakers should be an array")
        .notEmpty()
        .withMessage("array should not be empty"),
      body("students")
        .isArray()
        .withMessage("students should be an array")
        .notEmpty()
        .withMessage("array should not be empty"),
    ],
    controller.createEvent
  )
  .put(isAuth, controller.updateEvent)
  .delete(isAuth, controller.deleteEvent);

module.exports = eventRouter;
