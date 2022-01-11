
let users = []
const addUser = (userID, socketId) => {
  !users.some(user=>user.userID === userID) &&
  users.push({userID, socketId})
}
const onConnection = (io, socket) => {

  
    let users = []
    io.on("connection", (socket) => {
        socket.on("addUser", userID => {
          addUser(userID, socket.id)
          io.emit("getUsers", users)
          console.log(users)
        })
    })
    
}

export default onConnection