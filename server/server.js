const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io'); // Import Socket.IO
const http = require('http'); // Required for integrating socket with Express

// Initialize environment variables
dotenv.config();

// Initialize Express app and create an HTTP server
const app = express();
const server = http.createServer(app); // Use HTTP server with Express
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }, // Allow frontend to connect
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for 'chat message' events from the client
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
