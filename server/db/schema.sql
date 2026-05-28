CREATE TABLE IF NOT EXISTS Esercizi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    desc TEXT NOT NULL,
    img TEXT NOT NULL,
    difficolta INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS GruppiMuscolari (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS EserciziGruppiMuscolari (
    id_esercizio INTEGER,
    id_gruppo_muscolare INTEGER,
    perc INTEGER,
    PRIMARY KEY (id_esercizio, id_gruppo_muscolare),
    FOREIGN KEY (id_esercizio) REFERENCES Esercizi(id) ON DELETE CASCADE,
    FOREIGN KEY (id_gruppo_muscolare) REFERENCES GruppiMuscolari(id) ON DELETE CASCADE,
);