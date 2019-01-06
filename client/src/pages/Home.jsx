import React, { Component } from 'react'
import { API_HOST } from '../config';
import List from '../components/List';
import NewList from '../components/NewList';
import * as ListHandler from '../handlers/list';
import * as TaskHandler from '../handlers/task';

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

  render() {
    const lists = this.state.lists.map(list => {
      return (
        <List 
          key={list._id} 
          id={list._id} 
          name={list.name} 
          tasks={list.tasks}
          handleDelete={ListHandler.deleteList.bind(this)}
          newTask={TaskHandler.newTask.bind(this)}
        />
      );
    });

    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          {lists}
          <NewList addList={ListHandler.addList.bind(this)} />
        </div>
      </div>
    )
  }
}
