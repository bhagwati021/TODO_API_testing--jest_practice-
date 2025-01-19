const Todo = require("../models/todoModel")
const logger  = require("../utils/logger")

//get all todos
exports.getTodos = async(req,res)=>{
    logger.info("Fetching the todos from DB");
    try {
        const { title, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc" } = req.query;

        const filter = title ? { title: { $regex: title, $options: "i" } } : {}; // Case-insensitive title search
        const options = {
            sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
            skip: (page - 1) * limit,
            limit: parseInt(limit)
        };

        const todos = await Todo.find(filter, null, options);
        const total = await Todo.countDocuments(filter);

        logger.info(`Fetched ${todos.length} todos from DB`);
        res.status(200).json({ todos, total, page, limit });
    } catch (error) {
        logger.error("Error while fetching the todos", error);
        res.status(500).json({ message: "Something went wrong, please try later" });
    }
};

// Add a new todo
exports.addTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            logger.warn("Title is missing in the request body");
            return res.status(400).json({ message: "Title is required" });
        }

        logger.info(`Adding a new todo with title: ${title}`);
        const newTodo = new Todo({ title });
        const savedTodo = await newTodo.save();

        logger.info("Added the todo to DB", savedTodo);
        res.status(201).json(savedTodo);
    } catch (error) {
        logger.error("Error while adding the todo", error);
        res.status(500).json({ message: "Something went wrong, please try later" });
    }
}

// Update an existing todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        logger.info(`Updating todo with ID: ${id}`);
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            logger.warn(`Todo with ID ${id} not found`);
            return res.status(404).json({ message: "Todo not found" });
        }

        logger.info("Updated the todo in DB", updatedTodo);
        res.status(200).json(updatedTodo);
    } catch (error) {
        logger.error("Error while updating the todo", error);
        res.status(500).json({ message: "Something went wrong, please try later" });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info(`Deleting todo with ID: ${id}`);
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            logger.warn(`Todo with ID ${id} not found`);
            return res.status(404).json({ message: "Todo not found" });
        }

        logger.info("Deleted the todo from DB", deletedTodo);
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        logger.error("Error while deleting the todo", error);
        res.status(500).json({ message: "Something went wrong, please try later" });
    }
};

// Mark a todo as completed
exports.completeTodo = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info(`Marking todo with ID ${id} as completed`);
        const completedTodo = await Todo.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true }
        );

        if (!completedTodo) {
            logger.warn(`Todo with ID ${id} not found`);
            return res.status(404).json({ message: "Todo not found" });
        }

        logger.info("Marked the todo as completed", completedTodo);
        res.status(200).json(completedTodo);
    } catch (error) {
        logger.error("Error while marking the todo as completed", error);
        res.status(500).json({ message: "Something went wrong, please try later" });
    }
};