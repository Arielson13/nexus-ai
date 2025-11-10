const express = require("express");
const routes = require("./routes/routes.js")
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;