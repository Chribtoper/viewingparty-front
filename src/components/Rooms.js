import React, { Component } from 'react';
import ActionCable from 'actioncable';
import SendMessage from './SendMessage.js'
import CreateRoom from './CreateRoom.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'

class Rooms extends Component {

  constructor(props) {
    super(props)
      this.state = {
        rooms: [],
        currentRoomId: null,
        roomSubscription: null,
        message: '',
        roomName: '',
        messages: []
      };
        this.messageInput = this.messageInput.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
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

  handleMessage = (e) => {
    e.preventDefault()
    console.log(this.state.message)
    const roomId = this.state.currentRoomId
    const message = this.state.message
    const userId = this.props.id
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: message,
        user_id: userId,
        room_id: roomId
      })
    })
    .then(r=>r.json())
    .then(response => {
      console.log(`Sent a message: ${response}`)
      this.setState({message: ''})
    })
  } // deals with sending messages to a room

  messageInput = (e) => {
    const input = e.target.value
    this.setState({message: input})
  } // deals with the message input on change

  setRoomName = (e) => {
    const input = e.target.value
    this.setState({roomName: input})
  }

  joinRoom = (currentRoomId) => {
    this.setState({currentRoomId}, () => {
      this.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
      const roomSubscription = this.cable.subscriptions.create(
        {
          channel: "RoomsChannel",
          room_id: this.state.currentRoomId
        },
        { received: data => {
          console.log("The data is:", data)
          if (data.title) {
            this.setState({messages: [...this.state.messages, data.body]})
          }
        }}
      );
      this.setState({ roomSubscription }, () => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${currentRoomId}/messages`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json"
          }
        })
        .then(r=>r.json())
        .then(messages=>{
          this.setState({messages})
        })
      })
    })
  }

  roomSelection() {
    return (
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
    )
  }

  leaveRoom() {
    // fetch(ROOMS)
    // .then(r=>r.json())
    // .then(rooms=>this.setState({rooms})) REFACTOR THIS SO IT DOESNT LOOP THROUGH FETCHES
    return (
      <div>
        <Button negative
          onClick={() => {
            this.cable.subscriptions.remove(this.state.roomSubscription);
            this.setState(
              { currentRoomId: null, roomSubscription: null, messages: []},
              () => {
                console.log("Succesfully cleared subscription")
              }
            )
          }}
          >
            LeaveRoom
        </Button>
      </div>
    )
  }

  render(){
    return (
      <Container>
        <Grid>
          <Grid.Column width={11}>
            {!this.state.currentRoomId ? this.roomSelection() : this.leaveRoom()}
            {this.state.roomSubscription ? this.state.messages.map((msg) => {
              return <li key={msg.id}>{msg.body}</li>
            })
               : null
             }
          </Grid.Column>
          <Grid.Column width={4}>
            {!this.state.currentRoomId
              ?
              <div>
                <CreateRoom
                  roomName={this.state.roomName}
                  setRoomName={this.setRoomName}
                  createNewRoom={this.createNewRoom}
                />
              </div>
              :
              <div>
                <SendMessage
                  message={this.state.message}
                  handleMessage={this.handleMessage}
                  messageInput={this.messageInput}
                />
              </div>
            }
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
