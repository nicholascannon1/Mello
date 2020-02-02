import React, {Component} from 'react';
import io from 'socket.io-client';
import {API_HOST} from '../config';

var socket;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: ''
    };
    socket = io(API_HOST);
  }

  componentDidMount() {
    socket.on('melloToken', token => {
      this.popup.close();
      localStorage.setItem('melloToken', token);
      socket.close();
      this.props.loginHandler(); // Updates the App's state
    });
  }

  // Check if popup window is still open
  checkPopup() {
    const check = setInterval(() => {
      const {popup} = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({disabled: ''});
      }
    }, 1000);
  }

  // Launches pop up window
  openPopup() {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${API_HOST}/auth/google?socketId=${socket.id}`;

    return window.open(
      url,
      '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
    );
  }

  // Starts OAuth process
  startAuth(e) {
    if (!this.state.disabled) {
      e.preventDefault();
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({disabled: 'disabled'});
    }
  }

  render() {
    return (
      <div id="loginPage">
        <div className="text-center">
          <h1 id="bigBrand">Mello</h1>
          <button
            id="loginWithGoogle"
            onClick={this.startAuth.bind(this)}
            className={'btn' + this.state.disabled}>
            Login with Google
          </button>
        </div>
      </div>
    );
  }
}
