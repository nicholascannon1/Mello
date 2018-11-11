/**
 * Contains authentication routes for /auth/google
 */
const router = require('express').Router();
const passport = require('passport');
const User = require('../../models/User');

/**
 * Login URL. /auth/google/
 * 
 * Sends the user to googles login auth service. This redirect 
 * prompts the user to allow access.
 */
router.get('/', passport.authenticate('google',{ 
  scope: ['email', 'profile'], session: false
}));

/**
 * Callback URL. /auth/google/callback
 * 
 * Google sends the user back to this URL with an auth code.
 * If authentication succeeds, primary route function will be 
 * called. In this case we search the DB for the user matching the 
 * google id given to us by google and generate a JWT for that user.
 */
router.get('/callback', 
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    User.findOne({ googleId: req.user.googleId }, (err, user) => {
      if (err || !user) return next(new Error(err || 'User not found'));
      return res.status(200).json({ token: user.getToken() });
    });
  }
);

module.exports = router;