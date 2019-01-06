import React from 'react'

class NewList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listName: '',
    }
  }

  listNameChange(e) {
    this.setState({ listName: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.state.listName !== '') {
      this.props.addList(this.state.listName);
      this.setState({ listName: '' }); 
    }
  }

  render() {
    return (
      <form className="card" id="newListForm" onSubmit={this.handleSubmit.bind(this)}>
        <div className="card-header">
          <input type="text" 
            className="form-control form-control-sm" 
            id="newListName"
            placeholder="New list"
            value={this.state.listName}
            onChange={this.listNameChange.bind(this)}
            required
          />
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
          </ul>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary" type="submit">Create List</button>
        </div>
      </form>
    );
  }
}

export default NewList;