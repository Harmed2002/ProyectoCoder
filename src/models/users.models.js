import { Schema, model } from "mongoose";
import { cartModel } from "./carts.models.js";
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
	cart: {
		type: Schema.Types.ObjectId,
		ref: 'carts'
	}
});

userSchema.plugin(paginate); // Implemento el método paginate en el Schema

// Procedimiento para antes de guardar el user
userSchema.pre("save", async function (next) {
	try {
		const newCart = await cartModel.create({}); // Creo el carrito vacío
		this.cart = newCart._id; // Le paso el id al modelo userSchema

	}	catch (error) {
		next(error);
	}
});

// Parametro 1: nombre de coleccion - parametro 2: schema
export const userModel = model("users", userSchema);
