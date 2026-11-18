document.addEventListener("DOMContentLoaded", async () => {
  await initApp();
  renderCard();
});

let newCount = 10;
let step = 5;

let users = [];
let todos = [];
let photo = [];

const taskList = document.querySelector(".task_list");

async function getUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return await response.json();
}

async function getTodo() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  return await response.json();
}

async function getImgUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/photos");
  return await response.json();
}

async function initApp() {
  [todos, users, photo] = await Promise.all([
    getTodo(),
    getUser(),
    getImgUser(),
  ]);
  return { todos, users, photo };
}

function createCard({ id, userId, title, completed }) {
  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = id;

  const fig = document.createElement("figure");
  fig.className = "user_avatar";
  const img = document.createElement("img");
  img.src = getUserPhoto(userId);

  fig.append(img);

  const parag = document.createElement("p");
  parag.className = "task_text";
  parag.innerHTML = title;

  const bot = document.createElement("b");
  bot.className = "user_name";
  bot.innerHTML = getUserName(userId);

  li.append(fig, parag,bot);

  taskList.prepend(li);
}

function getUserPhoto(userId) {
  let user = photo.find(function (p) {
    return p.id === userId;
  });
  return user.thumbnailUrl;
}

function getUserName(userId) {
  let user = users.find(function (u) {
    return u.id === userId;
  });
  return user.name;
}

function renderCard() {
  taskList.innerHTML = "";
  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    createCard(todo);
  }
}
