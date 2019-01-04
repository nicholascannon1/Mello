import React, { Component } from 'react';
import MelloNav from './components/nav';
import { API_HOST } from './config';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MelloNav />
      </div>
    );
  }
}

export default App;