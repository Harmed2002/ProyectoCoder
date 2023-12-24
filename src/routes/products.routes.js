import { Router } from "express";
import { productModel } from "../models/products.models.js";
import { passportError, authorization } from "../utils/messagesError.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
	const { limit = 10, page = 1, sort, query } = req.query;

	try {
		let options = {
			limit: parseInt(limit),
			page: parseInt(page),
			sort: {},
		};

		if (sort) {
			options.sort.price = sort === "asc" ? 1 : -1;
		}

		let queryFilter = {};

		if (query) {
			queryFilter = { category: query };
		}

		const prods = await productModel.paginate(queryFilter, options);

		const response = {
			status: "success",
			payload: prods.docs,
			totalPages: prods.totalPages,
			prevPage: prods.prevPage,
			nextPage: prods.nextPage,
			page: prods.page,
			hasPrevPage: prods.hasPrevPage,
			hasNextPage: prods.hasNextPage,
			prevLink: prods.hasPrevPage
				? `http://${req.headers.host}${req.baseUrl}?limit=${options.limit
				}&page=${prods.prevPage}&sort=${sort || ""}&query=${query || ""}`
				: null,
			nextLink: prods.hasNextPage
				? `http://${req.headers.host}${req.baseUrl}?limit=${options.limit
				}&page=${prods.nextPage}&sort=${sort || ""}&query=${query || ""}`
				: null,
		};

		res.status(200).send({ respuesta: response });
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "error en consultar productos", mensaje: error });
	}
});

productRouter.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const prod = await productModel.findById(id);
		if (prod) {
			res.status(200).send({ respuesta: "Ok", mensaje: prod });
		} else {
			res.status(404).send({
				respuesta: "Error en consultar producto",
				mensaje: "No encontrado",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "error en consultar productos", mensaje: error });
	}
});

productRouter.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { title, description, stock, status, code, price, category } = req.body;

	try {
		const prod = await productModel.findByIdAndUpdate(id, {
			title,
			description,
			stock,
			status,
			code,
			price,
			category,
		});
		if (prod) {
			res
				.status(200)
				.send({ respuesta: "Ok", mensaje: "Producto actualizado" });
		} else {
			res.status(404).send({
				respuesta: "Error en actualizar producto",
				mensaje: "No encontrado",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "error en consultar productos", mensaje: error });
	}
});

productRouter.delete("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const prod = await productModel.findByIdAndDelete(id);
		if (prod) {
			res.status(200).send({ respuesta: "Ok", mensaje: "Producto eliminado" });
		} else {
			res.status(404).send({
				respuesta: "Error en eliminar producto",
				mensaje: "No encontrado",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "error en eliminar productos", mensaje: error });
	}
});

productRouter.post("/", passportError('jwt'), authorization('user'), async (req, res) => {
	const { title, description, stock, code, price, category } = req.body;

	try {
		const prod = await productModel.create({ title, description, stock, code, price, category, });

		res.status(200).send({ respuesta: "Ok", mensaje: prod });

	} catch (error) {
		res.status(400).send({ respuesta: "error en crear productos", mensaje: error });
	}
});

export default productRouter;
