const socket = io();

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const resetButton = document.getElementById('resetBtn');

// Handle timer updates from server
socket.on('timerUpdate', (time) => {
  timerDisplay.textContent = time;
});

// Handle timer end
socket.on('timerEnd', () => {
  timerDisplay.textContent = '00:00:00';
  alert('Timer has ended');
});

// Start timer button click
startButton.addEventListener('click', () => {
  socket.emit('startTimer');
});

// Stop timer button click
stopButton.addEventListener('click', () => {
  socket.emit('stopTimer');
});

// Reset timer button click
resetButton.addEventListener('click', () => {
  socket.emit('resetTimer');
});
