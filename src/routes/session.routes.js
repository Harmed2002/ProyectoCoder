import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

// Configuramos el login de usuario
sessionRouter.post("/login", passport.authenticate('login'), async (req, res) => {
	try {
		// Si Passport no nos devuelve el usuario, hubo error
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

		// Se crea una cookie indicando que el usuario está autenticado
		res.cookie("authenticated", "true", { maxAge: 60 * 60 * 1000 }); // Expira en 1 hora
		res.cookie("username", req.session.user.first_name, { maxAge: 60 * 60 * 1000 }); // Establece la cookie con el nombre de usuario


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
			return res.status(400).send({ mensaje: "Usuario ya existe" });
		}

		res.status(200).send({ mensaje: "Usuario registrado" })

	} catch (error) {
		res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
	}
});

// Configuramos el registro de usuario con Github
sessionRouter.get("/github", passport.authenticate("github", {scope: ["user:email"],}), async (req, res) => {
		res.status(200).send({ mensaje: 'Usuario registrado con Github' })
	}
);

// Configuramos el inicio de sesión con Github
sessionRouter.get("/githubCallback", passport.authenticate("github", {scope: ["user:email"],}), async (req, res) => {
		req.session.user = req.user;
		res.status(200).redirect('/home');
	}
);

// Configuramos el logout de usuario
sessionRouter.get("/logout", async (req, res) => {
	if (req.session.login) {
		req.session.destroy(); // Destruyo session
		res.clearCookie('username'); // Elimina la cookie del nombre de usuario
		res.clearCookie('authenticated'); // Elimina la cookie del nombre de usuario
	}

	res.status(200).send({ respuesta: "Usuario deslogueado" });
});

export default sessionRouter
