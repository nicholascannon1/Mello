import React from 'react';
import $ from 'jquery';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
      done: props.done
    };
  }

  handleTaskChange(e) {
    this.setState({ ...this.state, task: e.target.value });
  }

  handleDoneChange(e) {
    this.setState({ ...this.state, done: !this.state.done });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.state.task !== '') {
      this.setState({ ...this.state });
      $("#taskModal"+this.props.id).modal('toggle');
      this.props.editTask(this.props.id, this.state.task, this.state.done);
    }
  }

  handleDelete() {
    this.props.deleteTask(this.props.id);
    $("#taskModal"+this.props.id).modal('toggle');
  }

  /**
   * Changes task text to green if its been completed
   */
  getTaskClass(done) {
    let btnClass = 'list-group-item list-group-item-action'
    if (done) {
      btnClass += ' text-success';
    }
    return btnClass
  }

  render() {
    return (
      <React.Fragment>
        <button 
          type="button" 
          className={this.getTaskClass(this.props.done)}
          data-toggle="modal" data-target={"#taskModal"+this.props.id}>
          {this.props.task}
        </button>
        <div className="modal fade" id={"taskModal"+this.props.id} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="form-group">
                    <input 
                      className="form-control"
                      type="text" value={this.state.task} 
                      onChange={this.handleTaskChange.bind(this)}
                      placeholder="Whats your task?"/>
                  </div>
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      value={this.state.done}
                      onChange={this.handleDoneChange.bind(this)}
                      />
                    <label className="form-check-label">Completed</label>
                  </div>
                  <button className="btn btn-primary mr-2" type="submit">Save task</button>
                  <button className="btn btn-danger" type="button" onClick={this.handleDelete.bind(this)}>
                    Delete Task
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Task;