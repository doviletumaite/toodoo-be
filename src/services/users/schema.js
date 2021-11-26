import mongoose from 'mongoose'
import bcrypt from "bcrypt";

const {Schema, model} = mongoose

const userShema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: function() {return !Boolean(this.googleId)},
    },
    profilePicture: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      },
      bio: {
        type: String,
    },
      googleId: {
        type: String,
        required: function() {return !Boolean(this.password)}
      },
})

userShema.pre("save", async function () {
    const newUser = this
    const plainPassword = newUser.password
    if(newUser.isModified("password")){
        newUser.password = await bcrypt.hash(plainPassword, 11)
    }
})

userShema.methods.toJSON = function () {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    delete userObject.__v
    return userObject
}

userShema.statics.checkCredentials = async function (email, plainPassword){
    const user = await this.findOne({email})
    if(user) {
        const isPaswordMatch = await bcrypt.compare(plainPassword, user.password)
        console.log("isPaswordMatch",isPaswordMatch)
        if (isPaswordMatch) return user
        else return null
    }
    return null
}
export default model('user', userShema)