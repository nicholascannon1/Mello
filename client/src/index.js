import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './pages/Login';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';

//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(<Login />, document.getElementById('root'));

serviceWorker.unregister();