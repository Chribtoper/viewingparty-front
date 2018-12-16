import React from 'react';

const Login = (props) => {
  return (
    <form onSubmit={(e)=>props.handleLogin(e)}>
        <label>
          Login:
          <input type="text" value={props.loginName} onChange={(e)=>props.loginInput(e)} />
        </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default Login;
