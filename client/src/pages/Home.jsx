import React, { Component } from 'react'
import { API_HOST } from '../config';

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
      })
  }

  buildTask(tasks) {
    return tasks.map(task => {
      if (!task.done) {
        return (<li key={task._id} className="list-group-item">{task.task}</li>);
      } 
    });
  }

  buildListCard(list) {
    return (
      <div key={list._id} className="card">
        <div class="card-header">
          <h5 className="card-title">{list.name}</h5>
          <button type="button" class="close">
            <span>&times;</span>
          </button>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {this.buildTask(list.tasks)}
          </ul>
        </div>
        <div className="card-footer">
          <button class="btn btn-primary">New Task</button>
        </div>
      </div>
    );
  }

  render() {
    const lists = this.state.lists.map(list => this.buildListCard(list));

    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          {lists}
        </div>
      </div>
    )
  }
}
