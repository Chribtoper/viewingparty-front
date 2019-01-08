import React from 'react'
import { connect } from 'react-redux'
import { Card, Image } from 'semantic-ui-react'
import WithAuth from '../hocs/WithAuth.js'

const Profile = ({ avatar, username, bio }) => (
  <Card>
    <Image src={avatar} />
    <Card.Content>
      <Card.Header>{username}</Card.Header>
      <Card.Description>{bio}</Card.Description>
    </Card.Content>
  </Card>
)

const mapStateToProps = ({ UsersReducer: { user: { avatar, username, bio } } }) => ({
  avatar,
  username,
  bio
})

export default WithAuth(connect(mapStateToProps)(Profile))
