import Jwt from "jsonwebtoken";

export const JWTAuthenticate = async (user) => {
   const accessToken = await generateJWT({_id: user._id})
   const refreshToken  = await generateRefreshJWT({_id: user._id})
   console.log("_id",{_id: user._id})
   return {accessToken, refreshToken}
}

const generateJWT = (payload) => 
  new Promise ((resolve, reject) =>
  Jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1 day"},
  (err, token) => {
      console.log("payload",payload )
      if(err) {
          reject(err)
      } else {
          resolve(token)
      }
  }) )
 
  const generateRefreshJWT = (payload) =>
  new Promise ((resolve, reject) => 
  Jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:"10m"},
  (err, token) => {
    if(err) reject(err)
    else resolve(token)
       } ))  

       export const verifyJWT = (token) =>
       new Promise ((res, rej) => 
       Jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
           console.log("decodedToken",decodedToken)
           console.log("ciao")
           if(err) rej(err)
           else res(decodedToken)
       })
       )
  
 