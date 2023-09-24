import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "user",
  },
});

userSchema.plugin(paginate); // paginate

// Parametro 1: nombre de coleccion - parametro 2: schema
export const userModel = model("users", userSchema);
