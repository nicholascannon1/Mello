import React from 'react';
import { Link } from 'react-router-dom';

class MelloNav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Mello</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className={this.isNewListActive()} to="/newList">New List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={this.props.handleLogout} to="/login">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  isNewListActive() {
    if (this.props.newListActive) {
      return 'nav-link active';
    }
    return 'nav-link';
  }
}

export default MelloNav;