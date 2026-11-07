import { createIndexPage } from "./index.js";
import { createCatalogPage } from "./catalog.js";



document.querySelector("#index").addEventListener("click", (a) => {
  a.preventDefault();
  createIndexPage();
});
document.querySelector("#catalog").addEventListener("click", (a) => {
  a.preventDefault();
  createCatalogPage();
});

// index.html

createIndexPage();

const cards = document.querySelectorAll(".card");

console.log(cards)


