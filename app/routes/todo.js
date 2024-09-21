const { getAllTodo, createTodo, readTodo, updateTodo, deleteTodo } = require('../controllers/todo');

const route = require('express').Router();


// routes
route.get("/", getAllTodo);
route.post("/",  createTodo);
route.get("/:id",  readTodo);
route.post("/:id",  updateTodo);
route.post("/",  deleteTodo);

module.exports = route;
