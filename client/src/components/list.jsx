import React from 'react';
import Task from './Task';
import $ from 'jquery';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newTaskText: ''
    };
  }

  /**
   * Form hanlder methods
   */
  handleNewTask(e) {
    e.preventDefault();

    if (this.state.newTaskText !== '') {
      this.setState({ newTaskText: '' });
      $('#newTaskModal').modal('toggle'); // Closes modal
      this.props.newTask(this.state.newTaskText, this.props.id);
    }
  }

  handleChange(e) {
    this.setState({
      newTaskText: e.target.value
    });
  }

  render() {
    const tasks = this.props.tasks.map(task => {
      return (<Task key={task._id} id={task._id} task={task.task} done={task.done} />);
    });

    return (
      <React.Fragment>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">{this.props.name}</h5>
            <button type="button" className="close" 
              onClick={() => this.props.handleDelete(this.props.id)}>
              <span>&times;</span>
            </button>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {tasks}
            </ul>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" data-toggle="modal" data-target="#newTaskModal">
              New Task
            </button>
          </div>
        </div>
        {/* NEW TASK MODAL */}
        <div className="modal fade" id="newTaskModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Task</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={this.handleNewTask.bind(this)}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="taskText">Task: </label>
                    <input type="text" className="form-control" 
                      id="tastText" placeholder="Wash dog..." 
                      onChange={this.handleChange.bind(this)} 
                      value={this.state.newTaskText}
                      autoFocus required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Add Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default List;