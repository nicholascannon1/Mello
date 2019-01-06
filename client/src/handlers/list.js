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

export { 
  deleteList,
  addList
};