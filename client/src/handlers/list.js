/**
 * Contains all handling functions for dealing with 
 * List objects.
 */
import { API_HOST } from '../config';

/**
 * Deletes a list by ID.
 */
function deleteList(id) {
  fetch(API_HOST+'/api/list/'+id, {
    headers: { 'Authorization': this.props.token },
    method: 'DELETE'
  })
  .then(res => {
    if (res.status === 200) {
      this.setState({
        lists: this.state.lists.filter(list => id !== list._id)
      })
    }
  });
}

/**
 * Adds new list with name
 */
function addList(listName) {
  const payload = { name: listName };

  fetch(API_HOST+'/api/list/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 
      'Authorization': this.props.token,
      'content-type': 'application/json' // Must set content type when
    },                                   // sending payload
  })
  .then(res => {
    if (res.status === 200) {
      return res.json();
    }
  })
  .then(data => {
    // Add new list to existing array of lists
    const newLists = this.state.lists.concat([data.list]);
    this.setState({ lists: newLists });
  });
}

/**
 * Edits a list
 */
function editList(listId, listName, showDone) {
  const payload = {
    name: listName,
    showDone: showDone
  };

  fetch(API_HOST+'/api/list/'+listId, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Authorization': this.props.token,
      'content-type': 'application/json'
    }
  })
  .then(res => {
    if (res.status === 200) {
      return res.json();
    }
  })
  .then(data => {
    const lists = JSON.parse(JSON.stringify(this.state.lists));
    const listIndex = lists.findIndex(list => list._id === data.list._id);
    // Don't replace the whole list object because this endpoint does not
    // return the projected task objects.
    lists[listIndex] = {
      ...lists[listIndex],
      name: data.list.name, 
      showDone: data.list.showDone
    };
    this.setState({ lists: lists });
  }); 
}


export { 
  deleteList,
  addList,
  editList
};