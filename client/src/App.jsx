import React, { Component } from 'react';
import MelloNav from './components/nav';
import { API_HOST } from './config';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MelloNav />
        <a href={API_HOST+'/auth/google'}>Login with Google</a>
      </div>
    );
  }
}

export default App;