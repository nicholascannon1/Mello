import React from 'react';

class Task extends React.Component {
  render() {
    return (
      <button type="button" className="list-group-item list-group-item-action">
        {this.props.task}
      </button>
    );
  }
}

export default Task;