import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Gated Site 2</h1>
        </header>
        
        <p className="App-intro">
          You need a valid JWT to see this site
        </p>

        <p className="App-intro">
          <a href="/.netlify/functions/delete-cookie">Clear site cookie</a>
        </p>

        <p className="App-intro">
          <a target='_blank' href="https://gated-sites-demo-login-site.netlify.com/">Back to login portal</a>
        </p>
      </div>
    );
  }
}

export default App;
