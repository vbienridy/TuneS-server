const express = require("express");

const app = express();

const users = require("./routes/api/users");

app.use("/api/users", users);

app.get("/", (req, res) => res.send("Hello"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
