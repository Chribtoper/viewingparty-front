import React from 'react';

const CreateRoom = (props) => {
  return (
    <form onSubmit={(e)=>props.createNewRoom(e)}>
        <label>
          Create new room dawg:
          <input type="text" value={props.roomName} onChange={(e)=>props.setRoomName(e)} />
        </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default CreateRoom;
