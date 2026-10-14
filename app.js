const places = {
  caruggi: { area: 'Centro storico', title: 'Dentro i caruggi', copy: 'Parti da Piazza De Ferrari e raggiungi Piazza San Lorenzo. Da qui puoi esplorare i vicoli del centro storico, passando per Piazza delle Erbe e proseguendo verso il Porto Antico.', tip: 'Le strade del centro possono avere pavimentazioni irregolari. Scegli scarpe comode e controlla sulla mappa il percorso più adatto a te.', query: 'Piazza San Lorenzo Genova' },
  boccadasse: { area: 'Boccadasse', title: 'Dove le case incontrano il mare', copy: 'Boccadasse si trova all’estremità orientale di Corso Italia. La piccola spiaggia e le case affacciate sull’acqua invitano a fermarsi e osservare il borgo.', tip: 'Puoi abbinare la visita a una passeggiata sul lungomare di Corso Italia. Verifica meteo e trasporti prima di partire.', query: 'Boccadasse Genova' },
  castelletto: { area: 'Castelletto', title: 'Genova vista dall’alto', copy: 'La Spianata di Castelletto offre una vista sui tetti del centro storico e sul porto. È un punto da cui leggere la forma della città, tra le colline e il mare.', tip: 'Il belvedere è raggiungibile anche con l’ascensore da Piazza Portello. Controlla orari e disponibilità sul sito ufficiale AMT prima della visita.', query: 'Spianata Castelletto Genova' }
};
const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  let visible = 0;
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'tutti' && card.dataset.category !== button.dataset.filter; if (!card.hidden) visible++; });
  document.querySelector('.filter-status').textContent = `${visible} ${visible === 1 ? 'luogo disponibile' : 'luoghi disponibili'}`;
}));
const dialog = document.querySelector('#place-dialog');
document.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => {
  const place = places[button.dataset.place];
  document.querySelector('#dialog-area').textContent = place.area;
  document.querySelector('#dialog-title').textContent = place.title;
  document.querySelector('#dialog-copy').textContent = place.copy;
  document.querySelector('#dialog-tip').textContent = place.tip;
  document.querySelector('#map-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`;
  dialog.showModal();
}));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });


const quizQuestions = [
  {
    "question": "Percorrendo corso Europa da San Martino verso Nervi, quale successione di quartieri rispetta l’ordine da ponente a levante?",
    "answers": [
      "Sturla → Quinto al Mare → Quarto dei Mille → Nervi",
      "Sturla → Quarto dei Mille → Quinto al Mare → Nervi",
      "Quarto dei Mille → Sturla → Quinto al Mare → Nervi"
    ],
    "correct": 1,
    "explanation": "Da San Martino, corso Europa prosegue verso Sturla, Quarto dei Mille, Quinto al Mare e Nervi."
  },
  {
    "question": "Quale strada costituisce il raccordo tra la zona della stazione di Cornigliano e la direttrice verso Sestri Ponente?",
    "answers": [
      "Via Angelo Siffredi",
      "Via Cornigliano",
      "Via Sestri"
    ],
    "correct": 0,
    "explanation": "Via Angelo Siffredi parte dal nodo della stazione di Cornigliano e prosegue verso Sestri Ponente. Via Sestri è invece nel centro di Sestri."
  },
  {
    "question": "Quale strada, sulla destra idrografica del Bisagno, collega la zona di Borgo Incrociati e Brignole con Marassi?",
    "answers": [
      "Corso Sardegna",
      "Corso Alessandro De Stefanis",
      "Via Canevari"
    ],
    "correct": 2,
    "explanation": "Via Canevari collega Borgo Incrociati e la zona di Brignole con Marassi, sulla sponda destra del Bisagno, guardando verso la foce."
  },
  {
    "question": "Via Bobbio collega Marassi a Staglieno: su quale lato del Bisagno si sviluppa questa direttrice?",
    "answers": [
      "Sulla destra idrografica, lungo la direttrice di via Canevari",
      "Sulla sinistra idrografica, lungo la direttrice di corso Sardegna",
      "Sulla collina di Quezzi, lontano dal fondovalle"
    ],
    "correct": 0,
    "explanation": "Via Bobbio è sul lato destro del Bisagno e collega Marassi a Staglieno. Corso Sardegna e corso De Stefanis appartengono alla direttrice sull’altro lato."
  },
  {
    "question": "Quale strada risale dalla zona di via Bobbio verso piazza Manin, collegando Marassi e Castelletto?",
    "answers": [
      "Via Assarotti",
      "Via Leonardo Montaldo",
      "Via Caffaro"
    ],
    "correct": 1,
    "explanation": "Via Leonardo Montaldo collega la zona di via Bobbio con piazza Manin, mettendo in comunicazione Marassi e Castelletto."
  },
  {
    "question": "Quale via sale dalla zona di piazza del Portello verso Castelletto, anziché partire da piazza Corvetto?",
    "answers": [
      "Via Assarotti",
      "Via Palestro",
      "Via Caffaro"
    ],
    "correct": 2,
    "explanation": "Via Caffaro risale dal Portello verso Castelletto; via Assarotti e via Palestro partono invece dalla zona di piazza Corvetto."
  },
  {
    "question": "Quale strada collega direttamente piazza Corvetto a piazza Manin, risalendo verso Castelletto?",
    "answers": [
      "Via Assarotti",
      "Via Caffaro",
      "Via Leonardo Montaldo"
    ],
    "correct": 0,
    "explanation": "Via Assarotti unisce piazza Corvetto a piazza Manin. Via Caffaro sale dal Portello; via Montaldo arriva a Manin dalla Val Bisagno."
  },
  {
    "question": "In quale quartiere si trova via Posalunga, lungo la viabilità che offre uno sbocco verso Sturla?",
    "answers": [
      "San Fruttuoso",
      "Borgoratti",
      "Albaro"
    ],
    "correct": 1,
    "explanation": "Via Posalunga si trova a Borgoratti. La viabilità di questo quartiere converge sulla strada lungo il collegamento verso Sturla."
  },
  {
    "question": "Quale corso prosegue verso nord la direttrice di corso Sardegna, collegando Marassi con Staglieno sul lato sinistro del Bisagno?",
    "answers": [
      "Corso Montegrappa",
      "Corso Gastaldi",
      "Corso Alessandro De Stefanis"
    ],
    "correct": 2,
    "explanation": "Corso Alessandro De Stefanis continua verso nord la direttrice di corso Sardegna e collega Marassi a Staglieno sulla sinistra idrografica del Bisagno."
  },
  {
    "question": "Attraversando Castelletto lungo la circonvallazione a monte da ponente a levante, quale ordine dei corsi è corretto?",
    "answers": [
      "Corso Firenze → corso Paganini → corso Magenta → corso Solferino → corso Armellini",
      "Corso Firenze → corso Magenta → corso Paganini → corso Armellini → corso Solferino",
      "Corso Armellini → corso Solferino → corso Magenta → corso Paganini → corso Firenze"
    ],
    "correct": 0,
    "explanation": "Da ponente a levante si incontrano Firenze, Paganini, Magenta, Solferino e Armellini; all’estremità orientale si raggiunge piazza Manin."
  }
];
const quizForm = document.querySelector('#quiz-form');
const quizContainer = document.querySelector('#quiz-questions');
const quizResponses = Array(quizQuestions.length).fill(null);
// Il risultato compare automaticamente dopo la decima risposta.
quizForm.querySelector('[type="submit"]').hidden = true;
quizForm.addEventListener('submit', event => event.preventDefault());
function showQuizResult() {
  const score = quizResponses.reduce((total, answer, index) => total + Number(answer === quizQuestions[index].correct), 0);
  document.querySelector('#quiz-score').textContent = `Il tuo punteggio: ${score} / ${quizQuestions.length}`;
  document.querySelector('#quiz-message').textContent = score === 10 ? 'Perfetto! Sai orientarti anche tra le direttrici meno evidenti di Genova.' : score >= 7 ? 'Ottimo risultato per un quiz difficile! Puoi riprovare per migliorare.' : 'Un quiz impegnativo: usa le spiegazioni per conoscere meglio i collegamenti e riprova!';
  document.querySelector('#quiz-result').hidden = false;
}
quizQuestions.forEach((item, index) => {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = `${index + 1}. ${item.question}`;
  fieldset.append(legend);
  const feedback = document.createElement('p');
  feedback.className = 'quiz-feedback';
  feedback.id = `quiz-feedback-${index}`;
  feedback.setAttribute('aria-live', 'polite');
  feedback.hidden = true;
  item.answers.forEach((answer, choice) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `question-${index}`;
    input.value = String(choice);
    input.setAttribute('aria-describedby', feedback.id);
    input.addEventListener('change', () => {
      if (!input.checked || quizResponses[index] !== null) return;
      quizResponses[index] = choice;
      const correct = choice === item.correct;
      feedback.textContent = `${correct ? 'Corretto!' : 'Risposta errata. La risposta corretta è: ' + item.answers[item.correct] + '.'} ${item.explanation}`;
      feedback.hidden = false;
      fieldset.classList.toggle('quiz-correct', correct);
      // Impedisce di cambiare risposta dopo aver letto la spiegazione.
      fieldset.querySelectorAll('input').forEach(option => { option.disabled = true; });
      if (quizResponses.every(response => response !== null)) showQuizResult();
    });
    label.append(input, document.createTextNode(answer));
    fieldset.append(label);
  });
  fieldset.append(feedback);
  quizContainer.append(fieldset);
});
document.querySelector('#quiz-retry').addEventListener('click', () => {
  quizForm.reset();
  quizResponses.fill(null);
  quizContainer.querySelectorAll('input').forEach(input => { input.disabled = false; });
  quizContainer.querySelectorAll('.quiz-feedback').forEach(feedback => { feedback.hidden = true; feedback.textContent = ''; });
  quizContainer.querySelectorAll('fieldset').forEach(fieldset => { fieldset.classList.remove('quiz-correct'); });
  document.querySelector('#quiz-result').hidden = true;
  quizContainer.querySelector('input').focus();
});