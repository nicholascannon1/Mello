/**
 * Contains all handling functions for Task objects
 */
import { API_HOST } from '../config';

/**
 * Adds new task to list
 */
function newTask(task, listId) {
  const payload = {
    task: task,
    listId: listId
  };

  fetch(API_HOST+'/api/task', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 
      'Authorization': this.props.token,
      'content-type': 'application/json'
    },
  }).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(data => {
    // Create deep copy of lists object 
    const lists = JSON.parse(JSON.stringify(this.state.lists));
    const listIndex = lists.findIndex(list => list._id === listId);
    lists[listIndex].tasks.push(data.task);
    this.setState({ lists: lists });
  });
}

function deleteTask(id) {
  fetch(API_HOST+'/api/task/'+id, {
    method: 'DELETE',
    headers: {
      'Authorization': this.props.token,
    }
  }).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(data => {
    const lists = JSON.parse(JSON.stringify(this.state.lists));
    const listId = lists.findIndex(list => list._id === data.listId);
    lists[listId].tasks = lists[listId].tasks.filter(task => task._id !== data.taskId);
    this.setState({ lists: lists });
  });
}

function editTask(id, task, done) {
  const payload = {
    task: task,
    done: done,
  };

  fetch(API_HOST+'/api/task/'+id, {
    headers: {
      'Authorization': this.props.token,
      'content-type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(payload)
  }).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(data => {
    const lists = JSON.parse(JSON.stringify(this.state.lists));
    const listIndex = lists.findIndex(list => list._id === data.listId);
    const taskIndex = lists[listIndex].tasks.findIndex(task => task._id === id);
    lists[listIndex].tasks[taskIndex] = {...data.task};
    this.setState({ lists: lists });
  });
}

export {
  newTask,
  editTask,
  deleteTask
};