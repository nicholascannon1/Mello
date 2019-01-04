/**
 * Contains authentication routes for /auth/google
 */
const router = require('express').Router();
const passport = require('passport');
const ClientURL = require('../../config/globals').ClientURL;

/**
 * Middleware to attach socket id to session. Socket id must be
 * in query string. Must attach to session so that the callback route
 * can access the same id.
 */
function addSocketId(req, res, next) {
  req.session.socketId = req.query.socketId;
  next();
}

/**
 * Login URL. /auth/google/
 * 
 * Sends the user to googles login auth service. This redirect 
 * prompts the user to allow access.
 */
router.get('/', addSocketId, passport.authenticate('google',{ 
  scope: ['email', 'profile'], session: false
}));

/**
 * Callback URL: /auth/google/callback
 * Save this callback URL as a constant in /config/globals.js as
 * it must match the callback URL option in the passport config.
 * 
 * Google sends the user back to this URL with an auth code.
 * If authentication succeeds, primary route function will be 
 * called. In this case we search the DB for the user matching the 
 * google id given to us by google and generate a JWT for that user.
 */
router.get('/callback', 
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    const io = req.app.get('io');
    io.in(req.session.socketId).emit('melloToken', req.user.getToken());
  }
);

module.exports = router;