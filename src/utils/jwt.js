import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
	/*	
		Param 1: objeto asociado al token, 
		param 2: clave privada para el cifrado, 
		param 3: tiempo de expiración
	*/
	const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' });
	// console.log("TOKEN", token);

	return token;

}

// generateToken(
// 	{
// 		"_id": "651b37cb983c5b09418ca5b1",
// 		"first_name": "Sandra",
// 		"last_name": "Valbuena",
// 		"age": "46",
// 		"email": "sandra@mail.com",
// 		"password": "$2b$17$b8fvZEjPeklYSle6GQrjLOqie6TJqqIkVZ/5WwySJ28OF.PkxDJyi",
// 		"rol": "user"
// 	})

export const authToken = (req, res, next) => {
	// Consulto el header para obtener el token
	const authHeader = req.header.Authorization;

	// Verifico que el header tenga el item Authorization
	if (!authHeader) {
		return res.status(401).send({error: 'Usuario no autenticado.'});
	}

	const token = authHeader.split(' ')[1] // Obtengo la parte del token y descarto el Bearer

	// Verifico si el token es válido
	jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
		if (error) {
			return res.status(403).send({error: 'Usuario no autorizado. Token inválido.'}); // 403: «El acceso a ese recurso está prohibido».
		}
	})

	// Si el usuario es válido
	req.user = credential.user;
	next();
}