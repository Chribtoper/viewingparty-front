import React from 'react';
import Room from './Room.js';
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import CreateRoom from './CreateRoom.js'
import { fetchRooms } from '../actions/rooms.js'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom'


const RoomsList = (props) => {

  const createNewRoom = (e) => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.roomName
      })
    })
      .then(r=>r.json())
      .then(r=>{
        this.joinRoom(r.id)
      })
  }
  // TODO: find out how :roomId works
  const joinRoom = (currentRoomId) => {
    return (<Route path={`/rooms/${currentRoomId}`} render={routerProps => <Room currentRoomId={currentRoomId} {...routerProps} />} />)
  }

  const renderRooms = (props) => {
    if (props.usersReducer.rooms) {
      debugger
    }
  }

  return (
    <Grid>
      <Grid.Column width={11}>
        <Card.Group itemsPerRow={2}>
          {renderRooms(props)}
        </Card.Group>

      </Grid.Column>
      <Grid.Column width={4}>
          <h1>This is where createRoom will go</h1>
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = (reduxStoreState) => {
  return reduxStoreState
}

export default withAuth(connect(mapStateToProps, { fetchRooms })(withRouter(RoomsList)))
