// import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
	const token = jwt.sign({ user }, "coderhouse2023", { expiresIn: '12h' }); // Param 1: objeto asociado al token, param 2: clave privada para el cifrado, param 3: tiempo de expiración
	// console.log("TOKEN", token);

}

generateToken(
	{
		"_id": "651b37cb983c5b09418ca5b1",
		"first_name": "Sandra",
		"last_name": "Valbuena",
		"age": "46",
		"email": "sandra@mail.com",
		"password": "$2b$17$b8fvZEjPeklYSle6GQrjLOqie6TJqqIkVZ/5WwySJ28OF.PkxDJyi",
		"rol": "user"
	})