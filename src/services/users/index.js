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


//missing routes
userRouter.post(
    "/avatar",
    JWtAuthenticateMiddle,
    parseFile.single("avatar"),
    async (req, res, next) => {
      try {
        const user = await userModel.findByIdAndUpdate(
          req.user._id,
          { avatar: req.file.path },
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
  userRouter.post(
    "/register",
    parseFile.single("avatar"),
    async (req, res, next) => {
      try {
        const newUser = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.file.path,
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
  userRouter.put(
    "/me",
    JWtAuthenticateMiddle,
    parseFile.single("avatar"),
    async (req, res, next) => {
      try {
        if (req.user) {
          const newUser = {
            ...req.user.toObject(),
            username: req.body.username,
            email: req.body.email,
            avatar: req.file?.path,
          };
          const user = await userModel.findByIdAndUpdate(req.user._id, newUser, {
            new: true,
          });
          res.send(user);
        }
      } catch (error) {
        next(error);
      }
    }
  );
  userRouter.post("/logout", JWtAuthenticateMiddle, async (req, res, next) => {
    try {
      req.user.refreshToken = null;
      await req.user.save();
      res.send();
    } catch (error) {
      next(error);
    }
  });
  
  userRouter.post("/account", async (req, res, next) => {
    try {
      const register = new userModel(req.body);
      const saveUser = await register.save();
      res.send({ saveUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  userRouter.post("/session", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.checkCredentials(email, password);
      if (user) {
        const { accessToken, refreshToken } = await JWtAuthenticate(user);
        res.send({ accessToken, refreshToken });
      } else {
        next(
          createHttpError(401, "credentials are not ok check again correctly")
        );
      }
    } catch (error) {
      next(error);
    }
  });
  
  userRouter.get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  userRouter.get(
    "/googleRedirect",
    passport.authenticate("google"),
    async (req, res, next) => {
      try {
        console.log("user", req.user);
        res.redirect("http://localhost:3000/main");
      } catch (error) {
        next(error);
      }
    }
  );
  
  userRouter.get("/me", JWtAuthenticateMiddle, async (req, res, next) => {
    try {
      const userData = req.user;
      if (userData) {
        res.send(userData);
      }
    } catch (error) {
      next(error);
    }
  });
  userRouter.put("/me", JWtAuthenticateMiddle, async (req, res, next) => {
    try {
      if (req.user) {
        const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
          new: true,
        });
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  });
  userRouter.get("/:userId", JWtAuthenticateMiddle, async (req, res, next) => {
    console.log(req.params.userId);
    try {
      if (req.user) {
        console.log("sdfvdsfkjvbsdfkjb", req.user);
        const getUser = await userModel.findById(req.params.userId);
        //   console.log(getUser);
        res.send({ getUser });
      }
    } catch (error) {
      next(error);
    }
  });
  
  userRouter.get("/", JWtAuthenticateMiddle, async (req, res, next) => {
    console.log("sdcsdcsdcds-----", req.user);
    try {
      const users = await userModel.find({
        username: req.query.username,
      });
  
      res.send(users);
    } catch (error) {
      next(error);
    }
  });

export default userRouter