import React from 'react';

const SendMessage = (props) => {
  return (
    <form onSubmit={(e)=>props.handleMessage(e)}>
        <label>
          Send Message:
          <input type="text" value={props.message} onChange={(e)=>props.messageInput(e)} />
        </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default SendMessage;
