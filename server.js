// dependencies
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// initializing app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on("connection", (socket) => {
  // get name from the user
  io.to(socket.id).emit("getName");
  socket.on("setName", (userName, cb) => {
    socket.name = userName;
    cb();
  });
  // user connected console message
  console.log("a user connected");
  // user disconnected console message
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  // receiving message from the user
  socket.on("chat message", (msg, callBack) => {
    // console.log('message: ' + msg);

    // sending message to all other user accept who send the message
    socket.broadcast.emit("received sms: ", msg, socket.name);
    callBack();
  });
});

// listening the server at 3000 port
server.listen(3000, () => {
  console.log("server listening on :3000");
});
