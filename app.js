const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Load the JSON data from the file
const loadUsers = () => {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

// Save data to the JSON file
const saveUsers = (data) => {
  fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
};

// 1. Get the list of all users
app.get('/api/users', (req, res) => {
  const data = loadUsers();
  res.json(data.employees);
});

// 2. Get a single user by ID
app.get('/api/users/:id', (req, res) => {
  const data = loadUsers();
  const user = data.employees.find((emp) => emp.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 3. Add a new user
app.post('/api/users', (req, res) => {
    console.log(req.body); // Log the incoming request body
  
    const data = loadUsers();
    const { name, position, location } = req.body;
  
    if (!name || !position || !location) {
      return res.status(400).json({ message: "Missing required fields: name, position, and location." });
    }
  
    const newUser = {
      id: data.employees.length + 1,
      name,
      position,
      location
    };
  
    data.employees.push(newUser);
    saveUsers(data);
  
    res.status(201).json(newUser);
  });
  
  

// 4. Update a user by ID (PUT method)
app.put('/api/users/:id', (req, res) => {
  const data = loadUsers();
  const userIndex = data.employees.findIndex((emp) => emp.id === parseInt(req.params.id));
  
  if (userIndex !== -1) {
    const updatedUser = { 
      ...data.employees[userIndex], 
      ...req.body 
    };
    data.employees[userIndex] = updatedUser;
    saveUsers(data);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 5. Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  const data = loadUsers();
  const userIndex = data.employees.findIndex((emp) => emp.id === parseInt(req.params.id));
  
  if (userIndex !== -1) {
    data.employees.splice(userIndex, 1); // Remove the user from the array
    saveUsers(data);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
