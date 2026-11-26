const initApp = async () => {
  try {
    const res = await fetch(
      "https://olpggeffeibgnxonixen.supabase.co/rest/v1/producte",
      {
        headers: {
          apikey: "sb_publishable_zVTIA8b8hqNcTM4qrDeE7A_HFkmUBkW",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Отказано в доступе ${res.status}`);
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

import { createCard } from "./var.js";

const создатьСписокУникальныхКатеогорий = () => {
  for (let category of products) {
    if (category.Category === "none") {
      category.Category = "Прочее";
    }
    if (!categoryMass.includes(category.Category)) {
      categoryMass.push(category.Category);
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
};
const renderCard = (category = "") => {
  cardGrid.innerHTML=''
  const filterProducts = category
    ? products.filter((value) => value.Category === category)
    : products;

  for (let i = 0; i < filterProducts.length; i++) {
    if (i >= filterProducts.length) {
      break;
    } else {
      let card = filterProducts[i];
      createCard(card);
    }
  }
};

renderCard();
создатьСписокУникальныхКатеогорий();
showUnicCategory();
