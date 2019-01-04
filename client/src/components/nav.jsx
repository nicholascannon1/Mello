import React from 'react';

class MelloNav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Mello</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="">New List</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default MelloNav;