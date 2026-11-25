const form = document.querySelector("#FormAddProducte");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // останавливаем перезагрузку страницы

  const category = form.category.value;
  const count = Number(form.count.value);
  const discount = Number(form.discount.value);
  const fullDesk = form.fullDesk.value;
  const heigth = Number(form.heigth.value);
  const img = form.img.value;
  const minDesk = form.mindesk.value;
  const minName = form.card__title.value;
  const price = Number(form.price.value);
  const width = Number(form.width.value);

  const card = {
    Category: category,
    count: count,
    discount: discount,
    fullDesk: fullDesk,
    heigth: heigth,
    img: img,
    minDesk: minDesk,
    minName: minName,
    price: price,
    width: width,
  };

  addNewProducte(card);
});

async function addNewProducte(params) {
  try {
    const res = await fetch(
      "https://olpggeffeibgnxonixen.supabase.co/rest/v1/producte",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: "sb_publishable_zVTIA8b8hqNcTM4qrDeE7A_HFkmUBkW",
        },
        body: JSON.stringify(params),
      },
    );
    if (!res.ok) {
      throw new Error(`Отказано в доступе ${res.status}`);
    }
    console.log("успешено, продукт добавлен");
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    return [];
  }
}

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
const products = await initApp();
const all = document.querySelector(".producteAll");
console.log(products);

function createAllEditProducts() {
  for (let oneProducte of products) {
    const check = oneProducte.inStoke === true ? "checked" : "";

    const li = `
              <li class="minProducte" data-id="${oneProducte.id}">
            <figure class="minProducte_img"> <img src="${oneProducte.img}" alt="${oneProducte.minName}"/></figure>
            <input name="name" type="text" value="${oneProducte.minName}" placeholder="${oneProducte.minName}" disabled>
            <input type="number" name="price" value="${oneProducte.price}" placeholder="${oneProducte.price}" disabled>
            <input type="number" name="discount" value="${oneProducte.discount}" placeholder="${oneProducte.discount}" disabled>
            <input type="number" name="count" value="${oneProducte.count}" placeholder="${oneProducte.count}" disabled>
            <label for="status" style="display: flex; gap: 0.5rem;"><input type="checkbox" ${check} class="status" />Доступен</label>
            <div class="edit"><i class="fa-solid fa-pen"></i></div>
            <div class="delete"><i class="fa-solid fa-trash-can"></i></div>
          </li>
    `;
    all.insertAdjacentHTML("beforeend", li);
  }
}

all.addEventListener("click", (event) => {
  const del = event.target.closest(".delete");
  const edit = event.target.closest(".edit");

  if (del) {
    const li = del.closest(".minProducte");
    const id = Number(li.dataset.id);

    deleteCard(id);
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
        minName: li.querySelector('input[name="name"]').value,
        price: Number(li.querySelector('input[name="price"]').value),
        discount: Number(li.querySelector('input[name="discount"]').value),
        count: Number(li.querySelector('input[name="count"]').value),
        inStoke: li.querySelector(".status").checked,
      };
      editCard(id, newCard);
    }
  }
});

async function editCard(cardId, card) {
  try {
    const res = await fetch(
      `https://olpggeffeibgnxonixen.supabase.co/rest/v1/producte?id=eq.${cardId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          apikey: "sb_publishable_zVTIA8b8hqNcTM4qrDeE7A_HFkmUBkW",
        },
        body: JSON.stringify(card),
      },
    );
    if (!res.ok) {
      throw new Error(`Отказано в доступе ${res.status}`);
    }
    console.log("Товар обновлен");
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    return [];
  }
}
async function deleteCard(cardId) {
  try {
    const res = await fetch(
      `https://olpggeffeibgnxonixen.supabase.co/rest/v1/producte?id=eq.${cardId}`,
      {
        method: "DELETE",
        headers: {
          apikey: "sb_publishable_zVTIA8b8hqNcTM4qrDeE7A_HFkmUBkW",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Отказано в доступе ${res.status}`);
    }
    console.log("Товар удален");
  } catch (error) {
    console.error("Ошибка подключения к бд", error);
    return [];
  }
}

createAllEditProducts();
