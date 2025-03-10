const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Загружаем данные из JSON
let products = require("./data.json");

// Определяем GraphQL-схему
const schema = buildSchema(`
  type Product {
    id: String
    name: String
    price: Float
    description: String
    categories: [String]
  }

  type Query {
    products: [Product]
    product(id: String!): Product
  }
`);

// Определяем резолверы
const root = {
  products: () => products,
  product: ({ id }) => products.find((p) => p.id === id),
};

// Запускаем сервер GraphQL
const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Включаем GraphiQL для тестирования API
  })
);

app.listen(4000, () => {
  console.log("GraphQL сервер запущен на http://localhost:4000/graphql");
});
