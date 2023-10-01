import local from 'passport-local'; // Importo la estrategia
import passport, { initialize } from 'passport';
import { createHash, validatePassword } from '../utils/bcrypt';
import { userModel } from '../models/users.models';

// Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;

const initializePassport = () => {
	// Registro de usuarios
	passport.use('register', new LocalStrategy(
		{ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
			// Registro de usuario
			const { first_name, last_name, email, age } = req.body;

			try {
				const user = await userModel.findOne({ email: email });

				// Caso de error: usuario existe, no puede registrarse
				if (user) {
					return done(null, false);
				}

				// Si no existe, creamos el usuario
				const passwordHash = createHash(password); // Encriptamos la contraseña
				const userCreated = await userModel.create({
					first_name : first_name, 
					last_name : last_name, 
					age : age, 
					email : email, 
					password: passwordHash 
				})

				return done(null, userCreated);

			} catch (error) {
				return done(error);
			}
		}
	))

	// Login de usuario
	passport.use('login', new LocalStrategy(
		{ usernameField: 'email' }, async (username, password, done) => {
			try {
				const user = await userModel.findOne({ email: username });

				// Caso de error: usuario no existe, no puede loguearse
				if (!user) {
					return done(null, false);
				}

			} catch (error) {
				return done(error);
			}
		}
	))
}
