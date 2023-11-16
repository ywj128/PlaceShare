const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this router.", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occured!" });
});

mongoose
  .connect("mongodb+srv://wanjing:zAUCrzuTkNDbHH82@atlascluster.h407xs5.mongodb.net/places?retryWrites=true&w=majority")
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
