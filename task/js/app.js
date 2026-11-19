document.addEventListener("DOMContentLoaded", async () => {
  await initApp();
  renderTask();
});



import {
  getAllPost,
  getAllTodos,
  getAllComments,
  getAllPhoto,
  getAllUser,
} from "./promise.js";

import { createCard } from "./createCard.js";

let post = [];
let todos = [];
let comments = [];
let photos = [];
let users = [];

const tabsBox = document.querySelector(".tabs");
const taskList = document.querySelector(".task-list");


async function initApp() {
  [post, todos, comments, photos, users] = await Promise.all([
    getAllPost(),
    getAllTodos(),
    getAllComments(),
    getAllPhoto(),
    getAllUser(),
  ]);

  let activeCount = 0;
  function countActive() {
    for (let active of todos) {
      if (active.completed == true) {
        activeCount++;
      }
    }
  }
  countActive();

  let work = todos.length - activeCount;

  tabsBox.innerHTML = `  
  <button class="tab tab--active" value = "" >Все <span>${todos.length}</span></button>
  <button class="tab" value = "active">Активные <span>${activeCount}</span></button>
  <button class="tab" value = "completed" >Завершённые <span>${work}</span></button>
  `;

  const tabs = document.querySelectorAll(".tab");
  for (let tab of tabs) {
    tab.addEventListener("click", function () {
      for (let tabsi of tabs) {
        tabsi.classList.remove("tab--active");
        this.classList.add("tab--active");
      }
      let param = tab.value;
      renderTask(param);
    });
  }

  return { post, todos, comments, photos, users };
}

function renderTask(filter = "") {
      taskList.innerHTML=''
      
  const filterTodos = todos.filter(function (f) {
    if (filter === "") return true;
    if (filter === "completed") return f.completed === true;
    if (filter === "active") return f.completed === false;
    return true;
  });

  for (let i = 0; i < filterTodos.length; i++) {
    let todo = filterTodos[i];
    createCard(todo);
  }
}
