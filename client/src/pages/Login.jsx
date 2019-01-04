import React, { Component } from 'react';
import io from 'socket.io-client';
import { API_HOST } from '../config';

const socket = io(API_HOST);

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    };
  }

  componentDidMount() {
    socket.on('melloToken', token => {
      this.popup.close();
      this.setState({ token });
      localStorage.setItem('melloToken', token);
    })
  }

  openPopup() {
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    const url = `${API_HOST}/auth/google?socketId=${socket.id}`;

    return window.open(url, '',       
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  startAuth(e) {
    e.preventDefault();
    this.popup = this.openPopup();
  }

  render() {
    return (
      <div>
        <button onClick={this.startAuth.bind(this)}>Login with Google</button>
      </div>
    )
  }
}
