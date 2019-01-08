/**
 * Contains API for lists.
 * /api/list
 */
const router = require('express').Router();
const List = require('../../models/List');
const User = require('../../models/User');
const Task = require('../../models/Task');
const passport = require('passport');
const verifyMongoId = require('../../helpers/verify').verifyMongoId;

/**
 * Models 
 */
const List = require('../../models/List');
const User = require('../../models/User');
const Task = require('../../models/Task');

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
      .populate({
        path: 'lists',
        select: '_id tasks name showDone',
        populate: {
          path: 'tasks',
          select: '_id task done'
        }
      })
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
    console.log(req.body);
    List.create({
      name: req.body.name,
      user: req.user._id,
    }, (err, list) => {
      if (err) return next(new Error(err));

      // Update User object with new list object
      req.user.lists.push(list);
      req.user.save((err, user) => {
        if (err) return next(new Error(err));

        // Create projection of new list and return it
        newList = { _id: list._id, tasks: list.tasks, name: list.name, showDone: list.showDone };
        res.status(200).json({ msg: 'Created new list', list: newList });
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

        // Delete Tasks from List
        Task.deleteMany({ user: req.user._id, list: req.params.id }, (err, task) => {
          if (err) return next(new Error(err));
          
          res.status(200).json({ msg: 'Deleted list', list: list._id });
        });
      });
    });
  });

/**
 * Allows user to edit a list. Route is protected
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
    if (!req.body.name || req.body.name !== '' || req.body.showDone !== undefined) {
      List.findOneAndUpdate({
        _id: req.params.id,
        user: req.user._id,
      }, { name: req.body.name, showDone: req.body.showDone }, { new: true },
      (err, list) => {
        if (err) return next(new Error(err));
        if (!list) return sendList404(req, res);
        
        newList = { _id: list._id, tasks: list.tasks, name: list.name, showDone: list.showDone };
        res.status(200).json({ msg: 'Updated list', list: newList });
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