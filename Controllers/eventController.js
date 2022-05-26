const { validationResult } = require("express-validator");
const Event = require("./../Models/eventModule");
//update function
exports.updateEvent = (request, response, next) => {
  if (request.role == "adminstrator") {
    Event.updateOne(
      { _id: request.body.id },
      {
        $set: {
          title: request.body.title,
          date: request.body.date,
          mainSpeaker: request.body.mainSpeaker,
          speakers: request.body.speakers,
          students: request.body.students,
        },
      }
    )
      .then((data) => {
        if (data == null) throw new Error("Event Is not Found!");
        response.status(200).json({ message: "updated", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error("you are not authorized to update this events ");
  }
};
//create function
exports.createEvent = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  if (request.role == "adminstrator") {
    let object = new Event({
      _id: request.body.id,
      title: request.body.title,
      date: request.body.date,
      mainSpeaker: request.body.mainSpeaker,
      speakers: request.body.speakers,
      students: request.body.students,
    });
    object
      .save()
      .then((data) => {
        response.status(200).json({ message: "added", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error("you are not authorized to add an event ");
  }
};
//delete function
exports.deleteEvent = (request, response) => {
  if (request.role == "adminstrator") {
    Event.deleteOne({ title: request.body.title })
      .then((data) => {
        if (data == null) throw new Error("event Is not Found!");
        response.status(200).json({ message: "deleted", data });
      })
      .catch((error) => next(error));
  } else {
    throw new Error(
      "you are not authorized to delete event because you are not adminstrator"
    );
  }
};
//get function
exports.getEvents = (request, response, next) => {
  if (
    request.role == "speaker" ||
    request.role == "student" ||
    request.role == "adminstrator"
  ) {
    console.log(request.role);
    if (request.body.email) {
      Event.findOne({ title: request.body.title })
        .then((data) => {
          response.status(200).json({ message: "Found", data: data });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      Event.find({})
        .populate(["mainSpeaker", "speakers", "students"])
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((error) => {
          next(error);
        });
    }
  } else {
    throw new Error("you are not authorized to get this events ");
  }
};
