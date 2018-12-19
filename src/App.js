import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import Profile from './components/Profile'
import Login from './components/Login'
import ActionCable from 'actioncable'
import Nav from './components/Nav.js'
import Home from './containers/Home.js'
import Rooms from './components/Rooms.js'
import NotFound from './components/notFound.js'

const App = (props) => {
  return (
    <Fragment>
      <Nav />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/rooms" />} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
    </Fragment>
  )
}

export default withRouter(App);
