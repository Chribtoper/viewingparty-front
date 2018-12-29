const defaultState = {
  user: null,
  loggedIn: false,
  authenticatingUser: false,
  failedLogin: false,
  failedRegister: false,
  registered: false,
  error: null,
  rooms: []
}

const usersReducer = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      //action.payload { username: 'Chandler Bing', bio: 'user bio', avatar: 'a url' }
      return { ...state, user: action.payload, loggedIn: true, authenticatingUser: false }
    case 'AUTHENTICATING_USER': // tells the app we're fetching
      return { ...state, authenticatingUser: true }
    case 'AUTHENTICATED_USER':
      return { ...state, authenticatingUser: false }
    case 'FAILED_LOGIN': // for error handling
      return {
        ...state,
        failedLogin: true,
        error: action.payload,
        authenticatingUser: false
      }
    case 'FAILED_REGISTER':
      return {
        ...state,
        failedRegister: true,
        error: action.payload,
        authenticatingUser: false,
        registered: false
      }
    case 'REGISTERED':
      return {
        ...state,
        failedRegister: false,
        error: null,
        authenticatingUser: false,
        registered: true
      }
    case 'RESET_REGISTERED':
      return {
        ...state,
        registered: false
      }
    case 'LOG_OUT':
      return {
        ...state,
        user: null,
        loggedIn: false,
        authenticatingUser: false,
        failedLogin: false,
        error: null
      }
    case 'FETCH_ROOMS':
      return {
        ...state,
        rooms: action.payload
      }
    default:
      return state
  }
}

export default usersReducer
