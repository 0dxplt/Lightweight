const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/database');

const config = require('./config/env');
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Rotte di test
app.get("/", (req, res) => {
    res.json({testo: "Hello, World!"});
});

app.listen(PORT, () => {
    console.log(`Server backend avviato sulla porta ${PORT}`);
});