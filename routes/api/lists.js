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
 * Gets all of a users lists
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
 * Create a new list
 */
router.post('/',
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    List.create({
      name: req.body.name,
      user: req.user._id,
    }, (err, list) => {
      if (err) return next(new Error(err));
      // Push new list onto user object and save user object
      req.user.lists.push(list);
      req.user.save((err, user) => {
        if (err) return next(new Error(err));
        res.status(200).json({ 
          msg: 'Succesfully created list',
          id: list._id
        });
      });
    });
  });

/**
 * Returns a list by ID. Populates task objects
 * 
 * TODO: Add Mongo ID verification
 */
router.get('/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    List.findOne({
      user: req.user._id,
      _id: req.params.id
    }, 'name tasks')
    .populate('tasks', '_id task done')
    .exec((err, list) => {
      if (err) return next(new Error(err));
      if (!list) return sendList404(req, res);
      
      res.status(200).json({ list: list });
    });
  });

/**
 * Delete a list
 * 
 * TODO: Add mongo id veriffication
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
        res.status(200).json({ msg: 'Successfully deleted', listName: list.name });
      });
    });
  });

/**
 * Edit list name
 * 
 * TODO: Add mongo id verification
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

        res.status(200).json({ msg: 'Successfully updated list', name: req.body.name });
      });
    }
  });

function sendList404(req, res) {
  res.status(404).json({ msg: 'List not found' });
}

module.exports = router;