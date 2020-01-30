import React, {Component} from 'react';
import MelloNav from './components/nav';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

class App extends Component {
  constructor(props) {
    super(props);

    // If token present then user is logged in
    let token = localStorage.getItem('melloToken');
    this.state = {
      token: token,
      loggedIn: token && true
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    this.setState({
      token: localStorage.getItem('melloToken'),
      loggedIn: true
    });
  }

  logout() {
    localStorage.removeItem('melloToken');
    this.setState({token: null, loggedIn: false});
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={props => {
              if (this.state.loggedIn) {
                return (
                  <React.Fragment>
                    <MelloNav handleLogout={this.logout} newListActive={false} />
                    <Home token={this.state.token} />
                  </React.Fragment>
                );
              } else {
                return <Redirect to="/login" />;
              }
            }}
          />
          <Route
            path="/login"
            render={props => {
              if (this.state.loggedIn) {
                return <Redirect to="/" />;
              } else {
                return <Login loginHandler={this.login} />;
              }
            }}
          />
        </Switch>
        <footer className="footer">
          <p>
            By Nicholas Cannon.{' '}
            <a
              href="https://github.com/nicholascannon1/Mello"
              target="_blank"
              rel="noopener noreferrer">
              View the Code Here!
            </a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
