export const name = "SEND_MESSAGE"
export const receiveEventName = "RECEIVE_MESSAGE"

export const handler = (socket,payload) => {
    const {conversationId, text} = payload
    if(conversationId){
        console.log(payload)
        const message = {
          text,
          sender: socket.user
        }
        socket.to(conversationId).emit(receiveEventName, message)
        // await new Message({text, conversationId, sender:socket.user.id}).save()
    } 
//   console.log(payload)
}
