import { supabaseUrl, apiKey } from "./config.js";

/* =========================================
   ВХОД
   ========================================= */
const token = sessionStorage.getItem("token");
document.querySelector("#login-block").hidden = Boolean(token);
document.querySelector("#adminPanel").hidden = !token;

const loginForm = document.querySelector("#login");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: apiKey },
      body: JSON.stringify({
        email: loginForm.email.value,
        password: loginForm.password.value,
      }),
    });
    if (!res.ok) {
      throw new Error("Неверная почта или пароль");
    }
    const data = await res.json();
    sessionStorage.setItem("token", data.access_token);
    location.reload();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector("#logout").addEventListener("click", () => {
  sessionStorage.removeItem("token");
  location.reload();
});

// Заголовки для запросов, которые что-то меняют: ключ + токен вошедшего админа.
// Prefer: return=representation заставляет базу вернуть изменённые строки.
const getHeaders = () => ({
  "content-type": "application/json",
  apikey: apiKey,
  Authorization: `Bearer ${token}`,
  Prefer: "return=representation",
});

// Проверка ответа. Если база отказала, кидаем ошибку с её текстом.
async function checkRes(res) {
  if (res.status === 401) {
    sessionStorage.removeItem("token");
    location.reload();
    throw new Error("Сессия закончилась, войдите снова");
  }
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
  }
  return res.json(); // массив строк, которые вернула база
}

// Защита (RLS) на PATCH и DELETE не выдаёт ошибку, а просто ничего не меняет.
// Пустой массив в ответе значит «база отказала».
const checkChanged = (rows) => {
  if (rows.length === 0) {
    throw new Error("База ничего не изменила: нет прав или товар не найден");
  }
};

/* =========================================
   ДОБАВЛЕНИЕ ТОВАРА
   ========================================= */
const form = document.querySelector("#FormAddProducte");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // останавливаем перезагрузку страницы

  const category = form.category.value;
  const stock = Number(form.count.value);
  const discount = Number(form.discount.value);
  const fullDesk = form.fullDesk.value;
  const heigth = Number(form.heigth.value);
  // ссылки на картинки: по одной в строке -> массив
  const images = form.img.value
    .split("\n")
    .map((link) => link.trim())
    .filter((link) => link !== "");
  const minDesk = form.mindesk.value;
  const minName = form.card__title.value;
  const price = Number(form.price.value);
  const width = Number(form.width.value);

  // ключи слева это названия колонок в базе
  const card = {
    category: category,
    stock: stock,
    discount: discount,
    full_desc: fullDesk,
    height: heigth,
    images: images,
    short_desc: minDesk,
    name: minName,
    price: price,
    width: width,
  };

  const ok = await addNewProducte(card);
  if (ok) {
    location.reload(); // форма очистится, список обновится
  }
});

async function addNewProducte(params) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    await checkRes(res);
    console.log("успешно, продукт добавлен");
    return true;
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    alert(error.message);
    return false;
  }
}

/* =========================================
   СПИСОК ТОВАРОВ
   ========================================= */
const initApp = async () => {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?select=*&order=id.desc`,
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
const products = await initApp();
const all = document.querySelector(".producteAll");
console.log(products);

// Данные из базы нельзя вставлять в innerHTML как есть: если в названии товара
// будет <script> или <img onerror=...>, оно выполнится. Эта функция
// превращает опасные символы в обычный текст.
const esc = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function createAllEditProducts() {
  for (let oneProducte of products) {
    const check = oneProducte.in_stock === true ? "checked" : "";
    const pic = esc(oneProducte.images[0] ?? "");
    const name = esc(oneProducte.name);

    const li = `
              <li class="minProducte" data-id="${oneProducte.id}">
            <figure class="minProducte_img"> <img src="${pic}" alt="${name}"/></figure>
            <input name="name" type="text" value="${name}" placeholder="${name}" disabled>
            <input type="number" name="price" value="${oneProducte.price}" placeholder="${oneProducte.price}" disabled>
            <input type="number" name="discount" value="${oneProducte.discount}" placeholder="${oneProducte.discount}" disabled>
            <input type="number" name="stock" value="${oneProducte.stock}" placeholder="${oneProducte.stock}" disabled>
            <label for="status" style="display: flex; gap: 0.5rem;"><input type="checkbox" ${check} class="status" disabled />Доступен</label>
            <div class="edit"><i class="fa-solid fa-pen"></i></div>
            <div class="delete"><i class="fa-solid fa-trash-can"></i></div>
          </li>
    `;
    all.insertAdjacentHTML("beforeend", li);
  }
}

all.addEventListener("click", async (event) => {
  const del = event.target.closest(".delete");
  const edit = event.target.closest(".edit");

  if (del) {
    const li = del.closest(".minProducte");
    const id = Number(li.dataset.id);
    const name = li.querySelector('input[name="name"]').value;

    if (!confirm(`Удалить «${name}»?`)) return;

    const ok = await deleteCard(id);
    if (ok) {
      li.remove(); // убираем строку со страницы только если база удалила
    }
  }
  if (edit) {
    const li = edit.closest(".minProducte");
    const id = Number(li.dataset.id);
    const inputs = li.querySelectorAll("input");

    if (edit.innerHTML.includes("fa-pen")) {
      edit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
      for (let input of inputs) {
        input.disabled = false;
      }
    } else if (edit.innerHTML.includes("fa-floppy-disk")) {
      edit.innerHTML = '<i class="fa-solid fa-pen"></i>';
      for (let input of inputs) {
        input.disabled = true;
      }
      console.log("сохраняемся");

      const newCard = {
        name: li.querySelector('input[name="name"]').value,
        price: Number(li.querySelector('input[name="price"]').value),
        discount: Number(li.querySelector('input[name="discount"]').value),
        stock: Number(li.querySelector('input[name="stock"]').value),
        in_stock: li.querySelector(".status").checked,
      };
      editCard(id, newCard);
    }
  }
});

async function editCard(cardId, card) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${cardId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(card),
    });
    checkChanged(await checkRes(res));
    console.log("Товар обновлен");
    return true;
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    alert(error.message + "\nИзменения не сохранены, обновите страницу.");
    return false;
  }
}

async function deleteCard(cardId) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${cardId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    checkChanged(await checkRes(res));
    console.log("Товар удален");
    return true;
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    alert(error.message);
    return false;
  }
}

createAllEditProducts();
