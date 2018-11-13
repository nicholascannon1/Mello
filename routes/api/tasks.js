/**
 * Contains API routes for dealing with tasks.
 * 
 * TODO: Route to move task to different list object
 * 
 * ROUTE: /api/task/
 */
const router = require('express').Router();
const Task = require('../../models/Task');
const passport = require('passport');
const List = require('../../models/List');
const verifyMongoId = require('../../helpers/verify').verifyMongoId;

/**
 * Returns a task by ID. This route is protected.
 * Task must match by task and user id to be returned.
 * 
 * ROUTE: /api/task/:id
 * METHOD: GET
 */
router.get('/:id',
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOne({
      _id: req.params.id,
      user: req.user._id
    }, 'task done list', (err, task) => {
      if (err) return next(new Error(err));
      if (!task) return sendTask404(req, res);
      res.status(200).json({ task: task });
    });
  });

/**
 * Creates new task and adds it to a list. Route 
 * is protected. Task description and list id must 
 * be sent in body of request.
 * 
 * ROUTE: /api/task/
 * METHOD: POST
 */
router.post('/', 
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.create({
      task: req.body.task,
      user: req.user._id,
      list: req.body.listId,
      done: false
    }, (err, task) => {
      if (err) return next(new Error(err));
      // Update the List object with new task
      List.updateOne({
        _id: req.body.listId,
        user: req.user._id
      }, { $push: { tasks: task } }, // Push new task onto list
      (err, raw) => {
        if (err) return next(new Error(err));
        res.status(200).json({ msg: 'Created new task', taskId: task._id });
      });
    });
  });

/**
 * Sets done flag of task specified by id to true. This 
 * route is protected and only the user specified by the 
 * tasks user attribute can complete the task.
 * 
 * ROUTE: /api/task/complete/:id
 * METHOD: PATCH
 */
router.patch('/complete/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id
    }, { done: true }, (err, task) => {
      if (err) return next(new Error(err));
      res.status(200).json({ msg: 'Completed task', taskId: task._id });
    });
  });

/**
 * Allows user to edit the task description. This route is
 * protected and user must own the task to edit it. New task
 * description must be sent in the body of the request.
 * 
 * ROUTE: /api/task/:id
 * METHOD: PATCH
 */
router.patch('/:id', 
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id,
    }, { task: req.body.task },
    (err, task) => {
      if (err) return next(new Error(err));
      res.status(200).json({ msg: 'Updated task', taskId: task._id });
    });
  });

/**
 * Allows user to delete a task specified by id. This route
 * is protected and only the owner of the task can delete it.
 * Once task is deleted it is also removed from the list object.
 * 
 * ROUTE: /api/task/:id
 * METHOD: DELETE
 */
router.delete('/:id',
  verifyMongoId,
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    }, (err, task) => {
      if (err) return next(new Error(err));
      if (!task) return sendTask404(req, res);

      // Update list object
      List.findOne({
        _id: task.list,
        user: req.user._id
      }, (err, list) => {
        if (err) return next(new Error(err));
        if (!list) return res.status(404).json({ msg: 'Task has invalid list' });

        let index = list.tasks.indexOf(task._id);
        list.tasks.splice(index, 1);
        list.save((err, updatedList) => {
          if (err) return next(new Error(err));
          res.status(200).json({ msg: 'Deleted task', task: task._id });
        });
      });
    });
  });

/**
 * 404 Handler
 */
function sendTask404(req, res) {
  res.status(404).json({ msg: 'Task not found' });
}

module.exports = router;