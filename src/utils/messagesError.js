import passport from "passport";

// Función para retornar errores en las estrategias de Passport
export const passportError = (strategy) => {
    // Strategy: se envía local, github o jwt
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error); // Que la función que me llame maneje como va a responder ante mi error
            }

            // Verifico si el usuario existe
            if (!user) {
                // Verifico el tipo de message devuelto, si es string u objeto
                return res.status(401).send({error: info.messages ? info.messages : info.toString()})
            }

            req.user = user;
            next();

        }) (req, res, next) // Esto es porque me va a llamar un middleware
    }
}

// Recibo un rol y establezco la capacidad del usuario
export const authorization = (rol) => { // Por ejemplo, rol = 'Admin' desde ruta 'CrearProducto'
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({error: 'User no autorizado'});
        }

        // Verifico si el rol del usr es el mismo que el enviado en el parámetro
        // if (req.user.user[0].rol != rol) {
        if (req.user.user.rol != rol) {
            return res.status(403).send({error: 'El usuario no tiene los permisos necesarios'});
        }

        next();

    }
}