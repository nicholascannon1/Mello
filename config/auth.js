/**
 * Passport configuration file
 */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const globals = require('../config/globals');
const User = require('../models/User');

module.exports = (passport) => {
  /**
   * ClientID, ClientSecret and callbackURL are all values from
   * the Google developer console.
   */
  passport.use(new GoogleStrategy({
    clientID: globals.google.clientId,
    clientSecret: globals.google.clientSecret,
    callbackURL: globals.google.callbackUrl,
  }, (accessToken, refreshToken, profile, done) => {
    // Find user, if no user exists create one
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (!user) {
        User.create({ 
          googleId: profile.id, 
          name: profile.displayName 
        }, (err, user) => {
          done(err, user);
        });
      } else {
        done(err, user);
      }
    });
  }));
}