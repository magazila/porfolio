const taskList = document.querySelector(".task-list");


export function createCard({ userId, id, title, completed }) {



  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = id;

  const label = document.createElement("label");
  label.className = "task__check";

  const input = document.createElement("input");
  input.type = "checkbox";

  const inputCheck = document.createElement("span");
  inputCheck.className = "task__checkmark";
  if (completed == true) {
    li.className = "task task--done";
    input.checked = true
  }
  label.prepend(input, inputCheck);

  const taskBody = document.createElement("div");
  taskBody.className = "task__body";
  const taskHead = document.createElement("div");
  taskHead.className = "task__head";
  const taskTitle = document.createElement("h3");
  taskTitle.className = "task__title";
  taskTitle.innerHTML = title;
  const taskDesc = document.createElement("p");
  taskDesc.className = "task__desc";
  taskDesc.innerHTML = title;
  taskHead.append(taskTitle);
  taskBody.append(taskHead, taskDesc);
  const taskActions = document.createElement("div");
  taskActions.className = "task__actions";
  taskActions.innerHTML = `            
  <button class="icon-btn icon-btn--sm" title="Редактировать">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
              </svg>
            </button>
            <button class="icon-btn icon-btn--sm icon-btn--danger" title="Удалить">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>`;

  li.append(label, taskBody, taskActions);
  taskList.append(li);
}