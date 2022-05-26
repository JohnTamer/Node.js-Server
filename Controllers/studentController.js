const { validationResult } = require("express-validator");
const Student = require("./../Models/studentModule.js");
const passwordBcrypt = require("bcrypt");
const salt = 15;
// update student
exports.updateStudent = (request, response, next) => {
  let hash;
  //email is unique so i will use it to find and update
  if (request.role == "student" && request.body.username == request.username) {
    if (request.body.password) {
      hash = passwordBcrypt.hashSync(request.body.password, salt);
    }
    Student.updateOne(
      { email: request.body.email },
      {
        $set: {
          password: hash,
          fullName: request.body.fullName,
        },
      }
    )
      .then((data) => {
        if (data == null) throw new Error("cant found student");
        response.status(200).json({ message: "updated", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error("you are not authorized to update this info ");
  }
};
// create student
exports.createStudent = (request, response, next) => {
  let hash = passwordBcrypt.hashSync(request.body.password, salt);
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  let object = new Student({
    _id: request.body.id,
    email: request.body.email,
    password: hash,
    fullName: request.body.fullName,
  });
  object
    .save()
    .then((data) => {
      response.status(200).json({ message: "added", data });
    })
    .catch((error) => next(error));
};

// delete student
exports.deleteStudent = (request, response) => {
  if (request.role == "adminstrator") {
    Student.deleteOne({ email: request.body.email })
      .then((data) => {
        if (data == null) throw new Error("Student Is not Found!");
        response.status(200).json({ message: "deleted", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error(
      "you are not authorized to delete because you are not adminstrator"
    );
  }
};

// get students
exports.getStudents = (request, response, next) => {
  if (request.role == "adminstrator") {
    console.log(request.role);
    if (request.body.email) {
      Student.findOne({ email: request.body.email })
        .then((data) => {
          response.status(200).json({ message: "Found", data: data });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      Student.find({})
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((error) => {
          next(error);
        });
    }
  } else {
    throw new Error("you are not authorized to get this info ");
  }
};
