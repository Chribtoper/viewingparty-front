import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react'

const CreateRoom = (props) => {
  return (
    <Form onSubmit={(e)=>props.createNewRoom(e)}>
        <label>
          Create new room dawg:
          <input type="text" value={props.roomName} onChange={(e)=>props.setRoomName(e)} />
        </label>
      <input type="submit" value="Submit" />
    </Form>
  )
}

export default CreateRoom;
