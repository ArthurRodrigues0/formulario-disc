const express = require("express");
const path = require("path");

const app = express(); // 👈 TEM QUE VIR ANTES DE QUALQUER app.use

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // 👈 pasta certa

// rota principal (formulário)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Forms.html"));
});

// rota do gráfico
app.get("/grafico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Graficos.html"));
});

// porta (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor Online na porta " + PORT);
});
