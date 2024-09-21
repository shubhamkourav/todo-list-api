const route = require("express").Router();

// auth routes
const { register, login, refreshToken, logout } = require("../controllers/auth");

route.post("/register", register);
route.post("/login", login);
route.post("/refresh-token", refreshToken);
route.post("/logout", logout);

module.exports = route;