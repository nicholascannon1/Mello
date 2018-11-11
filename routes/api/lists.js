/**
 * Contains API for lists.
 * /api/list
 */
const router = require('express').Router();
const List = require('../../models/List');
const User = require('../../models/User');
const passport = require('passport');

/**
 * Gets all of a users lists
 */
router.get('/', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send({ lists: req.user.lists });
  });

/**
 * Create a new list
 */
router.post('/', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    List.create({
      name: req.body.name,
      user: req.user._id,
    }, (err, list) => {
      if (err) return next(new Error(err));
      // Push new list onto user object and save user object
      req.user.lists.push(list);
      req.user.save((err, user) => {
        if (err) return next(new Error(err));
        res.status(200).json({ msg: 'Succesfully created list' });
      });
    });
  });

/**
 * Returns a list by ID.
 * 
 * TODO: Add Mongo ID verification
 */
router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    List.findOne({
      user: req.user._id,
      _id: req.params.id
    }, 'name tasks', (err, list) => {
      if (err) return next(new Error(err));
      res.status(200).json({ list: list }); 
    });
  });

module.exports = router;