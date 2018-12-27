import React, { Component } from 'react';
import SendMessage from './SendMessage.js'
import CreateRoom from './CreateRoom.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'
import Room from './Room.js'

class Rooms extends Component {

  constructor(props) {
    super(props)
      this.state = {
        rooms: []
      }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(rooms => this.setState({ rooms }));
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
      .then(r=>r.json())
      .then(r=>{
        this.joinRoom(r.id)
      })
  }


  // TODO: find out how :roomId works
  joinRoom = (currentRoomId) => {
    <Route path={`${match.url}/:roomId`} render={routerProps => <Room currentRoomId={currentRoomId} {...routerProps} />} />
  }

  render(){

    return (
      <Container>
        <Grid>
          <Grid.Column width={11}>
            <Card.Group itemsPerRow={2}>
              {this.state.rooms.map(room => (
                <Card
                  image='https://i.ytimg.com/vi/Bd7MvHt3ui4/maxresdefault.jpg'
                  color='blue'
                  header={room.name}
                  onClick={() => this.joinRoom(room.id)}
                  key={room.id}
                >
                </Card>
              ))
              }
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

const mapStateToProps = ({ usersReducer: { user: { avatar, username, id } } }) => ({
  avatar,
  username,
  id
})

export default withAuth(connect(mapStateToProps)(Rooms))
