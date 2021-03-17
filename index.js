const express = require("express");
const router = require("./src/routes");

const app = express();

const port = 3030;

app.use(express.json());

app.use("/api/v1", router);

app.listen(port, () => console.log(`Server is running on port ${port}`));
