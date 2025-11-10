const express = require("express");
const { perguntar } = require("../config/gnai.js");
const router = express.Router();

router.get("/initial", async (req, res) => {
    res.send("Hello World");
})

router.post("/perguntar", async (req, res) => {
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

module.exports = router;