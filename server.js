const express = require('express');
const path = require('path');

app.use(express.static(path.join(__dirname, 'Formulario')));
app.use('/grafico', express.static(path.join(__dirname, 'Grafico')));

const mysql = require('mysql2');
const app = express();

app.use(express.json());

// === Configuração do CORS ===
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// === Conexão com o MySQL ===
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


// Testa a conexão
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
    } else {
        console.log('MySQL conectado!');
    }
});

// === Rota para salvar resultados ===
app.post('/salvar', (req, res) => {
    const { usuario, D, I, S, C, perfil } = req.body;
    const query = 'INSERT INTO respostas_disc (usuario, D, I, S, C, perfil) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [usuario, D, I, S, C, perfil], (err, result) => {
        if (err) return res.status(500).send('Erro ao salvar no banco: ' + err);
        res.send('Resultado salvo!');
    });
});

// === Servir arquivos estáticos (HTML, CSS, JS) ===
app.use(express.static(__dirname));

// === Inicia o servidor ===
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

// Rota para pegar a distribuição de perfis
app.get('/distribuicao-perfis', (req, res) => {
    const query = `
        SELECT perfil, COUNT(*) as total
        FROM respostas_disc
        GROUP BY perfil
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
