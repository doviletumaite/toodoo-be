import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import JWTAuth from "./authentication/jwt.js";
import { JWTAuthenticate } from "./authentication/tokenGenerator.js";
import userModel from "./schema.js"

const userRouter = express.Router()

userRouter.post("/newaccount", async (req, res, next) => {
    try {
        const newUser = new userModel(req.body)
        const saveUser = await newUser.save()
        res.send({saveUser})
    } catch (error) {
        next(error)
    }
})

userRouter.post("/login",async (req, res, next) => {
    try {
        const { email, password} = req.body
        const user = await userModel.checkCredentials(email,password)
        if (user) {
            const {accessToken, refreshToken} = await JWTAuthenticate(user)
            res.send({accessToken, refreshToken})
        } else {
            next(createHttpError(401, "smth wrong with yours credentials"))
        }
    } catch (error) {
        next(error)
    }
})

userRouter.get("/googleLogin",passport.authenticate("google", { scope: ["profile", "email"] }));
userRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
    try {
        res.redirect("http://localhost:3000/showcase");  
    } catch (error) {
        next(error) 
    }
})

userRouter.get("/me", JWTAuth, async (req, res, next) => {
    try {
        const userData = req.user
        console.log("ciao")
        if(userData){
         res.send(userData)
        }
    } catch (error) {
        next(error) 
    }
})

export default userRouter