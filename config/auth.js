/**
 * Passport configuration file
 */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const globals = require('../config/globals');
const User = require('../models/User');

module.exports = (passport) => {
  /**
   * Google OAuth strategy
   */
  passport.use(new GoogleStrategy({
    /**
     * ClientID, ClientSecret and callbackURL are all values from
     * the Google developer console.
     */
    clientID: globals.google.clientId,
    clientSecret: globals.google.clientSecret,
    callbackURL: globals.google.callbackUrl,
  }, (accessToken, refreshToken, profile, done) => {
    // Find user by google id, if no user exists create one
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

  /**
   * JWT strategy
   */
  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: function(req) {
      return req.get('Authorization') || null;
    },
    secretOrKey: globals.secret
  }, (payload, done) => {
    User.findById(payload.id, (err, user) => { 
      done(err, user); 
    });
  }));
};