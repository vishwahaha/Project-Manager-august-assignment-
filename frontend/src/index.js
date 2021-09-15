import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import axios from 'axios';
// CSS
import './components/Login/Login.css';

axios.defaults.baseURL = 'http://localhost:8000/project_manager';

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);

