import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"
import { JWTAuthenticate } from "./tokenGenerator.js";
import userModel from "../schema.js"

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/user/googleRedirect`
}, async (accessToken, refreshToken, googleProfile, next) => {
    try {
        const user = await userModel.findOne({googleId: googleProfile.id})
        console.log(user)
        if(user) {
            const tokens = await JWTAuthenticate(user)
            next(null, {tokens} ,{user})
        } else {
            const newUser = {
                username: googleProfile.name.givenName,
                email: googleProfile.emails[0].value,
                profilePicture: googleProfile.photos[0].value,
                googleId: googleProfile.id
            }
            const createdUser = new userModel(newUser)
            const savedUser = await createdUser.save()
            const tokens = await JWTAuthenticate(savedUser)
            next(null, {tokens}, {savedUser} )
        }
    } catch (error) {
        next(error)
    }
})

passport.serializeUser(function(data, next){
    next(null, data)
})

export default googleStrategy