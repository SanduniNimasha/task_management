const db = require("../db");

const normalizeStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  return value === "completed" ? "completed" : "pending";
};

const normalizePriority = (priority) => {
  const value = String(priority || "").trim().toLowerCase();
  return ["low", "medium", "high"].includes(value) ? value : "low";
};

const normalizeTask = (task) => ({
  ...task,
  status: normalizeStatus(task.status),
  priority: normalizePriority(task.priority),
});

exports.getAllTasks = (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result.map(normalizeTask));
  });
};

exports.getTaskById = (req, res) => {
  db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length) return res.status(404).json({ message: "Task not found" });
    res.json(normalizeTask(result[0]));
  });
};

exports.createTask = (req, res) => {
  const { title, description, due_date, priority } = req.body;
  const normalizedPriority = normalizePriority(priority);
  const status = "pending";

  if (!title || !due_date || !priority) {
    return res.status(400).json({ message: "Title, due date, and priority are required." });
  }

  const sql = "INSERT INTO tasks (title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [title, description, due_date, normalizedPriority, status], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, message: "Task added successfully" });
  });
};

exports.updateTask = (req, res) => {
  const { title, description, due_date, priority } = req.body;
  const normalizedPriority = normalizePriority(priority);

  if (!title || !due_date || !priority) {
    return res.status(400).json({ message: "Title, due date, and priority are required." });
  }

  const sql = "UPDATE tasks SET title=?, description=?, due_date=?, priority=? WHERE id=?";

  db.query(sql, [title, description, due_date, normalizedPriority, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task updated" });
  });
};

exports.deleteTask = (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task deleted" });
  });
};

exports.updateStatus = (req, res) => {
  const status = normalizeStatus(req.body.status);
  const sql = "UPDATE tasks SET status=? WHERE id=?";

  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status updated" });
  });
};

exports.getDashboard = (req, res) => {
  const query = `
  SELECT
    COUNT(*) AS total,
    SUM(LOWER(status) = 'completed') AS completed,
    SUM(LOWER(status) = 'pending') AS pending,
    SUM(LOWER(priority) = 'high') AS highPriority
  FROM tasks
`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

