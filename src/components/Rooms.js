import React, { Component } from 'react';
import ActionCable from 'actioncable';
import SendMessage from './SendMessage.js'
import CreateRoom from './CreateRoom.js'

const ROOMS = "http://localhost:3000/rooms"

class Rooms extends Component {

  constructor() {
    super()
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
    fetch(ROOMS)
      .then(r => r.json())
      .then(rooms => this.setState({ rooms }));
  }

  createNewRoom = (e) => {
    e.preventDefault()
    fetch(ROOMS, {
      method: "POST",
      headers: {
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
    const userId = this.props.user_id
    fetch(`${ROOMS}/${roomId}/messages`, {
      method: "POST",
      headers: {
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
    this.setState({currentRoomId}, () =>{
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
        fetch(`${ROOMS}/${currentRoomId}/messages`)
        .then(r=>r.json())
        .then(messages=>{
          this.setState({messages})
        })
      });
    })
  }

  roomSelection() {

    return (
      <div>
        <h1> Rooms: </h1>
        <ul>
          {this.state.rooms.map(room => (
            <button
              key={room.id}
              onClick={() => this.joinRoom(room.id)}
            >
              {room.name}
            </button>
          ))
          }
        </ul>
      </div>
    )
  }

  leaveRoom() {
    // fetch(ROOMS)
    // .then(r=>r.json())
    // .then(rooms=>this.setState({rooms})) REFACTOR THIS SO IT DOESNT LOOP THROUGH FETCHES
    return (
      <div>
        <button
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
        </button>
      </div>
    )
  }

  render(){
    return (
      <div>
        {!this.state.currentRoomId ? this.roomSelection() : this.leaveRoom()}
        {this.state.roomSubscription ? this.state.messages.map(msg => <li key={msg.id}>{msg.body}</li>) : null}
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
      </div>
    )
  }

}

export default Rooms
