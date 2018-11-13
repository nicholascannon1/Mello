/**
 * Verification middleware
 */
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Verifies that an incoming id is a valid mongoose
 * ObjectId. Id value must be attached to req.params.id
 */
function verifyMongoId(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid id' });
  }
  next();
}

module.exports.verifyMongoId = verifyMongoId;