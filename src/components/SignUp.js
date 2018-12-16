import React from 'react';

const SignUp = (props) => {
  return (
    <form onSubmit={(e)=>props.handleSignUp(e)}>
        <label>
          Sign Up:
          <input type="text" value={props.signUpName} onChange={(e)=>props.signUpInput(e)} />
        </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default SignUp;
