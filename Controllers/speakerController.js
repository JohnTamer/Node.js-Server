const { validationResult } = require("express-validator");
const Speaker = require("./../Models/speakerModule.js");
const passwordBcrypt = require("bcrypt");
const salt = 15;

//update then use schema
exports.updateSpeaker = (request, response, next) => {
  let hash;
  //email is unique so i will use it to find and update
  if (request.role == "speaker" && request.body.username == request.username) {
    if (request.body.password) {
      hash = passwordBcrypt.hashSync(request.body.password, salt);
    }
    Speaker.updateOne(
      { email: request.body.email },
      {
        $set: {
          password: hash,
          fullName: request.body.fullName,
          role: request.body.role,
          image: request.body.image,
          address: request.body.address,
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

//create and use schema
exports.createSpeaker = (request, response, next) => {
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

  //response.json({ file: request.file });

  let object = new Speaker({
    email: request.body.email,
    password: hash,
    fullName: request.body.fullName,
    role: request.body.role,
    // image: request.file.filename,
    image: request.body.image,
    address: request.body.address,
    // file: request.body.file,
  });
  object
    .save()
    .then((data) => {
      response.status(200).json({ message: "added", data });
    })
    .catch((error) => next(error));
};

//delete and use schema
exports.deleteSpeaker = (request, response) => {
  if (request.role == "adminstrator") {
    Speaker.deleteOne({ email: request.body.email })
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

//get and use schema
exports.getSpeakers = (request, response, next) => {
  if (request.role == "adminstrator") {
    console.log(request.role);
    if (request.body.email) {
      Speaker.findOne({ email: request.body.email })
        .then((data) => {
          response.status(200).json({ message: "Found", data: data });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      Speaker.find({})
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
