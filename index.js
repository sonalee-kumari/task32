const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // JSON body parse karne ke liye

// In-Memory Data Store (Testing ke liye)
let todos = [
  { id: 1, title: 'Learn Express.js', isCompleted: false },
  { id: 2, title: 'Build a To-Do App', isCompleted: true }
];

// 1. GET ALL TODOS
app.get('/api/todos', (req, res) => {
  res.status(200).json({
    success: true,
    data: todos
  });
});

// 2. GET SINGLE TODO BY ID
app.get('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === todoId);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  res.status(200).json({
    success: true,
    data: todo
  });
});

// 3. CREATE A NEW TODO
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  const newTodo = {
    id: Date.now(), // Unique ID generate karne ke liye
    title: title.trim(),
    isCompleted: false
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    message: 'Todo created successfully',
    data: newTodo
  });
});

// 4. UPDATE A TODO (Edit Title ya Mark as Completed)
app.put('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const { title, isCompleted } = req.body;

  const todoIndex = todos.findIndex((t) => t.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  // Value update karna agar provide ki gayi ho
  if (title !== undefined) todos[todoIndex].title = title;
  if (isCompleted !== undefined) todos[todoIndex].isCompleted = isCompleted;

  res.status(200).json({
    success: true,
    message: 'Todo updated successfully',
    data: todos[todoIndex]
  });
});

// 5. DELETE A TODO
app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoExists = todos.some((t) => t.id === todoId);

  if (!todoExists) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  todos = todos.filter((t) => t.id !== todoId);

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
});

// Server start karna
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});