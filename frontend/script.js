const API = "http://localhost:3000/api/tasks";


let allTasks = [];
let currentStatus = "all";
let currentPriority = "";
let currentSearch = "";
let currentViewMode = 'status';
let isEditMode = false;
let editTaskId = null;

function loadTasks() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            allTasks = data || [];
            applyFilters(); 
        })
        .catch(err => console.error(err));
}
function formatStatus(status) {
    const s = (status || "").toLowerCase();

    if (s === "completed") return "Completed";
    if (s === "pending") return "Pending";

    return "Pending"; 
}
function openCreateModal() {
    isEditMode = false;
    editTaskId = null;

    const dueInput = document.getElementById("task-due");

    const today = new Date().toISOString().split("T")[0];
    dueInput.setAttribute("min", today);

    document.getElementById("modal-title").innerHTML = "NEW <span>TASK</span>";
    document.getElementById("modal-submit-btn").innerText = "CREATE TASK";

    clearForm();
    document.getElementById("taskModal").classList.add("open");
}
function openEditModal(task) {
    isEditMode = true;
    editTaskId = task.id;

    document.getElementById("modal-title").innerHTML = "EDIT <span>TASK</span>";
    document.getElementById("modal-submit-btn").innerText = "UPDATE TASK";

    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description || "";
    document.getElementById("task-due").value =
    task.due_date
        ? new Date(task.due_date).toISOString().split('T')[0]
        : "";
    document.getElementById("task-priority").value = task.priority || "";

    document.getElementById("taskModal").classList.add("open");
}

function clearForm() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-due").value = "";
    document.getElementById("task-priority").value = "";
}
function submitTask() {


    if (!validateTaskForm()) return;

    const payload = {
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        due_date: document.getElementById("task-due").value,
        priority: document.getElementById("task-priority").value
    };

    const request = isEditMode
        ? fetch(`${API}/${editTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        : fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

    request
        .then(res => res.json())
        .then(() => {
           loadTasks();
           loadDashboard();
           closeModal("taskModal");
           clearForm();

           showToast(
            isEditMode ? "Task updated successfully!" : "Task created successfully!",
            "success"
         );
    })
        .catch(err => console.error("Task error:", err));
}
function validateTaskForm() {
    let isValid = true;

    const title = document.getElementById("task-title");
    const due = document.getElementById("task-due");
    const priority = document.getElementById("task-priority");


    document.querySelectorAll(".form-group").forEach(g => {
        g.classList.remove("invalid");
    });


    if (title.value.trim() === "") {
        document.getElementById("fg-title").classList.add("invalid");
        isValid = false;
    }

    const today = new Date().toISOString().split("T")[0];

    if (due.value === "" || due.value < today) {
        document.getElementById("fg-due").classList.add("invalid");
        isValid = false;
    }


    if (priority.value === "") {
        document.getElementById("fg-priority").classList.add("invalid");
        isValid = false;
    }

    return isValid;
}

function setStatus(status, btn){

    document.querySelectorAll("#status-filters .filter-btn").forEach(b=>{
        b.classList.remove(
            "active",
            "active-all",
            "active-pending",
            "active-completed"
        );
    });

    btn.classList.add("active");

    if(status==="all"){
        btn.classList.add("active-all");
    }

    if(status==="pending"){
        btn.classList.add("active-pending");
    }

    if(status==="completed"){
        btn.classList.add("active-completed");
    }

    currentStatus = status;
    applyFilters(); 
    
}

function setPriority(priority) {
    currentPriority = priority;
    applyFilters();
}
function resetFilters() {
    currentStatus = "all";
    currentPriority = "";
    currentSearch = "";

    document.getElementById("task-search").value = "";

    document.querySelectorAll(".filter-btn").forEach(btn =>
        btn.classList.remove(
            "active",
            "active-all",
            "active-pending",
            "active-completed",
            "active-high",
            "active-medium",
            "active-low"
        )
    );

    applyFilters();
}

function applyFilters() {
    let filtered = [...allTasks];

    if (currentStatus !== "all") {
        filtered = filtered.filter(t =>
            (t.status || "").toLowerCase() === currentStatus
        );
    }

    if (currentPriority) {
        filtered = filtered.filter(t =>
            (t.priority || "").toLowerCase() === currentPriority
        );
    }

    if (currentSearch) {
        filtered = filtered.filter(task =>
            (task.title || "").toLowerCase().includes(currentSearch) ||
            (task.description || "").toLowerCase().includes(currentSearch)
        );
    }

    renderTasks(filtered);
    loadDashboard(filtered); 
}
//renderTask

function renderTasks(data = allTasks) {
    const tbody = document.getElementById("task-tbody");

    if (!data || data.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;color:gray;padding:20px;">
                No tasks found
            </td>
        </tr>`;
        return;
    }

    tbody.innerHTML = data.map(task => `
        <tr>
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.description || "-"}</td>
            <td>${task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "-"}</td>
            <td>
             <span class="priority-tag ${task.priority}">
               <span class="dot"></span>
               ${task.priority}
            </span>
             </td>   


            <td>
                <span class="badge status ${normalizeStatus(task.status)}">
                    ${formatStatus(task.status)}
                </span>
            </td>

            <td>
                <button onclick='openEditModalById(${task.id})'>Edit</button>
                <button onclick="toggleStatus(${task.id}, '${task.status}')">
                    ${task.status === "completed" ? "Reopen" : "Done"}
                </button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}
function openEditModalById(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    openEditModal(task);
}
function closeModal(id) {
    document.getElementById(id).classList.remove("open");
}
// ADD TASK 
function addTask() {
    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: document.getElementById("title").value,
            description: document.getElementById("desc").value,
            due_date: document.getElementById("date").value,
            priority: document.getElementById("priority").value
        })
    }).then(() => loadTasks());
}

// delete task
function deleteTask(id) {
    fetch(`${API}/${id}`, { method: "DELETE" })
        .then(() => {
            loadTasks();
            showToast("Task deleted successfully!", "error");
        });
}

// Toggle status
function toggleStatus(id, status) {
    const current = (status || "").toLowerCase();

    const newStatus = current === "completed"
        ? "pending"
        : "completed";

    fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    }).then(() => {
        loadTasks();

        showToast(
            newStatus === "completed"
                ? "Task marked as completed!"
                : "Task reopened!",
            "info"
        );
    });
}


function loadDashboard(data = allTasks) {

    const tasks = data;

    const total = tasks.length;

    const completed = tasks.filter(t =>
        (t.status || "").toLowerCase() === "completed"
    ).length;

    const pending = tasks.filter(t =>
        (t.status || "").toLowerCase() === "pending"
    ).length;

    const highPriority = tasks.filter(t =>
        (t.priority || "").toLowerCase() === "high"
    ).length;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-done").textContent = completed;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-high").textContent = highPriority;
}
function updateDashboardFilters() {
  const statusBox = document.getElementById('status-filters');
  const priorityBox = document.getElementById('priority-filters');

  if (currentViewMode === 'status') {
    statusBox.style.display = 'flex';
    priorityBox.style.display = 'none';
  } else {
    statusBox.style.display = 'none';
    priorityBox.style.display = 'flex';
  }
}
//setView
function setView(e, status) {
  currentViewMode = 'priority';

  currentStatus = status;
  currentPriority = '';

  updateDashboardFilters();

  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.remove('active')
  );
  e.currentTarget.classList.add('active');

  applyFilters();
}
//setPriorityFilter
function setPriorityFilter(e, priority) {
  currentViewMode = 'status'; 

  currentPriority = priority;
  currentStatus = 'all';

  updateDashboardFilters();

  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.remove('active')
  );
  e.currentTarget.classList.add('active');

  applyFilters();
}
function setPriorityFromUI(priority, btn){

    document.querySelectorAll("#priority-filters .filter-btn").forEach(b=>{
        b.classList.remove(
            "active",
            "active-high",
            "active-medium",
            "active-low"
        );
    });

    btn.classList.add("active");

    if(priority==="high"){
        btn.classList.add("active-high");
    }

    if(priority==="medium"){
        btn.classList.add("active-medium");
    }

    if(priority==="low"){
        btn.classList.add("active-low");
    }

    currentPriority = priority;
     applyFilters();
    
}
function normalizeStatus(status) {
    return (status || "").toLowerCase();
}

function setSearch(value) {
    currentSearch = value.toLowerCase();
    applyFilters();
}
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);

    toast.innerHTML = `
        <div class="toast-dot"></div>
        <div>${message}</div>
    `;

    container.appendChild(toast);

    // auto remove after 3s
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    currentViewMode = "status";
    updateDashboardFilters();

    loadDashboard();
    loadTasks();
});
