import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { fetchRegister, loginUser } from '../actions/User.js'
import { Header, Image, Container, Grid, Divider, Button, Form, Segment, Message } from 'semantic-ui-react'
import video from './particle.mp4'

class Register extends Component {

  state = {
    username: '',
    password: '',
    bio: '',
    url: ''
  }

  handleChange = (e, semanticInputData) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  //Note: Semantic forms include preventDefault
  handleSubmit = (e) => {
    this.props.fetchRegister(this.state.username, this.state.password, this.state.bio, this.state.url)
    this.setState({ username: '', password: '', bio: '', url: '' })
  }

  render() {
    return this.props.registered ? (
      <Redirect to="/login"/>
    ) : (
      <Segment style={{ height: window.innerHeight }} placeholder>
        <Header as='h1' textAlign='left'>
          <Image
            circular src={this.state.url} /> Register your own ViewingParty account!
        </Header>
        <Grid
          columns={2}
          relaxed='very'
          stackable
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'
          >
          <Grid.Column>
          <Form
            onSubmit={this.handleSubmit}
            size="huge"
            key="huge"
            loading={this.props.authenticatingUser}
            error={this.props.failedRegister}
          >
            <Message error header={this.props.failedRegister ? this.props.error : null} />
            <Form.Input
              icon='user'
              iconPosition='left'
              label="Username"
              placeholder="username"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              type="password"
              label="Password"
              placeholder="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
              <Form.Input
                icon='picture'
                iconPosition='left'
                label="Image URL"
                placeholder="url"
                name="url"
                onChange={this.handleChange}
                value={this.state.url}
              />
              <Image
                verticalAlign='middle'
                src={this.state.url}
                size='small'
              />
                <Form.TextArea
                  label='Bio'
                  placeholder='Tell us more about you...'
                  onChange={this.handleChange}
                  value={this.state.bio}
                  type='bio'
                  name='bio'
                />
                <Button type="submit" size='huge' content='Register' primary />
          </Form>
          </Grid.Column>
          <Grid.Column verticalAlign='middle'>
            <Button as={ Link } to='/login' content='Login' icon='user' size='massive' />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    )
  }
}

// Destructuring the state of the reduxStoreState to avoid all the dots
const mapStateToProps = ({ UsersReducer: { authenticatingUser, failedLogin, error, loggedIn, failedRegister, registered } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn,
  failedRegister,
  registered
})

export default withRouter(connect(mapStateToProps, { fetchRegister, loginUser })(Register))
