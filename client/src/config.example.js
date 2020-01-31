/**
 * Holds global variables for client
 */

module.exports = {
  API_HOST: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
};
