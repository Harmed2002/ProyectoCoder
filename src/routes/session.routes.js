import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

// Configuramos el login de usuario
sessionRouter.post("/login", passport.authenticate('login'), async (req, res) => {
	try {
		// Si passport no nos devuelve el usuario, hubo error
		if (!req.user) {
			return res.status(401).send({ mensaje: "Usuario inválido" });
		}

		// Asigno los campos de los datos de usuario
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			email: req.user.email
		}

		res.status(200).send({ payload: req.user })

	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
});

// Configuramos el registro de usuario
sessionRouter.post("/register", passport.authenticate('register'), async (req, res) => {
	try {
		// Si passport no nos devuelve el usuario, hubo error
		if (!req.user) {
			return res.status(400).send({ mensaje: "Usuario ya registrado" });
		}

		res.status(200).send({ mensaje: "Usuario registrado" })

	} catch (error) {
		res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
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
