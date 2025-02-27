const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

let products = require("../data.json");

// 🔹 Swagger Options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin API for Store",
      version: "1.0.0",
      description: "API для управления товарами в интернет-магазине",
    },
  },
  apis: ["./backend/server2/server.js"],
};

// 🔹 Инициализация Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Добавить новый товар
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Товар добавлен
 */
app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  fs.writeFileSync(
    path.join(__dirname, "../data.json"),
    JSON.stringify(products, null, 2)
  );
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex !== -1) {
    products[productIndex] = updatedProduct;
    fs.writeFileSync(
      path.join(__dirname, "../data.json"),
      JSON.stringify(products, null, 2)
    );
    res.json(updatedProduct);
  } else {
    res.status(404).send("Product not found");
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    fs.writeFileSync(
      path.join(__dirname, "../data.json"),
      JSON.stringify(products, null, 2)
    );
    res.json(deletedProduct);
  } else {
    res.status(404).send("Product not found");
  }
});

app.listen(port, () => {
  console.log(`API Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
