import React, { Component } from 'react';
import MelloNav from './components/nav';

class App extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Event methods 
   */
  addList(e) {
    return;
  }

  deleteList(id) {
    return;
  }

  addTask(e) {
    return;
  }

  deleteTask(id) {
    return;
  }

  logout() {
    return;
  }

  render() {
    return (
      <div className="App">
        <MelloNav />
      </div>
    );
  }
}

export default App;