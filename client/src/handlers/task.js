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

    // Find index of list obj to update
    let listIndex = -1;
    for (let i=0; i<lists.length; i++) {
      if (lists[i]._id === listId) {
        listIndex = i;
      }
    }

    lists[listIndex].tasks.push(data.task);
    this.setState({ lists: lists });
  });
}

export {
  newTask,
};