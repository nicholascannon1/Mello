import React, { Component } from 'react'
import { API_HOST } from '../config';
import List from '../components/List';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: []
    }
  }

  componentDidMount() {
    // Get users lists ids and update the state
    fetch(API_HOST+'/api/list/user', {
        headers: { 'Authorization': this.props.token }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({ lists: data.lists });
      });
  }

  /**
   * Deletes a list by ID.
   */
  handleListDelete(id) {
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

  render() {
    //const lists = this.state.lists.map(list => this.buildListCard(list));

    const lists = this.state.lists.map(list => {
      return (
        <List 
          key={list._id} 
          id={list._id} 
          name={list.name} 
          tasks={list.tasks}
          handleDelete={this.handleListDelete.bind(this)}
        />
      );
    });

    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          {lists}
        </div>
      </div>
    )
  }
}
