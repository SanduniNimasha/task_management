const express = require("express");
const router = express.Router();

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
    getDashboard
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/dashboard", getDashboard);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateStatus);

module.exports = router;
