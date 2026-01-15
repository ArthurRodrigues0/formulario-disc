const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// CONEXÃO COM MYSQL
// =======================
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "forms"
});

connection.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("MySQL conectado!");
  }
});

// =======================
// ROTAS HTML
// =======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Forms.html"));
});

app.get("/grafico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Graficos.html"));
});

// =======================
// API - SALVAR FORMULÁRIO
// =======================
app.post("/salvar", (req, res) => {
  const { nome, perfil } = req.body;

  const sql = "INSERT INTO respostas_disc (nome, perfil) VALUES (?, ?)";
  connection.query(sql, [nome, perfil], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao salvar" });
    }
    res.json({ ok: true });
  });
});

// =======================
// API - DADOS DO GRÁFICO
// =======================
app.get("/api/perfis", (req, res) => {
  const sql = `
    SELECT perfil, COUNT(*) AS total
    FROM respostas_disc
    GROUP BY perfil
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro no banco" });
    }
    res.json(results);
  });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor Online na porta " + PORT);
});
