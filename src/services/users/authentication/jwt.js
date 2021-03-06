import createHttpError from "http-errors";
import userModel from "../schema.js"
import { verifyJWT } from "./tokenGenerator.js";

const JWTAuth = async (req, res, next) => {
    if (!req.headers.authorization){
        next(createHttpError(404, 'provide a token pls'))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")
            const decodedToken = await verifyJWT(token)
        
            const user = await userModel.findById(decodedToken._id)
            if (user) {
                req.user = user
                next()
            } else {
                next(createHttpError(404, "smth wrong"))
            }
        } catch (error) {
            next(createHttpError(401, "smth wrong"))
        }
    }
}

export default JWTAuth

