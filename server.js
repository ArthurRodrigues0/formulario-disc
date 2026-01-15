const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// POSTGRES CONNECTION
// =======================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
pool.query(`
  CREATE TABLE IF NOT EXISTS respostas_disc (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    perfil CHAR(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log("Tabela verificada/criada com sucesso");
}).catch(err => {
  console.error("Erro ao criar tabela:", err);
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
// SALVAR FORMULÁRIO
// =======================
app.post("/salvar", async (req, res) => {
  const { nome, perfil } = req.body;

  try {
    await pool.query(
      "INSERT INTO respostas_disc (nome, perfil) VALUES ($1, $2)",
      [nome, perfil]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao salvar" });
  }
});

// =======================
// DADOS DO GRÁFICO
// =======================
app.get("/api/perfis", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT perfil, COUNT(*) AS total
      FROM respostas_disc
      GROUP BY perfil
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no banco" });
  }
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Online na porta " + PORT);
});
app.post('/salvar', (req, res) => {
  console.log('CHEGOU AQUI');
  console.log(req.body);
  res.send('ok');
});


