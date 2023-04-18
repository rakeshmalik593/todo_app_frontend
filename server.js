const express = require("express");

var path = require("path");
const port = process.env.PORT || 8081;
const app = express();

//Set the base path to the angular-tutorial dist folder

app.use(express.static(path.join(__dirname, "./build")));

//Any routes will be redirected to the angular app

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

//Starting server on port 8081

app.listen(port, () => {
  console.log("Server started!");

  console.log(port);
});
