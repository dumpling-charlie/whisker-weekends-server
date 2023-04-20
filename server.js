const app = require("./app");


// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

const cors = require('cors');
const http = require('http').Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "https://whisker-weekends.netlify.app",
  },
});

app.use(cors());
let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

handlePreflightRequest: (req, res) => {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "my-custom-header",
    "Access-Control-Allow-Credentials": true
  });
  res.end();
}

http.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});