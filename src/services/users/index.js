import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import JWTAuth from "./authentication/jwt.js";
import { JWTAuthenticate, verifyJWT } from "./authentication/tokenGenerator.js";
import userModel from "./schema.js"
import { parseFile } from "./cloudinary.js";
import googleStrategy from "./authentication/oauth.js";

const userRouter = express.Router()

const frontendUrl = process.env.FRONT_END_URL
userRouter.post("/newaccount", async (req, res, next) => {
    try {
        const newUser = new userModel(req.body)
        const saveUser = await newUser.save()
        res.send({saveUser})
    } catch (error) {
        next(error)
    }
})
userRouter.get("/", JWTAuth, async (req, res, next) => {
  try {
    const user = await userModel.find({
      username: req.query.username,
    }) ;
    res.send(user);
  } catch (error) {
    next(error);
  }
});
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
      const user  = req.user
  console.log("user in redirect request",user)
   const decodedToken = await verifyJWT(user.tokens.accessToken)
   console.log("decodedToken._id",decodedToken._id)
   console.log(res)
   res.redirect(`https://toodoo-fe.vercel.app/showcasepre` )
    //  res.redirect(frontendUrl +`/showcasepre/${decodedToken._id}/${user.tokens.accessToken}` )
        console.log(res)
    } catch (error) {
        next(error) 

    }
})

userRouter.get("/me", JWTAuth, async (req, res, next) => {
    try {
        const userData = req.user
        if(userData){
         res.send(userData)
        }
    } catch (error) {
        next(error) 
    }
})


userRouter.post("/avatar", JWTAuth,
    parseFile.single("avatar"),
    async (req, res, next) => {
      try {
        const user = await userModel.findByIdAndUpdate(
          req.user._id,
          { profilePicture: req.file.path },
          {
            new: true,
          }
        );
        res.send(user);
      } catch (error) {
        next(error);
      }
    }
  );
  userRouter.post("/register",parseFile.single("avatar"),
    async (req, res, next) => {
      try {
        console.log("file", req.body)
        const newUser = {
         ...req.body,
          profilePicture: req.file.path,
        };
        const register = new userModel(newUser);
        const { username, email, avatar } = await register.save();
        res.send({ username, email, avatar });
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
 
  userRouter.get("/",JWTAuth, async (req, res, next) => {
    try {
        const users = await userModel.find({})
        res.send(users)
    } catch (error) {
        next(error)
    }
})
userRouter.get("/:id", async (req, res, next) => {
  try {
      const user = await userModel.findById(req.params.id)
      console.log("uuuseeer",user)
      res.send(user)
  } catch (error) {
      next(error)
  }
})
  userRouter.put("/meAvatar", JWTAuth,
    parseFile.single("picture"),
    async (req, res, next) => {
      try {
        if (req.user) {
          const userId = req.user._id
          console.log("userId",userId)
          const user = await userModel.findByIdAndUpdate(userId, {
            ...req.body,
            profilePicture: req.file.path,
        },
        {new: true})
         await user.save()
          res.send(user);
        }
      } catch (error) {
        console.log(error)
        next(error);
      }
    }
  )

  userRouter.post("/logout", JWTAuth, async (req, res, next) => {
    try {
      req.user.refreshToken = null;
      console.log("refresh in logout",req.user.refreshToken )
      await req.user.save();
      res.send("logged out");
    } catch (error) {
      next(error);
    }
  });
  

  userRouter.put("/me", JWTAuth, async (req, res, next) => {
    try {
      if (req.user) {
        const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
          new: true,
        });
        console.log("bio", user)
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  });
  userRouter.get("/:userId", JWTAuth, async (req, res, next) => {
    console.log(req.params.userId);
    try {
      if (req.user) {
        const getUser = await userModel.findById(req.params.userId);
        res.send({ getUser });
      }
    } catch (error) {
      next(error);
    }
  });
  


export default userRouter