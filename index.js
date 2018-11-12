/**
 * index.js
 * 
 * Server entry point.
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');

/**
 * Project imports
 */
const auth = require('./config/auth');
const db = require('./config/db');

const app = express();
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

app.listen(port, () => console.log(`Listening on port ${port}`));