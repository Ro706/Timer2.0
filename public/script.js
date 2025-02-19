const socket = io("http://localhost:5000"); // Change URL if hosted online
let countdownElement = document.getElementById('countdown');
let startButton = document.getElementById('startButton');

startButton.addEventListener("click", () => {
    socket.emit("start");
    startButton.disabled = true;
});

socket.on("countdown", (time) => {
    countdownElement.textContent = time;
});

socket.on("timer", ({ hours, minutes, secs }) => {
    countdownElement.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});
