import React from 'react';
import Task from './Task';

class List extends React.Component {
  render() {
    const tasks = this.props.tasks.map(task => {
      return (<Task key={task._id} id={task._id} task={task.task} done={task.done} />);
    });

    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">{this.props.name}</h5>
          <button type="button" className="close">
            <span>&times;</span>
          </button>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {tasks}
          </ul>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary">New Task</button>
        </div>
      </div>
    );
  }
}

export default List;