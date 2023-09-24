import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
            id_prod: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }, ],
        default: function() {
            return [];
        },
    },
});

// manejo de populate en el schema para obtener la busqueda del objeto
cartSchema.pre('findOne', function(){
    this.populate('products.id_prod')
})


export const cartModel = model("carts", cartSchema);