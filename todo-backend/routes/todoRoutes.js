const express = require("express")
const {getTodos, addTodo, updateTodo,
    deleteTodo,
    completeTodo,filterTodo} = require("../contollers/todoController")

const router = express.Router()

router.get("/todos", getTodos)

router.post("/filter",filterTodo)

router.post("/todos",addTodo)

router.put("/todos/:id", updateTodo);

router.delete("/todos/:id", deleteTodo);

router.patch("/todos/:id/complete", completeTodo);

// Todo: Implement the logic for handling deletion of todos
// router.delete("/:id",)

module.exports = router;
