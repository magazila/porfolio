const cardGrid = document.querySelector(".card__grid");

export const createCard = ({
  Category,
  count,
  discount,
  fullDesk,
  heigth,
  id,
  img,
  inStoke,
  minDesk,
  minName,
  price,
  width,
}) => {
  const categoryValue = Category !== "none" ? Category : "Прочее";
  const stokeValue = inStoke ? "Доступен для заказ" : "Недоступен дял заказа";
  const discountValue = discount === 0 ? "none" : "";
  const priceValue = price - (price * discount / 100)
  const colorPrice = discount > 0 ? 'rgba(179, 57, 57,1.0)' : ''


  // создаем всю карточку товара
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = id;

  // Создаем картинку внутри картчоки
  const imgCont = document.createElement("figure");
  imgCont.className = "card__img";
  const images = document.createElement("img");
  images.src = img;
  images.alt = minName;
  imgCont.append(images);

  // создаем бирки
  const sale = document.createElement("span");
  sale.style.display = discountValue;
  sale.className = "card__discount";
  sale.textContent = ` - ${discount} %`;
  const cat = document.createElement("span");
  cat.className = "card__category";
  cat.textContent = categoryValue;
  const stoke = document.createElement("span");
  stoke.className = "card__inStoke";
  stoke.textContent = stokeValue;
  const param = document.createElement("span");
  param.className = "card__param";
  param.textContent = `${width} x ${heigth}`;
  imgCont.append(sale, cat, stoke, param);

  //создаем тело картчоки
  const cardBody = document.createElement("div");
  cardBody.className = "card__body";
  const cardName = document.createElement("h3");
  cardName.className = "card__name";
  cardName.textContent = minName;
  const cardMinDesk = document.createElement("p");
  cardMinDesk.className = "card_minDesk";
  cardMinDesk.textContent = minDesk;


  const priceConteiner = document.createElement("span");
  priceConteiner.className = "card_price";
  priceConteiner.style.color = colorPrice
  priceConteiner.textContent = `${priceValue} ₽`;

  const showMore = document.createElement("button");
  showMore.disabled = !inStoke;
  showMore.className = "card__showMore";
  showMore.textContent = "Подробнее";
  cardBody.append(cardName, cardMinDesk,priceConteiner, showMore);

  card.append(imgCont, cardBody);

  cardGrid.prepend(card);
};