import local from 'passport-local'; // Importo la estrategia
// import passport, { initialize, use } from 'passport';
import passport from 'passport';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { userModel } from '../models/users.models.js';

// Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;

const initializePassport = () => {
	
	// Registro de usuario
	passport.use('register', new LocalStrategy(
		{ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
		
			const { first_name, last_name, email, age } = req.body;

			try {
				const user = await userModel.findOne({ email: email });

				// Caso de error: usuario existe, no puede registrarse
				if (user) {
					return done(null, false);
				}

				// Si no existe, obtenemos el hash y creamos el usuario
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
				// Busco el usuario por email
				const user = await userModel.findOne({ email: username });

				// Caso de error: usuario no existe, no puede loguearse
				if (!user) {
					return done(null, false);
				}

				// Si el usuario existe, valido el password
				if (validatePassword(password, user.password)) {
					return done(null, user);
				}

				// Si el usuario existe, pero el password es incorrecto, no puede loguearse
				return done(null, false);

			} catch (error) {
				return done(error);
			}
		}
	))

	// Se inicializa la sesión del usuario
	passport.serializeUser((user, done) => {
		done(null, user._id);
	})

	// Se elimina la sesión del usuario
	passport.deserializeUser(async (id, done) => {
		const user = await userModel.findById(id); // Obtenemos el usuario

		done(null, user);
	})
}

export default initializePassport
