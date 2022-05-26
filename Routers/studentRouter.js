const express = require("express");
const { body, query, param } = require("express-validator");
const studentRouter = express.Router();
const controller = require("../Controllers/studentController.js");
isAuth = require("./../middleWare/authMW.js");
studentRouter
  .route("/students/:id?")
  .get(isAuth, controller.getStudents)
  .post(controller.createStudent)
  .put(isAuth, controller.updateStudent)
  .delete(isAuth, controller.deleteStudent);

module.exports = studentRouter;
