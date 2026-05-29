-- ==========================================
-- 1. INSERIMENTO GRUPPI MUSCOLARI
-- ==========================================
INSERT INTO GruppiMuscolari (id, nome) VALUES 
(1, 'Pettorali'),
(2, 'Dorsali'),
(3, 'Deltoidi Anteriori'),
(4, 'Deltoidi Laterali'),
(5, 'Deltoidi Posteriori'),
(6, 'Bicipiti'),
(7, 'Tricipiti'),
(8, 'Avambracci'),
(9, 'Addome / Core'),
(10, 'Quadricipiti'),
(11, 'Femorali'),
(12, 'Glutei'),
(13, 'Polpacci'),
(14, 'Trapezi / Lombari');

-- ==========================================
-- 2. INSERIMENTO ESERCIZI
-- ==========================================
INSERT INTO Esercizi (id, nome, descrizione, img, difficolta) VALUES 
-- PETTO
(1, 'Panca Piana con Bilanciere', 'L''esercizio fondamentale di spinta orizzontale su panca piana.', NULL, 2),
(2, 'Panca Inclinata con Bilanciere', 'Spinta su panca inclinata a 30-45 gradi per colpire i fasci clavicolari del pettorale.', NULL, 2),
(3, 'Panca Declinata con Bilanciere', 'Spinta su panca declinata per enfatizzare i fasci inferiori del petto.', NULL, 2),
(4, 'Spinte con Manubri su Panca Piana', 'Versione con manubri della panca piana, permette un maggiore range of motion (ROM).', NULL, 2),
(5, 'Spinte con Manubri su Panca Inclinata', 'Spinta con manubri su panca a 30-45 gradi. Ottima per l''ipertrofia.', NULL, 2),
(6, 'Croci su Panca Piana con Manubri', 'Esercizio di puro isolamento per il pettorale, aprendo le braccia ad arco.', NULL, 1),
(7, 'Croci su Panca Inclinata con Manubri', 'Isolamento per la parte alta del petto.', NULL, 1),
(8, 'Croci ai Cavi Alti', 'Chiusura ai cavi dall''alto verso il basso per una tensione continua sul petto.', NULL, 1),
(9, 'Croci ai Cavi Bassi', 'Chiusura ai cavi dal basso verso l''alto per il petto alto.', NULL, 2),
(10, 'Chest Press (Macchinario)', 'Spinta orizzontale guidata, ideale per principianti e sfinimento.', NULL, 1),
(11, 'Pec Deck (Macchina per Croci)', 'Isolamento guidato del petto, movimento ad abbraccio.', NULL, 1),
(12, 'Dip alle Parallele (Busto inclinato)', 'Esercizio a corpo libero focalizzato sulla parte inferiore del petto e tricipiti.', NULL, 3),
(13, 'Push-up (Piegamenti a terra)', 'Il classico piegamento sulle braccia a corpo libero.', NULL, 1),
(14, 'Push-up Declinati', 'Piegamenti con i piedi rialzati per enfatizzare il petto alto.', NULL, 2),
(15, 'Pullover con Manubrio', 'Esercizio di allungamento toracico che coinvolge petto e dorsali.', NULL, 2),

-- DORSO
(16, 'Trazioni alla Sbarra (Pull-up)', 'Trazione verticale a corpo libero con presa prona.', NULL, 3),
(17, 'Trazioni Inverse (Chin-up)', 'Trazione verticale a corpo libero con presa supina.', NULL, 2),
(18, 'Lat Machine Presa Larga', 'Trazione verticale al macchinario per l''ampiezza del dorso.', NULL, 1),
(19, 'Lat Machine Presa Stretta (Triangolo)', 'Trazione verticale con focus sul centro schiena e bicipiti.', NULL, 1),
(20, 'Rematore con Bilanciere (Busto Flesso)', 'Fondamentale per lo spessore della schiena. Presa prona o supina.', NULL, 3),
(21, 'Rematore con Manubrio Singolo', 'Esecuzione unilaterale poggiati su panca.', NULL, 2),
(22, 'Pulley Basso', 'Trazione orizzontale da seduti al cavo.', NULL, 1),
(23, 'T-Bar Row (Rematore a T)', 'Rematore con bilanciere incastrato a terra e maniglia a V.', NULL, 2),
(24, 'Pull-down a Braccia Tese', 'Isolamento per il gran dorsale usando il cavo alto.', NULL, 1),
(25, 'Mezzi Stacchi (Rack Pull)', 'Stacco da terra parziale (partendo dalle ginocchia) per la schiena spessa.', NULL, 3),

-- SPALLE
(26, 'Military Press', 'Spinta in alto con bilanciere da in piedi. Re delle spalle.', NULL, 3),
(27, 'Lento Avanti Seduto con Manubri', 'Spinta in alto con manubri, maggiore sicurezza per la bassa schiena.', NULL, 2),
(28, 'Alzate Laterali con Manubri', 'Isolamento puro per il deltoide laterale (larghezza spalle).', NULL, 1),
(29, 'Alzate Laterali ai Cavi', 'Tensione continua sul deltoide laterale usando i cavi bassi.', NULL, 1),
(30, 'Alzate Frontali con Manubri', 'Flessione del braccio in avanti per il deltoide anteriore.', NULL, 1),
(31, 'Alzate Frontali con Disco', 'Variante con un singolo disco tenuto con due mani.', NULL, 1),
(32, 'Alzate a 90 Gradi (Manubri)', 'A busto flesso, per colpire il deltoide posteriore.', NULL, 2),
(33, 'Face Pull ai Cavi', 'Tirata al viso con corda. Essenziale per spalle sane e deltoidi posteriori.', NULL, 1),
(34, 'Pec Deck Inverso (Macchinario)', 'Isolamento guidato per i deltoidi posteriori.', NULL, 1),
(35, 'Scrollate (Shrugs) con Bilanciere', 'Elevazione delle spalle per lo sviluppo del trapezio.', NULL, 1),
-- GAMBE E GLUTEI
(36, 'Squat con Bilanciere', 'Il re degli esercizi. Flessione profonda delle gambe con bilanciere sulle spalle.', NULL, 3),
(37, 'Front Squat', 'Squat con bilanciere in appoggio sui deltoidi anteriori per massimizzare il lavoro sui quadricipiti.', NULL, 3),
(38, 'Pressa 45 Gradi', 'Spinta guidata per le gambe. Permette altissimi carichi in sicurezza per la schiena.', NULL, 1),
(39, 'Affondi con Manubri', 'Passi in avanti flettendo entrambe le ginocchia a 90 gradi. Lavoro unilaterale intenso.', NULL, 2),
(40, 'Bulgarian Split Squat', 'Affondo statico con la gamba posteriore rialzata su una panca.', NULL, 3),
(41, 'Stacchi da Terra (Deadlift)', 'Sollevamento da terra a schiena iperestesa. Coinvolge tutta la catena posteriore.', NULL, 3),
(42, 'Stacchi alla Rumena (RDL)', 'Stacco a gambe semitese, fondamentale per femorali e glutei.', NULL, 2),
(43, 'Hip Thrust con Bilanciere', 'Spinta del bacino verso l''alto con le spalle in appoggio su panca. Re dei glutei.', NULL, 2),
(44, 'Leg Extension', 'Macchinario seduto per l''isolamento totale dei quadricipiti.', NULL, 1),
(45, 'Leg Curl (Sdraiato o Seduto)', 'Macchinario per l''isolamento dei muscoli femorali.', NULL, 1),
(46, 'Calf in Piedi (Macchina o Manubri)', 'Estensione plantare a gamba tesa per stimolare il gastrocnemio.', NULL, 1),
(47, 'Calf Seduto (Macchina)', 'Estensione plantare a ginocchio flesso per stimolare il soleo.', NULL, 1),
(48, 'Abductor Machine', 'Macchinario da seduti per l''esterno coscia e medio gluteo.', NULL, 1),
(49, 'Slanci ai Cavi per Glutei', 'Estensione della gamba all''indietro usando la cavigliera bassa.', NULL, 1),

-- BRACCIA (Bicipiti, Tricipiti)
(50, 'Curl con Bilanciere', 'Flessione delle avambraccia su braccia. Esercizio di massa per bicipiti.', NULL, 2),
(51, 'Curl con Manubri Alternato', 'Flessione alternata con rotazione (supinazione) del polso.', NULL, 1),
(52, 'Hammer Curl (Presa a Martello)', 'Curl mantenendo la presa neutra. Ottimo per brachiale e avambraccio.', NULL, 1),
(53, 'Curl su Panca Scott', 'Isolamento del bicipite con le braccia in appoggio sul cuscino.', NULL, 1),
(54, 'Pushdown Tricipiti ai Cavi', 'Estensione in basso usando la fune o la barra dritta.', NULL, 1),
(55, 'French Press (Skullcrusher)', 'Estensione dei tricipiti sdraiati su panca con bilanciere sagomato (EZ).', NULL, 2),
(56, 'Estensioni Dietro la Nuca', 'Estensione verticale di un manubrio o cavo per il capo lungo del tricipite.', NULL, 2),
(57, 'Kickback con Manubrio', 'Estensione del braccio all''indietro col busto flesso a 90 gradi.', NULL, 1),

-- CORE / ADDOME
(58, 'Crunch a Terra', 'Flessione parziale del busto. Isolamento del retto addominale.', NULL, 1),
(59, 'Plank Tradizionale', 'Tenuta isometrica in appoggio sugli avambracci.', NULL, 1),
(60, 'Leg Raise in Sospensione', 'Sollevamento delle gambe (tese o piegate) appesi alla sbarra.', NULL, 3),
(61, 'Russian Twist con Peso', 'Torsioni del busto da seduti con piedi sollevati per gli obliqui.', NULL, 2),
(62, 'Ab Roller (Ruota per addome)', 'Estensione totale del corpo in avanti controllata dal core.', NULL, 3),
(63, 'Crunch al Cavo (Preghiera)', 'Flessione del busto in ginocchio, usando il sovraccarico del cavo alto.', NULL, 2),
-- CALISTHENICS & STREET WORKOUT
(64, 'Muscle-Up alla Sbarra', 'Movimento esplosivo: trazione alta seguita da un dip per salire sopra la sbarra.', NULL, 3),
(65, 'Front Lever', 'Tenuta isometrica alla sbarra con il corpo perfettamente orizzontale rivolto verso l''alto.', NULL, 3),
(66, 'Planche', 'Tenuta isometrica orizzontale in appoggio solo sulle mani. Richiede forza immensa nei deltoidi.', NULL, 3),
(67, 'Handstand Push-Up (HSPU)', 'Piegamenti in verticale (liberi o al muro). Sviluppo brutale delle spalle.', NULL, 3),
(68, 'Human Flag (Bandiera)', 'Tenuta isometrica laterale su una pertica o spalliera. Tassativo per obliqui e dorso.', NULL, 3),
(69, 'Pistol Squat', 'Squat profondo eseguito su una gamba sola, con l''altra tesa in avanti.', NULL, 3),

-- CROSSFIT & OLYMPIC WEIGHTLIFTING
(70, 'Strappo (Snatch)', 'Portare il bilanciere da terra fin sopra la testa in un unico movimento esplosivo.', NULL, 3),
(71, 'Slancio (Clean and Jerk)', 'Sollevamento in due fasi: girata al petto (clean) e spinta sopra la testa (jerk).', NULL, 3),
(72, 'Thruster', 'Combinazione fluida di un front squat profondo seguito da una spinta (press) sopra la testa.', NULL, 3),
(73, 'Kettlebell Swing', 'Oscillazione esplosiva del kettlebell generata dalla spinta dell''anca (hip hinge).', NULL, 1),
(74, 'Wall Ball', 'Squat profondo lanciando una palla medica contro un bersaglio sul muro.', NULL, 2),
(75, 'Burpees', 'Movimento metabolico: scendere a terra, toccare col petto, alzarsi e saltare.', NULL, 1),

-- POWERLIFTING E FUNZIONALE
(76, 'Box Squat', 'Squat con discesa controllata fino a sedersi su un box. Sviluppa forza esplosiva.', NULL, 3),
(77, 'Good Morning', 'Flessione del busto in avanti con bilanciere sulle spalle. Catena posteriore.', NULL, 2),
(78, 'Turkish Get-Up', 'Alzarsi da terra fino alla posizione eretta tenendo un peso sopra la testa.', NULL, 3),
-- MACCHINARI GAMBE E GLUTEI
(104, 'Adductor Machine (Interno Coscia)', 'Macchinario da seduti in cui si chiudono le gambe contro una resistenza. Isola gli adduttori.', NULL, 1),
(105, 'Glute Drive Machine', 'Macchinario specifico per l''Hip Thrust. Permette di caricare pesi estremi stabilizzando la schiena.', NULL, 1),
(106, 'Seated Leg Curl', 'Variante del Leg Curl da seduti. Mantiene il bacino bloccato e pre-stira i femorali in modo diverso rispetto alla versione sdraiata.', NULL, 1),
(107, 'Standing Leg Curl', 'Macchina per femorali eseguita in piedi a una gamba (unilaterale). Ottima per correggere asimmetrie.', NULL, 1),
(108, 'V-Squat Machine', 'Macchinario per lo squat frontale/inclinato con spallacci. Enorme focus sui quadricipiti rimuovendo il peso dalla colonna.', NULL, 2),
(109, 'Calf Press sulla Leg Press', 'Estensione plantare eseguita spingendo la pedana della pressa a 45 gradi solo con le punte dei piedi.', NULL, 1),
(110, 'Reverse Hyperextension Machine', 'Macchinario in cui il busto è bloccato e si slanciano le gambe all''indietro. Terapeutico per la bassa schiena e ottimo per i glutei.', NULL, 2),

-- MACCHINARI DORSO E SPALLE
(111, 'Assisted Pull-up (Gravitron)', 'Macchina per trazioni con pedana che fornisce assistenza (contropeso). Perfetta per imparare il movimento.', NULL, 1),
(112, 'Pullover Machine', 'Storica macchina che mima il pullover guidando i gomiti. Tensione continua mostruosa sul gran dorsale.', NULL, 2),
(113, 'T-Bar Row Machine (Chest Supported)', 'Rematore a T con appoggio per il petto. Permette di tirare pesante senza affaticare la zona lombare.', NULL, 1),
(114, 'Shrug Machine', 'Macchinario a leve per eseguire le scrollate (trapezi) con una presa neutra e perfetta postura.', NULL, 1),
(115, 'Lateral Raise Machine', 'Macchina per le alzate laterali. I cuscinetti spingono direttamente sulle braccia, isolando i deltoidi laterali.', NULL, 1),

-- MACCHINARI PETTO E BRACCIA
(116, 'Assisted Dip (Gravitron)', 'Variante facilitata delle dip alle parallele grazie al contropeso della macchina.', NULL, 1),
(117, 'Decline Chest Press Machine', 'Macchina di spinta convergente declinata, studiata appositamente per i fasci inferiori del petto.', NULL, 1),
(118, 'Biceps Curl Machine', 'Macchina da seduti (spesso stile panca Scott) per l''isolamento totale e sicuro dei bicipiti.', NULL, 1),
(119, 'Triceps Extension Machine', 'Macchina in cui si estendono le braccia in avanti o in basso, appoggiando i gomiti sui cuscinetti.', NULL, 1),

-- MACCHINARI CORE E LOMBARI
(120, 'Ab Crunch Machine', 'Macchina da seduti che oppone resistenza alla flessione del busto. Permette di sovraccaricare gli addominali.', NULL, 1),
(121, 'Rotary Torso Machine', 'Macchina per le torsioni del busto da seduti. Allenamento specifico e guidato per gli obliqui.', NULL, 1),
(122, 'Back Extension (Hyperextension su panca)', 'Panca inclinata a 45° o 90° per estendere il busto contro la gravità. Fondamentale per i lombari.', NULL, 1),
(123, 'GHD Sit-up', 'Sit-up eseguito sulla Glute Ham Developer. Estrema escursione di movimento, massacrante per il core e i flessori dell''anca.', NULL, 3),
-- AVAMBRACCI E PRESA
(124, 'Wrist Curl con Bilanciere (Flessione polsi)', 'Flessione dei polsi con i palmi rivolti verso l''alto. Isola i flessori dell''avambraccio.', NULL, 1),
(125, 'Reverse Wrist Curl (Estensione polsi)', 'Estensione dei polsi con i palmi rivolti verso il basso. Isola gli estensori dell''avambraccio.', NULL, 1),
(126, 'Farmer''s Walk (Camminata del contadino)', 'Camminare mantenendo due manubri o kettlebell pesanti ai lati del corpo. Devastante per presa, trapezi e core.', NULL, 2),
(127, 'Dead Hang (Sospensione passiva)', 'Appendersi alla sbarra e mantenere la posizione. Ottimo per la forza della presa e la decompressione spinale.', NULL, 1),

-- CORE FUNZIONALE & ROTAZIONALE
(128, 'Woodchopper al Cavo (Taglialegna)', 'Movimento rotazionale tirando il cavo dall''alto verso il basso (o viceversa) in diagonale. Focus su obliqui.', NULL, 2),
(129, 'Pallof Press', 'Spinta isometrica in avanti di un cavo o elastico laterale. Antirotazione pura per il core.', NULL, 2),
(130, 'Toes to Bar (T2B)', 'Appesi alla sbarra, sollevare le gambe tese fino a far toccare le punte dei piedi contro la sbarra stessa.', NULL, 3),

-- SOSPENSIONE (TRX / ANELLI)
(131, 'TRX Row (Rematore in sospensione)', 'Tirata del proprio peso corporeo usando le cinghie di sospensione. Difficoltà regolabile dall''inclinazione.', NULL, 1),
(132, 'TRX Push-up', 'Piegamenti eseguiti con le mani nelle maniglie del TRX. Richiede estrema stabilizzazione del petto e del core.', NULL, 2),
(133, 'TRX Fallout', 'In appoggio sulle maniglie, lasciar cadere il corpo in avanti estendendo le braccia. Come un Ab Roller in sospensione.', NULL, 2),
(134, 'TRX Pistol Squat', 'Pistol squat assistito tenendosi alle maniglie del TRX per bilanciare il peso.', NULL, 2),

-- KETTLEBELL & METABOLICO
(135, 'Kettlebell Clean', 'Portare il kettlebell da in mezzo alle gambe fino alla posizione di rack al petto in modo fluido.', NULL, 2),
(136, 'Kettlebell Snatch', 'Versione a un braccio dello strappo usando il kettlebell. Movimento fluido e continuo fin sopra la testa.', NULL, 3),
(137, 'Battle Ropes (Corde navali)', 'Ondulazioni continue delle corde pesanti. Lavoro metabolico e resistenza per spalle, braccia e core.', NULL, 1),
(138, 'Sandbag Carry', 'Camminata stringendo al petto una sacca di sabbia pesante. Mette a dura prova il core e la capacità respiratoria.', NULL, 2),

-- PLIOMETRIA ED ESPLOSIVITÀ
(139, 'Jump Squat', 'Squat a corpo libero seguito da un salto esplosivo verso l''alto. Attivazione delle fibre bianche.', NULL, 2),
(140, 'Clapping Push-up (Piegamenti battendo le mani)', 'Piegamenti pliometrici esplosivi: si spinge con forza per staccare le mani da terra e batterle in aria.', NULL, 3),

-- STRONGMAN E POTENZA
(141, 'Tire Flip (Ribaltamento copertone)', 'Sollevare e ribaltare un grosso pneumatico da camion. Lavoro di tripla estensione (caviglia, ginocchio, anca).', NULL, 3),
(142, 'Sled Push (Spinta della slitta o Prowler)', 'Spingere una slitta pesante su erba sintetica. Brucia i quadricipiti e alza il battito cardiaco alle stelle.', NULL, 2);

-- ==========================================
-- 3. INSERIMENTO RELAZIONI (Con percentuali d'uso)
-- ==========================================
INSERT INTO EserciziGruppiMuscolari (id_esercizio, id_gruppo_muscolare, perc) VALUES 
-- Panca Piana Bilanciere (70% Petto, 20% Tricipiti, 10% Delt. Anteriori)
(1, 1, 70.0), (1, 7, 20.0), (1, 3, 10.0),
-- Panca Inclinata Bilanciere
(2, 1, 60.0), (2, 3, 25.0), (2, 7, 15.0),
-- Panca Declinata Bilanciere
(3, 1, 75.0), (3, 7, 20.0), (3, 3, 5.0),
-- Spinte Manubri Piana
(4, 1, 75.0), (4, 7, 15.0), (4, 3, 10.0),
-- Spinte Manubri Inclinata
(5, 1, 65.0), (5, 3, 25.0), (5, 7, 10.0),
-- Croci Piana
(6, 1, 90.0), (6, 3, 10.0),
-- Croci Inclinata
(7, 1, 85.0), (7, 3, 15.0),
-- Croci Cavi Alti
(8, 1, 90.0), (8, 3, 10.0),
-- Croci Cavi Bassi
(9, 1, 85.0), (9, 3, 15.0),
-- Chest Press
(10, 1, 75.0), (10, 7, 15.0), (10, 3, 10.0),
-- Pec Deck
(11, 1, 95.0), (11, 3, 5.0),
-- Dip Parallele
(12, 1, 60.0), (12, 7, 30.0), (12, 3, 10.0),
-- Push-up
(13, 1, 65.0), (13, 7, 25.0), (13, 9, 10.0),
-- Push-up declinati
(14, 1, 60.0), (14, 3, 25.0), (14, 7, 15.0),
-- Pullover
(15, 1, 50.0), (15, 2, 40.0), (15, 7, 10.0),

-- Trazioni Sbarra
(16, 2, 70.0), (16, 6, 20.0), (16, 8, 10.0),
-- Chin-up
(17, 2, 50.0), (17, 6, 40.0), (17, 8, 10.0),
-- Lat Machine Larga
(18, 2, 75.0), (18, 6, 15.0), (18, 5, 10.0),
-- Lat Machine Stretta
(19, 2, 60.0), (19, 6, 30.0), (19, 14, 10.0),
-- Rematore Bilanciere
(20, 2, 65.0), (20, 14, 15.0), (20, 6, 15.0), (20, 9, 5.0),
-- Rematore Manubrio
(21, 2, 70.0), (21, 6, 20.0), (21, 5, 10.0),
-- Pulley Basso
(22, 2, 65.0), (22, 14, 20.0), (22, 6, 15.0),
-- T-Bar Row
(23, 2, 60.0), (23, 14, 25.0), (23, 6, 15.0),
-- Pull-down braccia tese
(24, 2, 85.0), (24, 7, 10.0), (24, 9, 5.0),
-- Rack Pull
(25, 14, 50.0), (25, 2, 30.0), (25, 12, 20.0),

-- Military Press
(26, 3, 60.0), (26, 4, 15.0), (26, 7, 15.0), (26, 9, 10.0),
-- Lento Manubri
(27, 3, 65.0), (27, 4, 20.0), (27, 7, 15.0),
-- Alzate Laterali Manubri
(28, 4, 90.0), (28, 14, 10.0),
-- Alzate Laterali Cavi
(29, 4, 95.0), (29, 14, 5.0),
-- Alzate Frontali Manubri
(30, 3, 90.0), (30, 1, 10.0),
-- Alzate Frontali Disco
(31, 3, 90.0), (31, 1, 10.0),
-- Alzate 90 Gradi
(32, 5, 80.0), (32, 14, 20.0),
-- Face Pull
(33, 5, 50.0), (33, 14, 30.0), (33, 4, 20.0),
-- Pec Deck Inverso
(34, 5, 85.0), (34, 14, 15.0),
-- Shrugs
(35, 14, 95.0), (35, 8, 5.0),
-- Squat Bilanciere (60% Quadricipiti, 25% Glutei, 15% Femorali)
(36, 10, 60.0), (36, 12, 25.0), (36, 11, 15.0),
-- Front Squat
(37, 10, 75.0), (37, 12, 15.0), (37, 9, 10.0),
-- Pressa 45
(38, 10, 70.0), (38, 12, 20.0), (38, 11, 10.0),
-- Affondi
(39, 10, 50.0), (39, 12, 40.0), (39, 11, 10.0),
-- Bulgarian Split Squat
(40, 10, 45.0), (40, 12, 45.0), (40, 11, 10.0),
-- Deadlift (Stacco Classico - Grande distribuzione catena posteriore)
(41, 11, 35.0), (41, 12, 30.0), (41, 14, 25.0), (41, 10, 10.0),
-- RDL (Stacco Rumeno)
(42, 11, 60.0), (42, 12, 30.0), (42, 14, 10.0),
-- Hip Thrust
(43, 12, 80.0), (43, 11, 15.0), (43, 10, 5.0),
-- Leg Extension
(44, 10, 100.0),
-- Leg Curl
(45, 11, 100.0),
-- Calf in Piedi
(46, 13, 100.0),
-- Calf Seduto
(47, 13, 100.0),
-- Abductor
(48, 12, 100.0),
-- Slanci Glutei
(49, 12, 90.0), (49, 11, 10.0),

-- Curl Bilanciere
(50, 6, 90.0), (50, 8, 10.0),
-- Curl Manubri
(51, 6, 95.0), (51, 8, 5.0),
-- Hammer Curl
(52, 6, 60.0), (52, 8, 40.0),
-- Curl Scott
(53, 6, 100.0),
-- Pushdown
(54, 7, 100.0),
-- French Press
(55, 7, 95.0), (55, 8, 5.0),
-- Estensioni Nuca
(56, 7, 100.0),
-- Kickback
(57, 7, 100.0),

-- Crunch
(58, 9, 100.0),
-- Plank
(59, 9, 85.0), (59, 3, 10.0), (59, 10, 5.0),
-- Leg Raise
(60, 9, 75.0), (60, 10, 25.0),
-- Russian Twist
(61, 9, 100.0),
-- Ab Roller
(62, 9, 80.0), (62, 2, 15.0), (62, 7, 5.0),
-- Crunch al Cavo
(63, 9, 100.0),
-- Muscle-Up (40% Dorso, 30% Petto/Dip, 20% Tricipiti, 10% Core)
(64, 2, 40.0), (64, 1, 30.0), (64, 7, 20.0), (64, 9, 10.0),
-- Front Lever (60% Dorso, 30% Core, 10% Bicipiti)
(65, 2, 60.0), (65, 9, 30.0), (65, 6, 10.0),
-- Planche (60% Deltoidi Anteriori, 20% Petto, 20% Core)
(66, 3, 60.0), (66, 1, 20.0), (66, 9, 20.0),
-- Handstand Push-Up (50% Delt. Anteriori, 20% Delt. Laterali, 30% Tricipiti)
(67, 3, 50.0), (67, 4, 20.0), (67, 7, 30.0),
-- Human Flag (50% Core/Obliqui, 25% Dorso, 25% Spalle)
(68, 9, 50.0), (68, 2, 25.0), (68, 4, 25.0),
-- Pistol Squat (60% Quadricipiti, 30% Glutei, 10% Core/Equilibrio)
(69, 10, 60.0), (69, 12, 30.0), (69, 9, 10.0),

-- Snatch (30% Femorali, 20% Glutei, 20% Trapezi/Lombari, 20% Spalle, 10% Core)
(70, 11, 30.0), (70, 12, 20.0), (70, 14, 20.0), (70, 3, 20.0), (70, 9, 10.0),
-- Clean and Jerk (30% Quadricipiti, 20% Glutei, 20% Trapezi, 20% Spalle, 10% Tricipiti)
(71, 10, 30.0), (71, 12, 20.0), (71, 14, 20.0), (71, 3, 20.0), (71, 7, 10.0),
-- Thruster (40% Quadricipiti, 20% Glutei, 30% Delt. Anteriori, 10% Tricipiti)
(72, 10, 40.0), (72, 12, 20.0), (72, 3, 30.0), (72, 7, 10.0),
-- Kettlebell Swing (40% Femorali, 40% Glutei, 20% Lombari)
(73, 11, 40.0), (73, 12, 40.0), (73, 14, 20.0),
-- Wall Ball (40% Quadricipiti, 20% Glutei, 30% Spalle, 10% Petto)
(74, 10, 40.0), (74, 12, 20.0), (74, 3, 30.0), (74, 1, 10.0),
-- Burpees (30% Petto, 30% Quadricipiti, 25% Core, 15% Spalle)
(75, 1, 30.0), (75, 10, 30.0), (75, 9, 25.0), (75, 3, 15.0),

-- Box Squat (45% Glutei, 30% Femorali, 25% Quadricipiti)
(76, 12, 45.0), (76, 11, 30.0), (76, 10, 25.0),
-- Good Morning (50% Femorali, 30% Lombari, 20% Glutei)
(77, 11, 50.0), (77, 14, 30.0), (77, 12, 20.0),
-- Turkish Get-Up (40% Core, 30% Spalle, 15% Quadricipiti, 15% Glutei)
(78, 9, 40.0), (78, 3, 30.0), (78, 10, 15.0), (78, 12, 15.0),
-- Adductor Machine
(104, 10, 50.0), (104, 12, 50.0),
-- Glute Drive
(105, 12, 85.0), (105, 11, 15.0),
-- Seated Leg Curl
(106, 11, 100.0),
-- Standing Leg Curl
(107, 11, 100.0),
-- V-Squat Machine
(108, 10, 80.0), (108, 12, 20.0),
-- Calf Press su Leg Press
(109, 13, 100.0),
-- Reverse Hyperextension
(110, 14, 50.0), (110, 12, 40.0), (110, 11, 10.0),

-- Gravitron Pull-up
(111, 2, 70.0), (111, 6, 30.0),
-- Pullover Machine
(112, 2, 70.0), (112, 1, 30.0),
-- T-Bar Chest Supported
(113, 2, 80.0), (113, 6, 10.0), (113, 5, 10.0),
-- Shrug Machine
(114, 14, 100.0),
-- Lateral Raise Machine
(115, 4, 100.0),

-- Gravitron Dip
(116, 1, 50.0), (116, 7, 40.0), (116, 3, 10.0),
-- Decline Chest Press
(117, 1, 80.0), (117, 7, 15.0), (117, 3, 5.0),
-- Biceps Curl Machine
(118, 6, 100.0),
-- Triceps Extension Machine
(119, 7, 100.0),

-- Ab Crunch Machine
(120, 9, 100.0),
-- Rotary Torso
(121, 9, 100.0),
-- Hyperextension
(122, 14, 60.0), (122, 11, 20.0), (122, 12, 20.0),
-- GHD Sit-up
(123, 9, 70.0), (123, 10, 30.0),
-- Wrist Curl (Flessori)
(124, 8, 100.0),
-- Reverse Wrist Curl (Estensori)
(125, 8, 100.0),
-- Farmer's Walk (Presa, Trapezi, Core)
(126, 8, 40.0), (126, 14, 40.0), (126, 9, 20.0),
-- Dead Hang
(127, 8, 70.0), (127, 2, 30.0),

-- Woodchopper
(128, 9, 80.0), (128, 3, 20.0),
-- Pallof Press
(129, 9, 100.0),
-- Toes to Bar
(130, 9, 70.0), (130, 2, 20.0), (130, 8, 10.0),

-- TRX Row
(131, 2, 60.0), (131, 6, 20.0), (131, 9, 20.0),
-- TRX Push-up
(132, 1, 60.0), (132, 7, 20.0), (132, 9, 20.0),
-- TRX Fallout
(133, 9, 80.0), (133, 2, 10.0), (133, 7, 10.0),
-- TRX Pistol Squat
(134, 10, 60.0), (134, 12, 30.0), (134, 2, 10.0),

-- KB Clean (Femorali, Glutei, Trapezi, Braccia)
(135, 11, 30.0), (135, 12, 30.0), (135, 14, 20.0), (135, 6, 20.0),
-- KB Snatch (Come il Clean ma con più enfasi su spalle e core per stabilizzare)
(136, 11, 25.0), (136, 12, 25.0), (136, 14, 20.0), (136, 3, 20.0), (136, 9, 10.0),
-- Battle Ropes (Spalle, Dorso, Petto, Core in isometria)
(137, 3, 40.0), (137, 2, 20.0), (137, 1, 20.0), (137, 9, 20.0),
-- Sandbag Carry
(138, 9, 40.0), (138, 10, 20.0), (138, 14, 20.0), (138, 8, 20.0),

-- Jump Squat
(139, 10, 60.0), (139, 13, 20.0), (139, 12, 20.0),
-- Clapping Push-up
(140, 1, 70.0), (140, 7, 20.0), (140, 3, 10.0),

-- Tire Flip (Catena posteriore, Gambe e un po' di dorso)
(141, 10, 30.0), (141, 11, 20.0), (141, 12, 20.0), (141, 14, 20.0), (141, 2, 10.0),
-- Sled Push
(142, 10, 70.0), (142, 12, 20.0), (142, 13, 10.0);