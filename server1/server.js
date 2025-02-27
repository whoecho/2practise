const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) throw err;
    const products = JSON.parse(data);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Catalog</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <h1>Catalog</h1>
        <div class="catalog">
          ${products
            .map(
              (product) => `
            <div class="product-card">
              <h2>${product.name}</h2>
              <p>${product.price} USD</p>
              <p>${product.description}</p>
              <p>Categories: ${product.categories.join(", ")}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </body>
      </html>
    `);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
