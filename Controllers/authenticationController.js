const express = require("express");
const { validationResult } = require("express-validator");
const speakerModel = require("./../Models/speakerModule.js");
const studentModel = require("./../Models/studentModule.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 15;
require("dotenv").config();

function handleError(request, errors, error) {
  if (!errors.isEmpty()) {
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
}
exports.login = (request, response, next) => {
  console.log(request.body);
  let errors = validationResult(request);
  let error = new Error();
  handleError(request, errors, error);
  if (request.body.email == "admin" && request.body.password == "admin") {
    let token = jwt.sign(
      {
        email: request.body.email,
        role: "adminstrator",
      },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );
    response.status(201).json({
      message: "you logged in as an adminstrator",
      token,
    });
  } else {
    speakerModel
      .findOne({ email: request.body.email })
      .then((data) => {
        if (data == null) {
          studentModel
            .findOne({ email: request.body.email })
            .then((data) => {
              if (data == null) {
                throw new Error("you dont exist in system");
              } else {
                if (bcrypt.compareSync(request.body.password, data.password)) {
                  let token = jwt.sign(
                    {
                      email: request.body.email,
                      role: "student",
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: "2h" }
                  );
                  response.status(201).json({
                    message: "you logged in as a student",
                    data: data,
                    token,
                  });
                } else {
                  throw new Error("type your password again");
                }
              }
            })
            .catch((error) => {
              next(error);
            });
        } else {
          if (bcrypt.compareSync(request.body.password, data.password)) {
            let token = jwt.sign(
              {
                email: request.body.email,
                role: "speaker",
              },
              process.env.SECRET_KEY,
              { expiresIn: "2h" }
            );
            response.status(200).json({
              message: "you logged in succesfully as a speaker",
              data: data,
              token,
            });
          } else {
            throw new Error("type your password again");
          }
        }
      })
      .catch((error) => {
        next(error);
      });
  }
};

exports.register = (request, response, next) => {
  let errors = validationResult(request);
  let error = new Error();
  handleError(request, errors, error);
  if (request.body.isSpeaker) response.redirect(307, "speakers");
  else {
    response.redirect(307, "students");
  }
};

exports.changePassword = (request, response, next) => {
  console.log(request.role);
  console.log(request.email, request.body.email);

  if (request.role == "speaker" && request.email == request.body.email) {
    console.log("hi speaker");
    speakerModel
      .updateOne(
        { email: request.body.email },
        {
          $set: {
            password: bcrypt.hashSync(request.body.newpassword, salt),
          },
        }
      )
      .then((data) => {
        if (data == null || data.matchedCount == 0)
          throw new Error("email or password is incorect");
        response.status(200).json({ message: "password changed", data });
      })
      .catch((error) => next(error));
  } else if (request.role == "student" && request.email == request.body.email) {
    console.log("hi student");
    studentModel
      .updateOne(
        { email: request.body.email },
        {
          $set: {
            password: bcrypt.hashSync(request.body.newpassword, salt),
          },
        }
      )
      .then((data) => {
        if (data == null || data.matchedCount == 0)
          throw new Error("email or password is incorect");
        response.status(200).json({ message: "password changed", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error("Not Authorized.");
  }
};
