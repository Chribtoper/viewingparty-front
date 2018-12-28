import React, { Component, Fragment } from 'react';
import SendMessage from './SendMessage.js'
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'
import Room from './Room.js'
import { fetchRooms } from '../actions/rooms.js'
import RoomsList from './RoomsList.js'

class RoomsPage extends Component {

  componentDidMount() {
  }

  render(){
    return (
      <Container>
        <Route exact path={this.props.match.url} render={() => (
          <RoomsList />
        )} />
        <Route
          path={`${this.props.match.url}/:roomId`}
          render={routerProps => <Room {...routerProps} />} 
        />
      </Container>
    )
  }
}

const mapStateToProps = (props) => {
  return props
}

export default withAuth(connect(mapStateToProps, { fetchRooms })(withRouter(RoomsPage)))
