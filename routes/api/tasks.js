/**
 * Contains API routes for dealing with tasks.
 * /api/tasks/
 */
const router = require('express').Router();
const Task = require('../../models/Task');
const passport = require('passport');
const List = require('../../models/List');

/**
 * Get a task by ID
 */
router.get('/:id',
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
 * Create new task
 */
router.post('/', 
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // TODO: check if task text is not empty
    Task.create({
      task: req.body.task,
      done: false,
      user: req.user._id,
      list: req.body.listId
    }, (err, task) => {
      if (err) return next(new Error(err));
      // Add task id to list
      // TODO: add mongo id check
      List.updateOne({
        _id: req.body.listId,
        user: req.user._id
      }, { $push: { tasks: task } },
      (err, raw) => {
        if (err) return next(new Error(err));
        res.status(200).json({ msg: 'Successfully created new task', taskId: task._id });
      });
    });
  });

/**
 * Marks a task as completed
 */
router.patch('/complete/:id', 
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
 * Edit task
 */
router.patch('/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id,
    }, { task: req.body.task },
    (err, task) => {
      if (err) return next(new Error(err));
      res.status(200).json({ msg: 'Successfully updated task', taskId: task._id });
    });
  });

/**
 * Delete task
 */
router.delete('/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    }, (err, task) => {
      if (err) return next(new Error(err));

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
          res.status(200).json({ msg: 'Successfully deleted task', task: task.task });
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