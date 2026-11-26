const cardGrid = document.querySelector(".card__grid");

export const createCard = ({
  category,
  discount,
  height,
  id,
  images: imgList,
  in_stock,
  short_desc,
  name,
  price,
  width,
}) => {
  const stokeValue = in_stock ? "Доступен для заказа" : "Недоступен для заказа";
  const discountValue = discount === 0 ? "none" : "";
  const priceValue = Math.round(price - (price * discount) / 100);
  const colorPrice = discount > 0 ? "rgba(179, 57, 57,1.0)" : "";

  // создаем всю карточку товара
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = id;

  // Создаем картинку внутри картчоки (берем первую из массива)
  const imgCont = document.createElement("figure");
  imgCont.className = "card__img";
  const photo = document.createElement("img");
  if (imgList[0]) photo.src = imgList[0];
  photo.alt = name;
  imgCont.append(photo);

  // создаем бирки
  const sale = document.createElement("span");
  sale.style.display = discountValue;
  sale.className = "card__discount";
  sale.textContent = ` - ${discount} %`;
  const cat = document.createElement("span");
  cat.className = "card__category";
  cat.textContent = category;
  const stoke = document.createElement("span");
  stoke.className = "card__inStoke";
  stoke.textContent = stokeValue;
  const param = document.createElement("span");
  param.className = "card__param";
  param.textContent = `${width} x ${height}`;
  imgCont.append(sale, cat, stoke, param);

  //создаем тело картчоки
  const cardBody = document.createElement("div");
  cardBody.className = "card__body";
  const cardName = document.createElement("h3");
  cardName.className = "card__name";
  cardName.textContent = name;
  const cardMinDesk = document.createElement("p");
  cardMinDesk.className = "card_minDesk";
  cardMinDesk.textContent = short_desc;

  const priceConteiner = document.createElement("span");
  priceConteiner.className = "card_price";
  priceConteiner.style.color = colorPrice;
  priceConteiner.textContent = `${priceValue} ₽`;

  const showMore = document.createElement("button");
  showMore.disabled = !in_stock;
  showMore.className = "card__showMore";
  showMore.textContent = "Подробнее";
  cardBody.append(cardName, cardMinDesk, priceConteiner, showMore);

  card.append(imgCont, cardBody);

  cardGrid.prepend(card);
};
