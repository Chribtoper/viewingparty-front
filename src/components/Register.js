import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { loginUser } from '../actions/user.js'
import { fetchRooms } from '../actions/rooms.js'
import { Header, Image, Container, Grid, Divider, Button, Form, Segment, Message } from 'semantic-ui-react'

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
    this.props.loginUser(this.state.username, this.state.password)
    this.setState({ username: '', password: '' })
  }

  render() {
    return this.props.loggedIn ? (
      <Redirect to="/login"/>
    ) : (
      <Segment placeholder>
        <Header as='h1' textAlign='center'>      
          <Image
            circular src={this.state.url} /> Register an account!
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
            error={this.props.failedLogin}
          >
            <Message error header={this.props.failedLogin ? this.props.error : null} />
            <Form.Input
              icon='user'
              iconPosition='left'
              label="username"
              placeholder="username"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              type="password"
              label="password"
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
                  label='bio'
                  placeholder='Tell us more about you...'
                  onChange={this.handleChange}
                  value={this.state.bio}
                  type='bio'
                  name='bio'
                />
                <Button type="submit" size='huge' content='Register' primary />
          </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

// Destructuring the state of the reduxStoreState to avoid all the dots
const mapStateToProps = ({ usersReducer: { authenticatingUser, failedLogin, error, loggedIn } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn
})

export default withRouter(connect(mapStateToProps, { loginUser, fetchRooms })(Register))
