const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const USERS = [
  {
    id: "u1",
    name: "Tom Jade",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users failed, please try again.", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { email, password, name} = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }
  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://www.verywellmind.com/thmb/fcB45Y2_4efpRrcrkxliTqk6EmU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-4660327211-56b5fae93df78c0b13571d1e.jpg",
    places: []
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }
  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
