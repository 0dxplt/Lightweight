const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/database');
const seasonChrono = require('./season-chrono-checker/season.js');

seasonChrono.init();

const config = require('./config/env');
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Middlewares
const authMiddleware = require('./middlewares/auth.middleware.js');
const modMiddleware = require('./middlewares/mod.middleware.js');

// Routes
const routeEsercizi = require('./routes/esercizi.route.js');
const routeNazioni = require('./routes/nazioni.route.js');
const routePalestre = require('./routes/palestre.route.js');
const routeCitta = require('./routes/citta.route.js');
const routeGruppiMuscolari = require('./routes/gruppi-muscolari.route.js');
const routeUsers = require('./routes/users.route.js');
const routeProfile = require('./routes/profile.route.js');
const routeRankings = require('./routes/rankings.route.js');
const routeImgs = require('./routes/imgs.route.js');
const routeModeratori = require('./routes/moderatori.route.js');
const routeSegnalazioni = require('./routes/segnalazioni.route.js');
const routeRichieste = require('./routes/richieste.route.js');
const routeSolved = require('./routes/solved.route.js');
const routeWorkout = require('./routes/workout.route.js');
const routeWorkouts = require('./routes/workouts.route.js');
const routeSessioni = require('./routes/sessioni.route.js');
const routeAuth = require('./routes/auth.route.js');
const routeFeed = require('./routes/feed.route.js');
const routePts = require('./routes/pts.route.js');

// APIs
app.use("/api/exercises", authMiddleware, routeEsercizi);
app.use("/api/nations", authMiddleware, routeNazioni);
app.use("/api/gyms", authMiddleware, routePalestre);
app.use("/api/cities", authMiddleware, routeCitta);
app.use("/api/muscolar-groups", authMiddleware, routeGruppiMuscolari);
app.use("/api/users", authMiddleware, routeUsers);
app.use("/api/profile", authMiddleware, routeProfile);
app.use("/api/rankings", authMiddleware, routeRankings);
app.use("/api/imgs", routeImgs);
app.use("/api/moderators", authMiddleware, modMiddleware, routeModeratori);
app.use("/api/reports", authMiddleware, modMiddleware, routeSegnalazioni);
app.use("/api/requests", authMiddleware, modMiddleware, routeRichieste);
app.use("/api/solved", authMiddleware, modMiddleware, routeSolved);
app.use("/api/workout", authMiddleware, routeWorkout);
app.use("/api/workouts", authMiddleware, routeWorkouts);
app.use("/api/sessions", authMiddleware, routeSessioni);
app.use("/api/auth", routeAuth);
app.use("/api/feed", authMiddleware, routeFeed);
app.use("/api/pts", authMiddleware, routePts);

// app.listen(PORT, () => {
//     console.log(`Server backend avviato sulla porta ${PORT}`);
// });