import React from 'react';

class Task extends React.Component {
  render() {
    return (
      <li className="list-group-item">{this.props.task}</li>
    );
  }
}

export default Task;