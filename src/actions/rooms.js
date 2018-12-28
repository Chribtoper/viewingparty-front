export const /*FUNCTION*/ fetchRooms = () => {
  return /*FUNCTION*/ (dispatch) => { //thunk
    // console.log(process.env.REACT_APP_API_ENDPOINT)
    dispatch({ type: 'FETCH_ROOMS' })
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms`, {
           method: "GET",
           headers: {
             Authorization: `Bearer ${localStorage.getItem('jwt')}`,
             "Content-Type": "application/json"
           }
             })
             .then(r => r.json())
             .then(rooms => {
               dispatch({ type: 'FETCH_ROOMS', payload: rooms })
             })
  }
}
