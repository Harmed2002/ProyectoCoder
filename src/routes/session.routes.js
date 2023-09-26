import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		if (req.session.login) {
			res.status(200).send({ respuesta: "Login ya existente" });
		}

		const user = await userModel.findOne({ email: email });
		// console.log("user", user)

		if (user) {
			if (user.password == password) {
				req.session.login = true;

				// Añadir una cookie indicando que el usuario está autenticado
				res.cookie("authenticated", "true", { maxAge: 60 * 60 * 1000 }); // Expira en 1 hora
				res.cookie("username", user.first_name, { maxAge: 60 * 60 * 1000 }); // Establece la cookie con el nombre de usuario

				res.status(200).send({ respuesta: "Login validado", mensaje: user });
			} else {
				res.status(401).send({ respuesta: "Contraseña no válida", mensaje: password });
			}
		} else {
			res.status(404).send({ respuesta: "Este Usuario no existe!", mensaje: user });
		}
	} catch (error) {
		res.status(400).send({ respuesta: "Error en login", mensaje: error });
	}
});

sessionRouter.get("/logout", async (req, res) => {
	if (req.session.login) {
		req.session.destroy(); // Destruyo session
		res.clearCookie('username'); // Elimina la cookie del nombre de usuario
		res.clearCookie('authenticated'); // Elimina la cookie del nombre de usuario

	}
	res.status(200).send({ respuesta: "Usuario deslogueado" });
});

export default sessionRouter
