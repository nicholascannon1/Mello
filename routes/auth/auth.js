/**
 * Contains authentication routes for /auth/google
 */
const router = require('express').Router();
const passport = require('passport');

/**
 * Login URL: /auth/google/
 * 
 * Sends the user to googles login auth service. This redirect 
 * prompts the user to allow access.
 */
router.get('/', passport.authenticate('google',{ 
  scope: ['email', 'profile'], session: false
}));

/**
 * Callback URL: /auth/google/callback
 * Save this callback URL as a constant in /config/globals.js as
 * it must match the callback URL option in the passport config.
 * 
 * Google sends the user back to this URL with an auth code.
 * If authentication succeeds, primary route function will be 
 * called. In this case we generate a JWT for the user logging in.
 */
router.get('/callback', 
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    res.status(200).json({ token: req.user.getToken() });
  }
);

module.exports = router;