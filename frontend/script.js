import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

window.onload = function () {
  client
    .query({
      query: gql`
        {
          products {
            name
            price
          }
        }
      `,
    })
    .then((result) => {
      const catalog = document.getElementById("catalog");
      result.data.products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <h2>${product.name}</h2>
          <p>${product.price} USD</p>
        `;
        catalog.appendChild(card);
      });
    })
    .catch((error) => console.error("Ошибка при получении данных:", error));
};
