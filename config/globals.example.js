/**
 * THIS IS AN EXAMPLES FILE
 * Defines global variables for project.
 */

module.exports = {
  google: {
    clientId: '',
    clientSecret: '',
    callbackUrl: process.env.NODE_ENV === 'production' ? '' : ''
  },
  database: {
    URL: process.env.DB_URI ? process.env.DB_URI : ''
  },
  secret: ''
};
