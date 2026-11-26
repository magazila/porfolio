import { supabaseUrl, apiKey } from "./config.js";
import { createCard } from "./var.js";

const initApp = async () => {
  try {
    // order=id.asc, чтобы порядок не прыгал (карточки добавляются через prepend,
    // поэтому новые товары окажутся сверху)
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?select=*&order=id.asc`,
      {
        headers: {
          apikey: apiKey,
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Ошибка ${res.status}`);
    }
    const products = await res.json();
    return products;
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    return [];
  }
};

const categoryConteiner = document.querySelector(".card__all-category");
const cardGrid = document.querySelector(".card__grid");

const products = await initApp();
const categoryMass = [];

const создатьСписокУникальныхКатеогорий = () => {
  for (let product of products) {
    if (!categoryMass.includes(product.category)) {
      categoryMass.push(product.category);
    }
  }
};

const createElementCategory = (category) => {
  const li = document.createElement("li");
  li.className = "category";
  li.textContent = category;
  li.dataset.name = category;
  categoryConteiner.prepend(li);
};

const showUnicCategory = () => {
  for (let unicCategory of categoryMass) {
    createElementCategory(unicCategory);
  }
  // кнопка «Все» встанет первой, потому что prepend
  createElementCategory("Все");
  categoryConteiner.firstElementChild.classList.add("category--active");
};

const renderCard = (category = "") => {
  cardGrid.innerHTML = "";
  const filterProducts = category
    ? products.filter((value) => value.category === category)
    : products;

  if (filterProducts.length === 0) {
    cardGrid.textContent = "Здесь пока ничего нет";
    return;
  }
  for (let card of filterProducts) {
    createCard(card);
  }
};

// клик по категории: подсветить её и перерисовать карточки
categoryConteiner.addEventListener("click", (event) => {
  const li = event.target.closest(".category");
  if (!li) return;

  for (let item of categoryConteiner.children) {
    item.classList.remove("category--active");
  }
  li.classList.add("category--active");

  renderCard(li.dataset.name === "Все" ? "" : li.dataset.name);
});

renderCard();
создатьСписокУникальныхКатеогорий();
showUnicCategory();
