import React from 'react';
import { Label, Input, Button, Form } from 'semantic-ui-react'

const CreateRoom = (props) => {
  return (
    <Form onSubmit={(e)=>props.createNewRoom(e)}>
    <Label size='massive' pointing='below' color='white'>Create Room</Label>
          <Form.Input
            focus
            size='big'
            action='Create'
            icon='conversation'
            iconPosition='left'
            type="createRoom"
            placeholder="Enter a room name..."
            name="createRoom"
            onChange={(e)=>props.setRoomName(e)}
            value={props.roomName}
          />
    </Form>
  )
}

export default CreateRoom;
