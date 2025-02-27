const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8080;
const cors = require("cors");
app.use(cors());
app.use(express.json());

let products = require("../data.json");

// Получить все товары
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Добавить новый товар
app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  fs.writeFileSync(
    path.join(__dirname, "../data.json"),
    JSON.stringify(products, null, 2)
  );
  res.status(201).json(newProduct);
});

// Обновить товар по ID
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

// Удалить товар по ID
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
});
