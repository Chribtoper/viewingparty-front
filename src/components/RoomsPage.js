import React, { Component, Fragment } from 'react';
import SendMessage from './SendMessage.js'
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import WithAuth from '../hocs/WithAuth.js'
import { connect } from 'react-redux'
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'
import Room from './Room.js'
import { fetchRooms } from '../actions/Rooms.js'
import RoomsList from './RoomsList.js'
import Nav from './Nav.js'

class RoomsPage extends Component {

  componentDidMount() {
    document.title = "Viewing Party"
  }

  render(){
    return (
      <Fragment>
        <Route exact path={this.props.match.url} render={() => (
          <RoomsList />
        )} />
        <Route
          path={`${this.props.match.url}/:roomId`}
          render={routerProps => <Room {...routerProps} />}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = (props) => {
  return props
}

export default WithAuth(connect(mapStateToProps, { fetchRooms })(withRouter(RoomsPage)))
