const express = require("express");
const { perguntar } = require("./gnai");
const app = express();
require("dotenv").config();

app.use(express.json());
const cors = require("cors");
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
