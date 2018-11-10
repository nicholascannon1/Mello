/**
 * index.js
 * 
 * Server entry point.
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const port = 8000;

/**
 * Middleware setup
 */
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Mount API routes 
 */

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