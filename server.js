const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.io logic for timer synchronization
let timer = 0;
let running = false;

io.on("connection", (socket) => {
  socket.emit("updateTimer", { timer, running });

  socket.on("startTimer", () => {
    if (!running) {
      running = true;
      const interval = setInterval(() => {
        if (running) {
          timer++;
          io.emit("updateTimer", { timer, running });
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
  });

  socket.on("stopTimer", () => {
    running = false;
    io.emit("updateTimer", { timer, running });
  });

  socket.on("resetTimer", () => {
    timer = 0;
    running = false;
    io.emit("updateTimer", { timer, running });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
