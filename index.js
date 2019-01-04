/**
 * index.js
 * 
 * Server entry point.
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const socketio = require('socket.io');
const http = require('http');
const session = require('express-session');

/**
 * Project imports
 */
const auth = require('./config/auth');
const db = require('./config/db');
const secret = require('./config/globals').secret;

const app = express();
const server = http.createServer(app);
const port = 8000;

/** 
 * Database set up
 */
db.connect();

/**
 * Authentication set up
 */
auth(passport);

/**
 * Middleware setup
 */
app.use(morgan('dev'));
app.use(helmet());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: secret,
  resave: true, 
  saveUninitialized: true
}));

/**
 * Socket.io set up
 */
const io = socketio(server);
app.set('io', io);

/**
 * Enable CORS
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Mount API routes 
 */
app.use('/auth/google', require('./routes/auth/auth'));
app.use('/api/list', require('./routes/api/lists'));
app.use('/api/task', require('./routes/api/tasks'));

/** 
 * Error Handlers
 */
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ message: err.message, err: err });
  });
} else {
  // No stack traces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ message: err.message });
  });
}

server.listen(port, () => console.log(`Listening on port ${port}`));