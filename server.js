const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let timerInterval;
let timeRemaining = 86400; // 24 hours in seconds
let isRunning = false;

// Start the timer
const startTimer = () => {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        io.emit('timerUpdate', formatTime(timeRemaining));
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        io.emit('timerEnd', '00:00:00');
      }
    }, 1000);
  }
};

// Stop the timer
const stopTimer = () => {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  }
};

// Reset the timer
const resetTimer = () => {
  clearInterval(timerInterval);
  timeRemaining = 86400; // Reset to 24 hours
  isRunning = false;
  io.emit('timerUpdate', formatTime(timeRemaining));
};

// Format seconds to HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Socket event listeners
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('timerUpdate', formatTime(timeRemaining));

  socket.on('startTimer', () => startTimer());
  socket.on('stopTimer', () => stopTimer());
  socket.on('resetTimer', () => resetTimer());
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
