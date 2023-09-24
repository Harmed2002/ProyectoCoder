import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router();

// Obtener carrito segun id
cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      res.status(200).send({ respuesta: "Ok", mensaje: cart });
    } else {
      res.status(404).send({
        respuesta: "Error en consultar carrito",
        mensaje: "No encontrado",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "error en consultar carrito", mensaje: error });
  }
});

// Crear carrito
cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({});
    res.status(200).send({ respuesta: "ok", mensaje: cart });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear carrito", mensaje: error });
  }
});

// Agregar en carrito:id el producto con id/pid
cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex((item) => item.id_prod == pid);
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en agregar producto Carrito",
          mensaje: "Produt Not Found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error en agregar producto Carrito",
        mensaje: "Cart Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error en agregar producto Carrito", mensaje: error });
  }
});

// Eliminar productos del carrito
cartRouter.delete("/:cid ", async (req, res) => {
  const { cid } = req.params;

  try {
    await cartModel.findByIdAndUpdate(cid, { products: [] });
    res.status(200).send({ respuesta: "Ok", mensaje: "Carrito vacio" });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en eliminar cart", mensaje: error });
  }
});

// Eliminar producto especifico del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);
      if (prod) {
        cart.products = cart.products.filter(
          (item) => item.id_prod._id.toString() !== pid
        );
      }
    }
    const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
    res.status(200).send({ respuesta: "OK", mensaje: respuesta });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error al obtener el cart id", mensaje: error });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const productsData = req.body.products;

  if (!Array.isArray(productsData)) {
    return res
      .status(400)
      .send({ respuesta: "Error", mensaje: "Se esperaba un arreglo de productos" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = productsData;

    const respuesta = await cart.save();

    res.status(200).send({ respuesta: "OK", mensaje: respuesta });
  } catch (error) {
    res.status(404).send({ respuesta: "Error", mensaje: error.message });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);
      if (prod) {
        const index = cart.products.findIndex(
          (prod) => prod.id_prod._id.toString() === pid
        );
        if (index !== -1) {
          cart.products[index].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
      }
      await cart.save();
    }

    res.status(200).send({ respuesta: "OK", mensaje: "Carrito actualizado! :)" });
  } catch (error) {
    res
      .status(error.message.includes("No encontrado :S") ? 404 : 400)
      .send({ respuesta: "Error", mensaje: error.message });
  }
});

export default cartRouter;
