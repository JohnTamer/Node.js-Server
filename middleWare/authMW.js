const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  let token, decode;
  try {
    token = request.get("Authorization").split(" ")[1];
    decode = jwt.verify(token, "ITImearn");
  } catch (error) {
    error.message = "Not Authorized";
    error.status = 403;
    next(error);
  }
  console.log("token", token);
  if (decode !== undefined) {
    request.role = decode.role;
    request.email = decode.email;

    next();
  }
};
