window.onload = function () {
  fetch("http://localhost:8080/api/products")
    .then((response) => response.json())
    .then((data) => {
      const catalog = document.getElementById("catalog");
      data.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.price} USD</p>
            <p>${product.description}</p>
            <p>Categories: ${product.categories.join(", ")}</p>
          `;
        catalog.appendChild(card);
      });
    });
};
