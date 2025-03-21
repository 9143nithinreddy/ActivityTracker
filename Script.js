// Select DOM elements
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const activityLog = document.getElementById("activity-log");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("task-name").value;
    const desc = document.getElementById("task-desc").value;
    const deadline = document.getElementById("task-deadline").value;

    if (name && deadline) {
        const task = {
            name,
            desc,
            deadline,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        addTaskToList(task);
        saveTask(task);
        taskForm.reset();
    }
});

function addTaskToList(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
        <div>
            <input type="checkbox" class="check" ${task.completed ? "checked" : ""}>
            <strong>${task.name}</strong> - ${task.desc} <br>
            <small>Deadline: ${task.deadline}</small>
        </div>
        <button class="delete-btn">🗑️ Delete</button>
    `;

    // Handle checkbox event
    const checkbox = taskDiv.querySelector(".check");
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        taskDiv.classList.toggle("completed", task.completed);
        updateStorage();
        if (task.completed) {
            logCompletedTask(task);
            taskDiv.remove();
        }
    });

    // Handle delete button
    const deleteBtn = taskDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        taskDiv.remove();
        removeTask(task);
    });

    taskList.appendChild(taskDiv);
}

function logCompletedTask(task) {
    const logDiv = document.createElement("div");
    logDiv.classList.add("log-item", "completed");
    logDiv.innerHTML = `
        <strong>${task.name}</strong> - ${task.desc} <br>
        <small>Deadline: ${task.deadline} | Completed on: ${new Date().toLocaleString()}</small>
    `;
    activityLog.appendChild(logDiv);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        if (task.completed) {
            logCompletedTask(task);
        } else {
            addTaskToList(task);
        }
    });
}

function updateStorage() {
    const tasks = Array.from(document.querySelectorAll(".task")).map(taskDiv => {
        const name = taskDiv.querySelector("strong").innerText;
        const desc = taskDiv.querySelector("small").innerText.split(" - ")[1] || "";
        const deadline = taskDiv.querySelector("small").innerText.split("Deadline: ")[1];
        const completed = taskDiv.classList.contains("completed");

        return { name, desc, deadline, completed, createdAt: new Date().toLocaleString() };
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.name !== task.name || t.deadline !== task.deadline);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
