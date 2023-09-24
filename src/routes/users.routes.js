import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({ respuesta: "ok", mensaje: users });
  } catch (error) {
    res.status(400).send({ respuesta: "Error", mensaje: error });
  }
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (user) {
      res.status(200).send({ respuesta: "ok", mensaje: user });
    } else {
      res
        .status(404)
        .send({ respuesta: "error", mensaje: "usuario no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ respuesta: "Error", mensaje: error });
  }
});

userRouter.post("/", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const response = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
    });
    res.status(200).send({ respuesta: "ok", mensaje: response });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear usuario", mensaje: error });
  }
});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });
    if (user) {
      res.status(200).send({ respuesta: "OK", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error en actualizar usuario",
        mensaje: "User not Found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en actualizar usuario", mensaje: error });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).send({ respuesta: "OK", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error en eliminar usuario",
        mensaje: "User not Found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en eliminar usuario", mensaje: error });
  }
});

export default userRouter;
