/**
 * Contains API for lists.
 * /api/list
 */
const router = require('express').Router();
const List = require('../../models/List');
const User = require('../../models/User');
const passport = require('passport');
const verifyMongoId = require('../../helpers/verify').verifyMongoId;

/**
 * Returns the list ID's for a user. This route is 
 * protected and will display the lists for the user
 * specified in the JWT.
 * 
 * ROUTE: /api/list/user
 * METHOD: GET
 */
router.get('/user', 
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    User.findById(req.user._id)
      .exec((err, user) => {
        if (err) return next(new Error(err));
        res.send({ lists: user.lists });
      });
  });

/**
 * Creates a new empty list. This route is protected and
 * will add the list to the user specified in the JWT.
 * 
 * ROUTE: /api/list/
 * METHOD: POST
 */
router.post('/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    List.create({
      name: req.body.name,
      user: req.user._id,
    }, (err, list) => {
      if (err) return next(new Error(err));

      // Update User object with new list object
      req.user.lists.push(list);
      req.user.save((err, user) => {
        if (err) return next(new Error(err));
        res.status(200).json({ msg: 'Created new list', list: list._id });
      });
    });
  });

/**
 * Returns list object by ID and populates it with task
 * objects. This route is protected and will only return lists
 * that are owned by the user specified in the JWT. 
 * 
 * ROUTE: /api/list/:id
 * METHOD: GET
 */
router.get('/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    List.findOne({
      user: req.user._id,
      _id: req.params.id
    }, 'name tasks')
    .populate('tasks', '_id task done') // Populate with projection
    .exec((err, list) => {
      if (err) return next(new Error(err));
      if (!list) return sendList404(req, res);
      
      res.status(200).json({ list: list });
    });
  });

/**
 * Deletes a list specified by ID. This route is protected
 * and will only delete lists that are owned by the user 
 * specified in the JWT. 
 * 
 * TODO: Figure out how to delete task objects that are linked to this list
 * 
 * ROUTE: /api/list/:id
 * METHOD: DELETE
 */
router.delete('/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    List.findOneAndDelete({
      user: req.user._id,
      _id: req.params.id
    }, (err, list) => {
      if (err) return next(new Error(err));
      if (!list) return sendList404(req, res);

      // Remove list reference from user model
      let index = req.user.lists.indexOf(req.params.id);
      req.user.lists.splice(index, 1);
      req.user.save((err, user) => {
        if (err) return next(new Error(err));
        res.status(200).json({ msg: 'Deleted list', list: list._id });
      });
    });
  });

/**
 * Allows user to edit the name of the list. Route is protected
 * and will only edit name if the user specified in the JWT
 * owns the list. Cannot set list name to empty string.
 * 
 * ROUTE: /api/list/:id
 * METHOD: PATCH
 */
router.patch('/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // Check for non empty string
    if (!req.body.name || req.body.name !== '') {
      List.findOneAndUpdate({
        _id: req.params.id,
        user: req.user._id,
      }, { name: req.body.name },
      (err, list) => {
        if (err) return next(new Error(err));
        if (!list) return sendList404(req, res);

        res.status(200).json({ msg: 'Updated list name', list: list._id });
      });
    } else {
      res.status(403).json({ msg: 'Cannot set list name to empty string' });
    }
  });

/**
 * 404 error handler
 */
function sendList404(req, res) {
  res.status(404).json({ msg: 'List not found' });
}

module.exports = router;