import React from 'react';
import Task from './Task';
import $ from 'jquery';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newTaskText: '',
      id: props.id,
      listName: props.name,
      showDone: props.showDone,
    };
  }

  /**
   * New Task form hanlder methods
   */
  handleNewTask(e) {
    e.preventDefault();

    if (this.state.newTaskText !== '') {
      this.setState({ newTaskText: '' });
      $('#newTaskModal'+this.props.id).modal('toggle'); // Closes modal
      this.props.newTask(this.state.newTaskText, this.state.id);
    }
  }

  handleTaskTextChange(e) {
    this.setState({
      newTaskText: e.target.value
    });
  }

  /**
   * List option form handler methods
   */
  openListModal() {
    $("#checkbox"+this.props.id).prop('checked', this.props.showDone);
    $('#listOptions'+this.props.id).modal('toggle');
  }

  // need to reset the form state to origin if close without saving
  closeListOptionModal() {
    $('#listOptions'+this.props.id).modal('toggle');
    // unchecks checkbox
    $("#checkbox"+this.props.id).prop('checked', this.props.showDone);
    this.setState({ 
      ...this.state, 
      listName: this.props.name, 
      showDone: this.props.showDone 
    });
  }

  handleListEdit(e) {
    e.preventDefault();
    $('#listOptions'+this.props.id).modal('toggle');
    this.props.handleEdit(this.props.id, this.state.listName, this.state.showDone);
  }

  handleListChange(e) {
    this.setState({ ...this.state, listName: e.target.value });
  }

  handleShowDone(e) {
    this.setState({ ...this.state, showDone: !this.state.showDone });
  }

  render() {
    const tasks = this.props.tasks.map(task => {
      if (!task.done || this.props.showDone) {
        return (<Task 
          key={task._id} 
          id={task._id} 
          task={task.task} done={task.done} 
          editTask={this.props.editTask}
          deleteTask={this.props.deleteTask}
        />);
      }
    });

    return (
      <React.Fragment>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title" onClick={this.openListModal.bind(this)}>
              {this.props.name}
            </h5>
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
            <button className="btn btn-primary" data-toggle="modal" 
              data-target={"#newTaskModal"+this.props.id}>
              New Task
            </button>
          </div>
        </div>
        {/* NEW TASK MODAL */}
        <div className="modal fade" id={"newTaskModal"+this.props.id} tabIndex="-1" role="dialog">
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
                      onChange={this.handleTaskTextChange.bind(this)} 
                      value={this.state.newTaskText}
                      autoFocus required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Add Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* LIST OPTIONS MODAL */}
        <div className="modal fade" id={"listOptions"+this.props.id} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">List Options</h5>
                <button type="button" className="close" onClick={this.closeListOptionModal.bind(this)}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={this.handleListEdit.bind(this)}>
                <div className="modal-body">
                  
                  <div className="form-group">
                    <label>List name: </label>
                    <input type="text" placeholder="Homework..." value={this.state.listName} 
                      className="form-control" onChange={this.handleListChange.bind(this)} required 
                    />
                  </div>
                  <div className="form-check form-check-inline">
                  <label className="form-check-label">Show completed: </label>
                    <input type="checkbox" id={"checkbox"+this.props.id} className="form-check-input ml-2" value={this.state.showDone}
                      onChange={this.handleShowDone.bind(this)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save list</button>
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