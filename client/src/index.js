/**
 * React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

/**
 * Components
 */
import App from './App';
import { BrowserRouter} from 'react-router-dom';

/**
 * CSS
 */
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ), document.getElementById('root'));

serviceWorker.unregister();