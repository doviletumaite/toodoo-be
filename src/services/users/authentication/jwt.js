import createHttpError from "http-errors";

const JWTAuth = async (req, res, next) => {
    if (!req.headers.authorization){
        next(createHttpError(404, 'provide a token pls'))
    } else {
        try {
            
        } catch (error) {
            next(createHttpError(401, "no token founded"))
        }
    }
}

export default JWTAuth