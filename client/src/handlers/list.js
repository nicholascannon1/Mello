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

export { 
  deleteList
};