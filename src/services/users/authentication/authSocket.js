// import JWTAuth from "./jwt.js";
// import userModel from "../schema.js"
// import { verifyJWT } from "./tokenGenerator.js";

// const authorizeUser = async (token) => {
//     console.log(token)
//     const decodedToken = await verifyJWT(token)

//     const user = await userModel.findById(decodedToken._id)
   
  
//     console.log("user",user)
//     if(user){
//         return user
//     } else {
//         throw new Error ("user not found")
//     }
// }

// const authorizeSocket = (socket, next) => {
//     const user = authorizeUser(socket.handshake.headers.authorization)
//     socket.user = user 
//   next();
// };
// export default authorizeSocket;