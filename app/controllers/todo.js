const mongoose = require("mongoose");

const Todo = mongoose.model('Todo')

exports.createTodo = async (req, res) => {
    try {
        const todo = new Todo({ ...req.body, user: req.user._id });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create todo' });
    }
}

exports.readTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).populate('user', 'name');
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve todo' });
    }
}

exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name');
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update todo' });
    }
}

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete todo' });
    }
}
// get all todos for a user and pagination sorting searching
exports.getAllTodo = async (req, res) => {
    try {
        const user = req.query.user; // Get user from query parameters
        const { page = 1, limit = 10, sort = 'createdAt', order = 'asc', search = '' } = req.query;

        // Convert pagination and sorting parameters
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const sortOrder = order === 'desc' ? -1 : 1;

        // Build search criteria
        const searchCriteria = search ? { title: { $regex: search, $options: 'i' } } : {}
        if (user) searchCriteria.user = user;

        // Fetch todos with pagination, sorting, and searching
        const todos = await Todo.find(searchCriteria)
            .sort({ [sort]: sortOrder })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total todos for pagination
        const totalTodos = await Todo.countDocuments(searchCriteria);

        // Send response with todos and pagination info
        res.json({
            total: totalTodos,
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(totalTodos / limitNumber),
            data: todos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve todos' });
    }
}
