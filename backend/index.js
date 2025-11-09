const express = require("express");
const { perguntar } = require("./gnai");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/perguntar", async (req, res) => {
  const { prompt } = req.body;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt inválido" });
  }

  try {
    const resposta = await perguntar(prompt);
    res.json({ resposta });
  } catch (err) {
    console.error("Erro ao processar prompt:", err);
    res.status(500).json({ error: "Erro interno ao processar o prompt" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
