import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

import path from 'path'
import { __dirname } from './path.js'

import prodsRouter from "./routes/products.routes.js"
import userRouter from './routes/users.routes.js'
import cartRouter from "./routes/carts.routes.js"
import messageRouter from "./routes/messages.routes.js"

import { productModel } from './models/products.models.js'
import { msgsModel } from './models/messages.models.js'

const app = express()
const PORT = 8000

const serverExpress = app.listen(PORT, () => {
	console.log(`Server on port ${PORT}`)
})

//Mongoose DB
mongoose.connect('mongodb+srv://harmed2002:<password>@cluster0.0kdtqxd.mongodb.net/?retryWrites=true&w=majority')
	.then(async () => console.log('DB is connected'))
	.catch(() => console.log('Error in connection'))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/realTimeProducts', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))

app.get('/realTimeProducts', (req, res) => {
	res.render('realTimeProducts', {
		js: "realTimeProducts.js",
		css: "style.css",
		title: "Products",
	})
})

app.get('/static', (req, res) => {
	res.render('home', {
		js: "home.js",
		css: "style.css",
		title: "Home",
	})
})

app.get('/chat', (req, res) => {
	res.render('chat', {
		globalCss: 'style.css',
		title: 'Chat Socket.io',
		js: 'chat.js',
	});
});

//Socket
const io = new Server(serverExpress)
io.on('connection', (socket) => {
	console.log("Servidor Socket.io conectado")

	socket.on("llamarProductos", async () => {
		const products = await productModel.find()
		socket.emit("productos", products)
	})

	socket.on("nuevoProducto", async (nuevoProd) => {
		const { title, description, price, stock, category, code, thumbnail } = nuevoProd
		await productModel.create({ title, description, price, stock, category, code, thumbnail })
	})

	socket.on('newMessage', async ({ email, message }) => {
		console.log(message)
		await msgsModel.create({ email: email, message: message })
		const messages = await msgsModel.find()
		socket.emit("showMessages", messages)
	})

	socket.on('loadChats', async () => {
		const messages = await msgsModel.find()
		socket.emit("showMessages", messages)
	})
})

//Routes
app.use('/api/users', userRouter)
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)
