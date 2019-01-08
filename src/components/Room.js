import React, { Component, Fragment } from 'react'
import WithAuth from '../hocs/WithAuth'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch, NavLink, withRouter } from 'react-router-dom'
import ActionCable from 'actioncable';
import { Menu, Sidebar, Modal, Icon, Header, Label, Feed, TextArea, Message, Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'
import SendMessage from './SendMessage.js'
import SendVideo from './SendVideo.js'
import { deleteVideo, patchVideo } from '../actions/Rooms.js'

class Room extends Component {

  constructor(props) {
    super(props)
      this.state = {
        hostCurrentVideo: {},
        currentRoomId: null,
        roomSubscription: null,
        message: '',
        messages: [],
        videos: [],
        youtubeInput: '',
        youtubePlayer: null,
        currentVideo: {},
        currentTime: null,
        currentRoom: null,
        users: [],
        userRoomId: null,
        loaded: false,
        host: false,
        redirect: false,
        modalOpen: false
      };
        this.messageInput = this.messageInput.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  componentDidMount() {
    const currentRoomId = this.props.match.params.roomId
    this.setState({currentRoomId})
    this.socketConnect(currentRoomId)
    .then(()=>{
      this.findRoom(currentRoomId)
      console.log(this.props)
        if (this.props.UsersReducer.user.id === this.state.users[0].id) {
          if (this.state.videos.length>0) {
            this.setState({host: true, currentVideo: { url: this.regexUrl(this.state.videos[0].video_url), id: this.state.videos[0].id } })
          }
        }
    })
  }

  componentWillUnmount() {
    clearInterval(this.intervalOne)
    clearInterval(this.intervalTwo)
    this.cable.subscriptions.remove(this.state.roomSubscription)
    console.log("Succesfully cleared subscription")
  }

  findRoom = (currentRoomId) => {
    return new Promise ((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${currentRoomId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json"
        }
      })
      .then(r=>r.json())
      .then(currentRoom => this.setState({currentRoom}))
      resolve()
    })
  }

  socketConnect = (currentRoomId) => {
    return new Promise ((resolve, reject) => {
      this.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
      const roomSubscription = this.cable.subscriptions.create(
        {
          channel: "RoomsChannel",
          room_id: currentRoomId,
          user_id: this.props.UsersReducer.user.id
        },
        { received: data => {
          console.log(data)
            switch (data.title) {
              case "New message":
                this.setState({messages: [...this.state.messages, data.body]})
                break
              case 'new_youtube_vid':
                this.setState({videos: [...this.state.videos, data.body.youtube]})
                if (this.state.videos.length===1) {
                  const currentVideo = { url: this.regexUrl(data.body.youtube.video_url), id: data.body.youtube.id }
                  this.setState({currentVideo})
                  this.state.youtubePlayer.target.playVideo()
                  patchVideo(currentRoomId,currentVideo.url)
                }
                break
              case 'User joined':
                console.log(data.body + ' has joined')
                break
              case 'All users':
                console.log(data.body)
                  if (!this.state.loaded) {
                    this.setState({
                      users: data.body.users,
                      videos: data.body.videos,
                      messages: data.body.messages,
                      loaded: true
                    })
                    if (data.body.videos.length>0) patchVideo(currentRoomId,this.regexUrl(data.body.videos[0].video_url))
                  } else {
                    this.setState({
                      users: data.body.users
                    })
                  }
                resolve()
                break
              case 'pause':
                console.log(this.state)
                if (this.state.youtubePlayer) this.state.youtubePlayer.target.pauseVideo()
                break
              case 'play':
                console.log(this.state)
                if (this.state.youtubePlayer) this.state.youtubePlayer.target.playVideo()
                break
              case 'current_time':
                this.setState({currentTime: data.time, hostCurrentVideo: data.hostCurrentVideo})
                break
              case 'set_video':
                this.setState({currentVideo: data.body})
                this.state.youtubePlayer.target.playVideo()
                patchVideo(currentRoomId,data.body.url)
                break
              case 'receive_videos':
                this.setState({videos: data.body})
                  if (this.state.videos.length>0) {
                    const currentVideo = { url: this.regexUrl(data.body[0].video_url), id: data.body[0].id }
                    this.setState({currentVideo})
                    patchVideo(currentRoomId,currentVideo.url)
                    this.state.youtubePlayer.target.playVideo()
                  } else if (this.state.videos.length===0) {
                    this.handleOpen()
                  }
                break
              case 'host_change':
              this.setState({
                users: data.body
              })
                    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
                      clearInterval(this.intervalTwo)
                      this.hostLoop()
                    }
                break
              default: console.log("The data is:", data)
            }
          }
        }
      )
      this.setState({ roomSubscription })
    })
  }

  handleMessage = (e) => {
    e.preventDefault()
    console.log(this.state.message)
    const roomId = this.state.currentRoomId
    const message = this.state.message
    const userId = this.props.UsersReducer.user.id
    const username = this.props.UsersReducer.user.username
    const avatar = this.props.UsersReducer.user.avatar
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: message,
        user_id: userId,
        room_id: roomId,
        userName: username,
        icon: avatar
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

  handleYoutubeFetch = (e) => {
    const roomId = this.state.currentRoomId
    const userId = this.props.UsersReducer.user.id
    const videoUrl = this.state.youtubeInput
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId}/youtubes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        room_id: roomId,
        video_url: videoUrl
      })
    })
    .then(r=>r.json())
    .then(response => {
      console.log(`Sent a youtube: ${response}`)
      this.setState({youtubeInput: ''})
    })
  }

  youtubeInputUrl = (e) => {
    const input = e.target.value
    this.setState({youtubeInput: input})
  } // deals with the message input on change

  generateRandToken = (length) => {
      length = 8
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  checkCurrentTimes = () => {
    if (Object.keys(this.state.currentTime).length === 0) {
      return false
    } else {
      return true
    }
  }

  setCurrentVid = (e) => {
    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
      const currentVideo = { url: e.target.name, id: e.target.alt }
      this.state.roomSubscription.send({title: 'set_video', body: currentVideo})
    }
  }

  renderMessages = () => {
    if (this.state.messages) {
      return this.state.messages.map(message => {
          return (
            <Message key={this.generateRandToken()}>
              <Message.Header><Image src={message.icon} avatar /><span>{message.userName}</span></Message.Header>
                {message.body}
            </Message>
          )
      })
    }
  }

  regexUrl = (url) => {
    const regex = /v=(.*)/
    const code = url.match(regex)[1]
    return code
  }

  renderVideos = () => {
    if (this.state.videos) {
      return this.state.videos.map(video => {
        const code = this.regexUrl(video.video_url)
        const url = `https://img.youtube.com/vi/${code}/maxres
        default.jpg`
          return (
            <>
            <Image style={{ height: '25vh', width: '25vw' }} alt={video.id} name={code} onClick={(e)=>this.setCurrentVid(e)} verticalAlign='middle' key={this.generateRandToken()} src={url} size='small'/>
            <Button onClick={()=>deleteVideo(this.state.currentRoomId, video.id)} style={{ height: '25vh', width: '3vw' }}negative><Icon fitted name='delete' size='big'/></Button>
            </>
          )
      })
    }
  }

  hostLoop = () => {
      this.intervalOne = setInterval( () => {
        this.state.roomSubscription.send({
          title: 'current_time',
          time: this.state.youtubePlayer.target.getCurrentTime(),
          hostCurrentVideo: this.state.currentVideo
        })

      }, 1000)
  }

  userLoop = () => {
    this.intervalTwo = setInterval( () => {
      if (this.state.currentVideo!==this.state.hostCurrentVideo) {
        this.setState({currentVideo: this.state.hostCurrentVideo})
      }
      if (this.state.youtubePlayer) {
        if (Math.abs(this.state.youtubePlayer.target.getCurrentTime() - this.state.currentTime) > 2 && this.state.youtubePlayer) {
          this.state.youtubePlayer.target.seekTo(this.state.currentTime, true)
        }
      }
    }, 1000)
  }

  renderUsers = () => {
    if (this.state.users) {
      return this.state.users.map(user => {
        if (user.id === this.state.users[0].id){
          return (
            <Segment compact key={this.generateRandToken()}>
              <Label size='big' color='yellow' image>
                <img src={user.avatar} />
                {user.username}
                <Label.Detail>host</Label.Detail>
              </Label>
            </Segment>
          )
        } else {
          return (
            <Segment compact key={this.generateRandToken()}>
              <Label size='big' color='blue' image>
                <img src={user.avatar} />
                {user.username}
                <Label.Detail>user</Label.Detail>
              </Label>
            </Segment>
          )
        }
      })
    }
  }

  renderYoutube = () => {

      if (this.state.currentTime!==null || (this.props.UsersReducer.user.id === this.state.users[0].id)) {
      // if (this.state.currentTime!==null && this.state.users) {
        const opts = {
          height: window.innerHeight/1.7,
          width: window.innerWidth/2.7,
          playerVars: {
            autoplay: 1,
            fs: 1,
          }
        }
        return (<YouTube
                videoId={this.state.currentVideo.url}
                opts={opts}
                onReady={this._onReady}
                onPause={this._onPause}
                onPlay={this._onPlay}
                onStateChange={this._onStateChange}
                onEnd={this._onEnd}
                onError={this._onError}
              />)
      } else {
        setTimeout( () => {
          this.renderYoutube()
        }, 1000)
      }
  }

  _onReady = (e) => {
    this.setState({youtubePlayer: e})
    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
      this.hostLoop()
    } else {
      this.userLoop()
    }
  }

  _onEnd = (e) => {
    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
      deleteVideo(this.state.currentRoomId,this.state.currentVideo.id)
    }
  }

  _onError = (e) => {
    if (this.state.videos.length===0){
      this.handleOpen()
    }
  }

  _onPause = (e) => {
    console.log(this.state.roomSubscription)
    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
      this.state.roomSubscription.send({title: 'pause'})
    }
  }

  _onPlay = (e) => {
    if (this.props.UsersReducer.user.id === this.state.users[0].id) {
      this.state.roomSubscription.send({title: 'play'})
    }
  }

  render(){
    return (
      <Sidebar.Pushable style={{ background: '#201c2b', height: '100vh' }} as={Segment}>
        <Sidebar style={{ background: '#17111e', width: '15vw' }} as={Menu} animation='overlay' direction='right' icon='labeled' inverted vertical visible>
          <Menu.Item style={{height: window.innerHeight/4 }}>
              <Image centered size='small' circular src={this.props.UsersReducer.user.avatar} />
            <Header style={{marginTop: '1vh'}} size='huge' inverted as='h1'>
              <p><Header.Content>{this.props.UsersReducer.user.username}</Header.Content></p>
            </Header>
          </Menu.Item>
          <Menu.Item style={{height: window.innerHeight/4 }}>
            <Header inverted as='h1' icon textAlign='center'>
              <Header.Content style={{marginTop: '3vh'}}>Current Room<p>{this.state.currentRoom ? this.state.currentRoom.name : null}</p></Header.Content>
              <Image centered src='http://www.entypo.com/images/tv.svg' style={{ height: '10vh', width: '10vw' }} />
            </Header>
          </Menu.Item>
          <Menu.Item style={{height: window.innerHeight/4 }} href="/rooms" name="Rooms" active={this.props.location.pathname}>
            <Header inverted as='h1' icon textAlign='center'>
              <Header.Content style={{marginTop: '3vh'}}>Rooms</Header.Content>
              <Image centered src='http://www.entypo.com/images/list.svg' style={{ height: '15vh', width: '15vw' }} />
            </Header>
          </Menu.Item>
          <Menu.Item style={{height: window.innerHeight/4 }} to="/logout" name="Logout" onClick={()=>this.props.logOut()}>
            <Image centered src='http://www.entypo.com/images/log-out.svg' style={{marginTop: '3vh', height: window.innerHeight/6.8 }} />
          </Menu.Item>
        </Sidebar>

          <Sidebar.Pusher>
            <Segment basic>
                <Modal
                  open={this.state.modalOpen}
                  onClose={this.handleClose}
                  basic
                  size='small'
                >
                  <Header icon='play circle' content='Queue is empty' />
                    <Modal.Content>
                      <h3>The Queue is empty, paste a youtube video url below to get started!</h3>
                    </Modal.Content>
                  <Modal.Actions>
                    <Button color='green' onClick={this.handleClose} inverted>
                      <Icon name='checkmark' /> Got it
                    </Button>
                  </Modal.Actions>
                </Modal>
              <Grid celled='internally'>
                <Grid.Column style={{ textAlign: 'left', background: '#201c2b', height: '70vh', width: '40vw' }}>
                    {this.state.loaded&&this.state.videos ? this.renderYoutube() : null}
                  <SendVideo
                    youtubeInput={this.state.youtubeInput}
                    youtubeInputUrl={this.youtubeInputUrl}
                    handleYoutubeFetch={this.handleYoutubeFetch}
                  />
                </Grid.Column>
                <Grid.Column style={{ textAlign:'left', background: '#201c2b', height: '70vh', width: '25vw' }}>
                  <Segment style={{ background: '#19171c', whiteSpace: 'wrap',   wordWrap: 'break-word', height: '58vh', overflowY: 'auto', overflowX: 'hidden' }} padded='very'>
                    {this.renderMessages()}
                  </Segment>
                  <SendMessage
                    message={this.state.message}
                    handleMessage={this.handleMessage}
                    messageInput={this.messageInput}
                  />
                </Grid.Column>
                <Grid.Column stretched style={{ textAlign:'center', background: '#201c2b', height: '70vh', width: '20vw' }}>
                    {this.renderUsers()}
                </Grid.Column>
                <Grid.Column style={{ borderRadius: '2vh', textAlign:'left', boxShadow: '0px -2px 2px rgba(34,34,34,0.6)', background: '#19171c', height: '30vh', width: '90vw' }}>
                  <Image.Group style={{ whiteSpace: 'nowrap', overflowY: 'hidden', overflowX: 'auto' }} >
                    {this.renderVideos()}
                  </Image.Group>
                </Grid.Column>
              </Grid>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
  }
}

const mapStateToProps = (reduxStoreState) => {
  return reduxStoreState
}

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch({ type: 'LOG_OUT' }, localStorage.clear())
  }
}

export default WithAuth(connect(mapStateToProps, mapDispatchToProps)(withRouter(Room)))
