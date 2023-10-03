import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.js"; // Archivo de estrategia

import path from "path";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import session from "express-session";

// Routes
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import messageRouter from "./routes/messages.routes.js";
import sessionRouter from "./routes/session.routes.js";

// Models
import { cartModel } from "./models/carts.models.js";
import { productModel } from "./models/products.models.js";
import { messagesModel } from "./models/messages.models.js";
import { userModel } from "./models/users.models.js";

const app = express();
const PORT = 8000;

// Conexión a la BD con Mongoose DB
mongoose
	.connect(process.env.MONGO_URL)
	.then(async () => { console.log("DB is connected") })
	.catch(() => console.log("Error in connection"));

// const db = mongoose.connection;
// db.useDb = "ecommerce";
// console.log(db);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE)); // Para firma de Cookie

// Auth
export function requireAuth(req, res, next) {
	if (req.session.login) {
		next(); // Si el usuario está autenticado permite el acceso
	} else {
		res.redirect("/login"); // Si no está autenticado, redirige al login
	}
};

// Middleware de sesión
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: {
				useNewUrlParser: true, // Establezco que la coneción al cluster es mediante URL
				useUnifiedTopology: true, // Sirve para conectarnos al controlador actual de BD, manejo de de clusters de manera dinámica
		},
		ttl: 864000, // Duración de la sesión en la BD (en segundos)
		}),
		secret: process.env.SESSION_SECRET,
		resave: false, // Fuerzo a que intente guardar aunque no tenga modificaciones en los datos
		saveUninitialized: false, // Fuerzo a que intente guardar aunque no tenga más datos que el id de sesión
	})
);

// Middleware de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Server
const serverExpress = app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`);
});

app.get('/session', (req, res) => {
	// console.log(req.session);
	if (req.session.counter) {
		req.session.counter++;
		res.send(`Ingresó ${req.session.counter} veces`);
	} else {
		req.session.counter = 1;
		res.send('Ingresó por primera vez');
	}
})

// Rutas
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/session", sessionRouter);

// Creación de cookie
app.get("/setCookie", (req, res) => {
  res
    .cookie("CookieCookie", "Soy una Cookie", { maxAge: 10000, signed: true })
    .send("Cookie generada exitosamente");
});

// Obtención de cookies
app.get("/getCookie", (req, res) => {
	// console.log('Cookies firmadas', req)
	// res.send(req.cookies.process.env.SIGNED_COOKIE);
	res.send(req.signedCookies);
});

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Server Socket IO
const io = new Server(serverExpress);

// Socket IO
io.on("connection", (socket) => {
	console.log(`Servidor socket.io conectado`);
	// REAL TIME PRODS SECTION
	socket.on("nuevoProducto", async (newProd) => {
		await productModel.create(newProd);
		const totalProds = await productModel.find();
		socket.emit("prodsData", totalProds);
	});

	socket.on("getProducts", async () => {
		const totalProds = await productModel.find();
		socket.emit("prodsData", totalProds);
	});

	socket.on("loadProducts", async ({ page = 1 }) => {
		try {
			const limit = 10; // Número de productos por página
			const skip = (page - 1) * limit; // Cálculo del número de productos a omitir

			const products = await productModel.find().skip(skip).limit(limit);

			socket.emit("prodsData", products);
		} catch (error) {
			console.error(error);
		}
	});

	// Chat Websocket
	socket.on("newMessage", async ({ email, message }) => {
		console.log(message);
		await messagesModel.create({ email: email, message: message });
		const messages = await messagesModel.find();
		socket.emit("showMessages", messages);
	});

	socket.on("loadChats", async () => {
		const messages = await messagesModel.find();
		socket.emit("showMessages", messages);
	});

	// Signup
	// socket.on("newUser", async (newUser) => {
	// 	const user = await userModel.create(newUser);
	// 	socket.emit("alreadyUser", user);
	// });
});

app.use("/home", express.static(path.join(__dirname, "/public")));

// Login && Sign Up
app.use("/login", express.static(path.join(__dirname, "/public")));
app.use("/logout", express.static(path.join(__dirname, "/public")));
app.use("/signup", express.static(path.join(__dirname, "/public")));

// Chat
app.use("/chat", express.static(path.join(__dirname, "/public")));

// Prods
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));

// pagina /static
// app.get("/home", requireAuth, async (req, res) => {
app.get("/home", async (req, res) => {
	res.render("index", {
		globalCss: "globals.css",
		title: "Home",
		js: "main.js",
	});
});

// Login
app.get("/login", async (req, res) => {
	res.render("login", {
		globalCss: "globals.css",
		title: "Login",
		js: "login.js",
	});
});

// Logout
app.get("/logout", async (req, res) => {
	res.render("logout", {
		globalCss: "globals.css",
		title: "Logout",
		js: "logout.js",
	});
});

// Register
app.get("/signup", async (req, res) => {
	res.render("signup", {
		globalCss: "globals.css",
		title: "Sign up",
		js: "signup.js",
	});
});

// pagina /chat socketIo
app.get("/chat", requireAuth, async (req, res) => {
	res.render("chat", {
		globalCss: "globals.css",
		title: "Chat Socket.io",
		js: "chatScript.js",
	});
});

// pagina /Productos
app.get("/realtimeproducts", requireAuth, async (req, res) => {
	res.render("realtimeproducts", {
		globalCss: "globals.css",
		title: "Productos",
		js: "realtimeprodScript.js",
	});
});
