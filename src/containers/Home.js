import React, { Component } from 'react';
import Login from '../components/Login.js'
import SignUp from '../components/SignUp.js'
import Rooms from '../components/Rooms.js'

const USERS = "http://localhost:3000/users"

export default class Home extends Component {

  state = {
    loginName: '',
    signUpName: '',
    user_id: null,
    signed_in: false
  }

  handleSignUp = (e) => {
    e.preventDefault()
    console.log(this.state.signUpName)
    const newName = this.state.signUpName
    fetch(USERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newName
      })
    })
    .then(r=>r.json())
    .then(response => {
      console.log(`New Response: ${response}`)
    })
  } // signs you up

  handleLogin = (e) => {
    e.preventDefault()
    console.log(this.state.loginName)
    const name = this.state.loginName
    fetch(USERS)
    .then(r=>r.json())
    .then(r => {
      console.log(`New Response: ${r}`)
      const user = r.find(user => name===user.name)
      if (user.name===name){
        this.setState({
          signed_in: true,
          user_id: user.id
        })
      }
    })
  } // logs you in

  loginInput = (e) => {
    const input = e.target.value
    this.setState({loginName: input})
  } // deals with the login input on change

  signUpInput = (e) => {
    const input = e.target.value
    this.setState({signUpName: input})
  } // deals with the signup input on change

  roomsOrLogin = () => {
    switch(this.state.signed_in) {
      case true:
        return <Rooms
                  user_id={this.state.user_id}
                  signed_in={this.state.signed_in}
                />
      case false:
        return <>
              <SignUp
                  signUpName={this.state.signUpName}
                  signUpInput={this.signUpInput}
                  handleSignUp={this.handleSignUp}
                />
              <Login
                  loginName={this.state.loginName}
                  loginInput={this.loginInput}
                  handleLogin={this.handleLogin}
              />
              </>
    }
  } // REFACTOR PLS conditional rendering for login/signup or showing all rooms


  render(){
    return (
      <div>
        {this.roomsOrLogin()}
      </div>
    )
  }

}
