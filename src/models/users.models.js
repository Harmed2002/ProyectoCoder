import { Schema, model } from "mongoose"
import  paginate  from "mongoose-paginate-v2"

const userSchema = Schema ({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.plugin(paginate)

export const userModel = model('users', userSchema)