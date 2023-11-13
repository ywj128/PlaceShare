const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;

const USERS = [
  {
    id: "u1",
    name: "Tom Jade",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const signup = (req, res, next) => {
  const { email, password, name } = req.body;

  const hasUser = USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const newUser = {
    name,
    email,
    password,
    id: uuid(),
  };
  USERS.push(newUser);
  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
