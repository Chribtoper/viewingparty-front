import React, { Component } from 'react';
import Room from './Room.js';
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import CreateRoom from './CreateRoom.js'
import withAuth from '../hocs/withAuth'
import { fetchRooms } from '../actions/rooms.js'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Link, Switch, withRouter } from 'react-router-dom'


class RoomsList extends Component {

  state = {
    roomName: '',
    redirected: false,
    roomId: null
  }

  setRoomName = (e) => {
    const input = e.target.value
    this.setState({roomName: input})
  }

  createNewRoom = (e) => {
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
    .then(r=>{
      console.log(this.props.usersReducer.rooms)
      this.props.fetchRooms()
      .then(()=>{
        const rooms = this.props.usersReducer.rooms
        const roomId = rooms[Object.keys(rooms)[Object.keys(rooms).length - 1]].id
        this.setState({
          redirected: true,
          roomId: roomId
        })
      })
    })
  }

  renderRooms = () => {
    if (this.props.usersReducer.rooms) {
      const rooms = this.props.usersReducer.rooms
      return rooms.map(room => {
        return (
            <Card
              image='https://i.ytimg.com/vi/Bd7MvHt3ui4/maxresdefault.jpg'
              color='blue'
              header={room.name}
              key={room.id}
              href={`/rooms/${room.id}`}
            >
            </Card>
        )
      })
    }
  }

  render() {
  return this.state.redirected ? (
    <Redirect to={`rooms/${this.state.roomId}`} render={window.location.reload()} />
  ) : (
    <Container>
      <Grid>
        <Grid.Column style={{overflow: 'auto', maxHeight: window.innerHeight }} width={11}>
          <Card.Group itemsPerRow={2}>
            {this.renderRooms()}
          </Card.Group>

        </Grid.Column>
        <Grid.Column width={4}>
            <CreateRoom
              roomName={this.state.roomName}
              setRoomName={this.setRoomName}
              createNewRoom={this.createNewRoom}
              />
        </Grid.Column>
      </Grid>
    </Container>
    )
  }
}

const mapStateToProps = (reduxStoreState) => {
  return reduxStoreState
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRooms: () => dispatch(fetchRooms())
  }
}

export default withAuth(connect(mapStateToProps, { fetchRooms })(withRouter(RoomsList)))
