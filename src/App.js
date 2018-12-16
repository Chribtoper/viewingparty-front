import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import ActionCable from 'actioncable';
import NavBar from './components/NavBar.js'
import Home from './containers/Home.js'

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Route exact path="/" render={() => <Home />} />
        </div>
      </Router>
    );
  }
}

export default App;
