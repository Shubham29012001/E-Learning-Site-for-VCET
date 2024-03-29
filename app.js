require("dotenv").config();

const path = require("path");
const http = require("http");
const cluster = require('cluster');
const osLength = require('os').cpus().length;

const mongoose = require("mongoose");
const redis = require("redis");
const compression = require("compression");

const express = require("express");
const bodyParser = require("body-parser");

const socketio = require("socket.io");

const api_key = require("./config/config");

const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teacher");
const homeRoutes = require("./routes/homepage");
const courseRoutes = require("./routes/coursepage");
const MONGODB_URI = api_key.mongo;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Clustering Server with Max Instances
if (cluster.isMaster) {
  for (let i = 0; i < osLength; i++) {
    cluster.fork();
  }

  // Check if Any Cluster Died, Fork Cluster Again
  cluster.on('exit', (message, code, signal) => {
    cluster.fork();
  })
}
else {
  const client = redis.createClient({
    host: api_key.redisHost,
    port: api_key.redisPort,
    password: api_key.redisPassword,
  });

  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/images", express.static(path.join(__dirname, "images")));
  app.use("/Files", express.static(path.join(__dirname, "Files")));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS,GET,POST,PUT,PATCH,DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  app.use(authRoutes);
  app.use(teacherRoutes);
  app.use(homeRoutes);
  app.use(courseRoutes);

  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });

  app.use(
    compression(
      (level = 6),
      (filter = (req, res) => {
        if (req.headers["no-x-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      })
    )
  );

  io.on('connect', (socket) => {

    socket.on('join', ({ UserName, room, userId }, callback) => {
      let newUser = false;
      let users = [{ id: [], names: [] }];

      if (client.EXISTS(room)) {
        client.lrange(room, 0, -1, function (err, result) {
          if (err) {
            callback(err);
          }
          else {
            const History = [];

            result.forEach(user => {
              user = JSON.parse(user)
              History.push(user)

              if (!users[0].id.includes(user.userId)) {
                users[0].id.push(user.userId);
                users[0].names.push(user.UserName);
              }

            })
            console.log(users)

            if (!users[0].id.includes(userId)) {
              newUser = true;
              console.log("userUser")
              users[0].id.push(userId);
              users[0].names.push(UserName);

            }

            socket.emit('history', { History: History, users: users[0].names });
            socket.join(room)
            io.to(room).emit('admin',
              {
                users: users[0].names,
                UserName: 'admin',
                newUser: newUser,
                Message: newUser ? `Welcome to the class ${UserName}!` : `Welcome back to the class ${UserName}!`
              });

            socket.broadcast.to(room).emit('admin', { users: users, UserName: `${UserName}`, users: users[0].names, newUser: newUser, Message: `${UserName} has joined!` });
            newUser = false;
          }
        });
      }
      else {
        client.hset(room, null, function (err, result) {
          if (err)
            callback(err);
          else {
            console.log("setting redis hset::", result)
          }
        });
      }

      callback()
    })

    socket.on('sendMessage', ({ UserName, userId, room, message }, callback) => {

      const user = { "UserName": UserName, "Message": message, "userId": userId }

      if (client.EXISTS(room)) {
        client.rpush(room, JSON.stringify(user), function (err, result) {
          if (err)
            callback(err)
          else {
            console.log("rpush::", result)
          }
        });

      } else {
        client.hset(room, JSON.stringify(user), function (err, result) {
          if (err)
            callback(err)
          else {
            console.log("hset::", result)
          }
        });
      }
      client.lrange(room, 0, -1, function (err, result) {
        console.log("redis result=", result)
        if (err) {
          console.log(err)
        }
      })
      console.log(`${room} message sent by ${UserName} is::`, message);
      io.to(room).emit('Received_message', { UserName: UserName, Message: message });
      callback()
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })
  })

  mongoose
    .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((result) => {
      server.listen(process.env.PORT || 8080);
      console.log("Server Started!");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = app;
