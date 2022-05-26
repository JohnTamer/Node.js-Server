require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
// const multer = require("multer");
const path = require("path");

const authenticationRouter = require("./Routers/authenticationRouter.js");
const speakerRouter = require("./Routers/speakersRouter.js");
const eventRouter = require("./Routers/eventRouter.js");
const studentRouter = require("./Routers/studentRouter.js");

//image variable;
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(path.join(__dirname, "images"));
//     cb(null, path.join(__dirname, "images"));
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toLocaleDateString().replace(/\//g, "-") +
//         "-" +
//         file.originalname
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype == "image/jpeg" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/png"
//   )
//     cb(null, true);
//   else cb(null, false);
// };

//create server;
const app = express();
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB is connected ....");

    // listen on port Number
    app.listen(process.env.PORT_Number, () => {
      console.log("nice job ....");
    });
  })
  .catch((error) => {
    console.log(" DB encountered a Problem");
  });

//start of MD
//first middleware;
app.use(morgan(":method :url"));

//second middleware of CORS;
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PUT,OPTIONS"
  );
  response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
  // console.log("did i passed it ?")
});

// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(multer({ storage, fileFilter }).single("image"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

//end of MD;

//Routers;

app.use(authenticationRouter);
app.use(speakerRouter);
app.use(eventRouter);
app.use(studentRouter);

//not found middlewre;
app.use((request, response) => {
  response.status(404).json({ data: "Not Found" });
});

//error middleware;
app.use((error, request, response, next) => {
  let status = error.status || 500;
  response.status(status).json({ Error: error + "" });
});
