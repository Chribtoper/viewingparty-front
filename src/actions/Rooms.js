export const /*FUNCTION*/ fetchRooms = () => {
  return /*FUNCTION*/ (dispatch) => { //thunk
    // console.log(process.env.REACT_APP_API_ENDPOINT)
    return new Promise ((resolve, reject) => {
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
                 resolve()
               })
    })
  }
}

export const deleteVideo = (roomId, videoId) => {
    return new Promise ((resolve, reject) => {
      debugger
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/youtubes/${videoId*1}`, {
             method: "DELETE",
             headers: {
               Authorization: `Bearer ${localStorage.getItem('jwt')}`,
               "Content-Type": "application/json"
             }
               })
              .then(()=>{
                resolve()
              })
    })
}

export const patchVideo = (roomId, url) => {
    return new Promise ((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId*1}`, {
             method: "PATCH",
             headers: {
               Authorization: `Bearer ${localStorage.getItem('jwt')}`,
               "Content-Type": "application/json"
             },
             body: JSON.stringify({
               url: `https://img.youtube.com/vi/${url}/hqdefault`
             })
               })
              .then(()=>{
                resolve()
              })
    })
}
