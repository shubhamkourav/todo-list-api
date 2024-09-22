const { getAllTodo, createTodo, readTodo, updateTodo, deleteTodo } = require('../controllers/todo');

const route = require('express').Router();


// routes
route.get("/", getAllTodo);
route.post("/",  createTodo);
route.get("/:id",  readTodo);
route.put("/:id",  updateTodo);
route.delete("/:id",  deleteTodo);

module.exports = route;
