const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
