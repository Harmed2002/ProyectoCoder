import local from 'passport-local'; // Importo la estrategia
import GithubStrategy from "passport-github2";
import jwt from 'passport-jwt';
import passport from 'passport';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { userModel } from '../models/users.models.js';

// Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; // Para extraer el token de las cookies

const initializePassport = () => {

	// Se captura la info. de la cookie
	const cookieExtractor = req => {
		console.log(req.cookies);
		const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : {};
		console.log(token);
		return token;
	}

	// Creo la estrategia de JWT
	passport.use('jwt', new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromExtractors({cookieExtractor}), // El token va a venir desde cookieExtractor
		secretOrKey: process.env.JWT_SECRET // Palabra secreta de los tokens
	}, async(jwt_payload, done) => { // jwt_payload = info. del token (en este caso, datos del cliente)
		try {
			console.log(jwt_payload);
			return done(null, jwt_payload);

		} catch (error) {
			return done(error);
		}
	}))
	
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

	// Login con Github
	passport.use('github', new GithubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_SECRET_CLIENT,
		callbackURL: process.env.GITHUB_CALLBACK_URL
	}, async (accessToken, refreshToken, profile, done) => {
		
		try {
			const user = await userModel.findOne({ email: profile._json.email })
			if (user) {
				done(null, false)
			
			} else {
				const userCreated = await userModel.create({
					first_name: profile._json.name,
					last_name: " ",
					email: profile._json.email,
					age: 18, 
					password: createHash(profile._json.email + profile._json.name)
				});

				done(null, userCreated);
			}

		} catch (error) {
			done(error)
		}
	}))

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
