/**
 * Passport configuration file
 */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const globals = require('../config/globals');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: globals.google.clientId,
    clientSecret: globals.google.clientSecret,
    callbackURL: globals.google.callbackUrl,
  }, (token, refreshToken, profile, done) => {
    return done(null, {
      profile: profile,
      token: token
    });
  }));
}