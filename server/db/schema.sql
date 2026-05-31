CREATE TABLE IF NOT EXISTS Esercizi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descrizione TEXT NOT NULL,
    img TEXT,
    difficolta INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS GruppiMuscolari (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS EserciziGruppiMuscolari (
    id_esercizio INTEGER,
    id_gruppo_muscolare INTEGER,
    perc REAL NOT NULL DEFAULT 0.0,
    PRIMARY KEY (id_esercizio, id_gruppo_muscolare),
    FOREIGN KEY (id_esercizio) REFERENCES Esercizi(id) ON DELETE CASCADE,
    FOREIGN KEY (id_gruppo_muscolare) REFERENCES GruppiMuscolari(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Nazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL,
    country_code TEXT NOT NULL CHECK(length(country_code) = 2),
    bandiera TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Palestre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    indirizzo TEXT NOT NULL,
    lat REAL NOT NULL DEFAULT 0.0,
    lng REAL NOT NULL DEFAULT 0.0,
    UNIQUE(nome, indirizzo)
);

CREATE TABLE IF NOT EXISTS Citta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    id_nazione INTEGER NOT NULL,
    FOREIGN KEY (id_nazione) REFERENCES Nazioni(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Atleti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE CHECK(length(username) BETWEEN 1 AND 16),
    nome TEXT DEFAULT NULL CHECK(length(nome) BETWEEN 1 AND 256),
    cognome TEXT DEFAULT NULL CHECK(length(cognome) BETWEEN 1 AND 256),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    data_nascita TEXT DEFAULT NULL,
    img TEXT DEFAULT NULL,
    weight REAL NOT NULL CHECK(weight BETWEEN 30 AND 500),
    height REAL NOT NULL CHECK(height BETWEEN 40 AND 240),
    xp_stagionali REAL NOT NULL DEFAULT 0.0,
    livello_stagionale REAL NOT NULL DEFAULT 0.0,
    xp_globali REAL NOT NULL DEFAULT 0.0,
    livello_globale REAL NOT NULL DEFAULT 0.0,
    numero_followers INTEGER NOT NULL DEFAULT 0,
    numero_followed INTEGER NOT NULL DEFAULT 0,
    numero_sessioni INTEGER NOT NULL DEFAULT 0,
    verificato BOOLEAN NOT NULL DEFAULT 0 CHECK(verificato IN (0, 1)),
    id_nazione INTEGER DEFAULT NULL,
    FOREIGN KEY (id_nazione) REFERENCES Nazioni(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS PersonalTrainers (
    id INTEGER PRIMARY KEY,
    email_professionale TEXT NOT NULL,
    id_citta INTEGER NOT NULL,
    id_palestra INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES Atleti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_citta) REFERENCES Citta(id) ON DELETE SET NULL,
    FOREIGN KEY (id_palestra) REFERENCES Palestre(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Follow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_follower INTEGER NOT NULL,
    id_followed INTEGER NOT NULL CHECK(id_followed != id_follower),
    FOREIGN KEY(id_follower) REFERENCES Atleti(id) ON DELETE CASCADE,
    FOREIGN KEY(id_followed) REFERENCES Atleti(id) ON DELETE CASCADE,
    UNIQUE(id_follower, id_followed)
);

CREATE TABLE IF NOT EXISTS Moderatori (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL CHECK(length(username) BETWEEN 8 AND 15),
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS Segnalazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_segnalante INTEGER NOT NULL,
    id_segnalato INTEGER NOT NULL,
    timestamp_creazione INTEGER NOT NULL DEFAULT (strftime('%s','now')), -- Parentesi aggiunte
    motivazione TEXT NOT NULL,
    id_moderatore INTEGER DEFAULT NULL,
    timestamp_risoluzione INTEGER DEFAULT NULL,
    esito TEXT DEFAULT NULL,
    FOREIGN KEY(id_segnalante) REFERENCES Atleti(id) ON DELETE CASCADE,
    FOREIGN KEY(id_segnalato) REFERENCES Atleti(id) ON DELETE CASCADE,
    FOREIGN KEY(id_moderatore) REFERENCES Moderatori(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Richieste (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_richiedente INTEGER NOT NULL,
    timestamp_creazione INTEGER NOT NULL DEFAULT (strftime('%s','now')), -- Parentesi aggiunte
    id_moderatore INTEGER DEFAULT NULL,
    status TEXT DEFAULT NULL CHECK(status IN ("OK", "REJ")),
    timestamp_risoluzione INTEGER DEFAULT NULL,
    FOREIGN KEY(id_richiedente) REFERENCES Atleti(id) ON DELETE CASCADE,
    FOREIGN KEY(id_moderatore) REFERENCES Moderatori(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Workout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_creazione INTEGER NOT NULL,
    id_creatore INTEGER NOT NULL,
    FOREIGN KEY(id_creatore) REFERENCES Atleti(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Sessioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_svolgimento INTEGER NOT NULL,
    pubblica BOOLEAN DEFAULT 1 NOT NULL
);

CREATE TABLE IF NOT EXISTS WorkoutEsercizi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serie INTEGER NOT NULL,
    ripetizioni INTEGER NOT NULL,
    recupero INTEGER NOT NULL,
    id_workout INTEGER NOT NULL,
    id_esercizio INTEGER NOT NULL,
    FOREIGN KEY (id_workout) REFERENCES Workout(id) ON DELETE CASCADE,
    FOREIGN KEY (id_esercizio) REFERENCES Esercizi(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SessioniEsercizi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    peso INTEGER NOT NULL,
    ripetizioni INTEGER NOT NULL,
    recupero INTEGER NOT NULL,
    id_sessione INTEGER NOT NULL,
    id_esercizio INTEGER NOT NULL,
    valida BOOLEAN DEFAULT 1 NOT NULL,
    FOREIGN KEY (id_sessione) REFERENCES Sessioni(id) ON DELETE CASCADE,
    FOREIGN KEY (id_esercizio) REFERENCES Esercizi(id) ON DELETE CASCADE
);