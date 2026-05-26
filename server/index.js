const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 10000;

// Middleware
app.use(cors()); // CORS per Ionic
app.use(express.json()); // Lettura JSON

app.get("/", (req, res) => {
    res.json({testo: "Hello, World!"});
})

app.listen(PORT, () => {
    console.log('Server backend avviato sulla porta ' + PORT);
})