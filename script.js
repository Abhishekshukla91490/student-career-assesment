// 15 questions with hidden category scoring: DATA, GRAPHICS, MARKETING, CONTENT_CREATOR
const questionsData = [
  {
    q: 'Agar tum kisi naye place par jao, to sabse pehle kya karoge?',
    opts: [
      'Aas-paas ki cheezon ko notice karunga',
      'Logon se baat karunga',
      'Photos ya videos lena shuru karunga',
      'Dekhunga yahan kya interesting ho raha hai'
    ],
    categories: ['DATA', 'MARKETING', 'CONTENT_CREATOR', 'GRAPHICS']
  },
  {
    q: 'Jab koi naya kaam milta hai, to tum kya karte ho?',
    opts: [
      'Pehle observe karta hoon',
      'Kisi se discuss karta hoon',
      'Apna unique tareeka try karta hoon',
      'Seedha shuru ho jaata hoon'
    ],
    categories: ['DATA', 'MARKETING', 'GRAPHICS', 'CONTENT_CREATOR']
  },
  {
    q: 'Tumhare dost tumhe kaise describe karenge?',
    opts: [
      'Creative',
      'Friendly',
      'Smart thinker',
      'Leader type'
    ],
    categories: ['GRAPHICS', 'MARKETING', 'DATA', 'CONTENT_CREATOR']
  },
  {
    q: 'Agar ek din poori tarah free ho, to tum kya karoge?',
    opts: [
      'Kuch create karunga',
      'Friends ke saath time spend karunga',
      'Kuch naya seekhunga',
      'Kisi naye idea par kaam karunga'
    ],
    categories: ['GRAPHICS', 'MARKETING', 'DATA', 'CONTENT_CREATOR']
  },
  {
    q: 'School/College ka kaunsa part tumhe zyada pasand aata hai?',
    opts: [
      'Art ya creative activities',
      'Maths aur logical questions',
      'Presentations aur discussions',
      'Practical projects'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'YouTube par kis type ki videos dekhna pasand karte ho?',
    opts: [
      'Design aur creativity wali',
      'Facts aur analysis wali',
      'Social media aur trends wali',
      'Business aur startup wali'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Agar ek project choose karna ho, to tum kya loge?',
    opts: [
      'Poster ya design banana',
      'Data ya information analyse karna',
      'Presentation dena',
      'Team ko manage karna'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Kaunsa game tumhe sabse zyada pasand hai?',
    opts: [
      'Building ya creative games',
      'Puzzle games',
      'Multiplayer social games',
      'Strategy games'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'School event mein tum kya karna pasand karoge?',
    opts: [
      'Decoration aur design',
      'Planning aur calculations',
      'Hosting ya anchoring',
      'Event manage karna'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Weekend par kya karna pasand karoge?',
    opts: [
      'Kuch naya create karna',
      'Brain games khelna',
      'Friends ke saath hangout',
      'Nayi opportunities explore karna'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Future mein tum kis cheez ke liye yaad kiye jana chahoge?',
    opts: [
      'Creativity ke liye',
      'Intelligence ke liye',
      'Communication skills ke liye',
      'Leadership ke liye'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Tumhara dream work environment kaisa hoga?',
    opts: [
      'Creative aur colorful',
      'Organized aur logical',
      'Energetic aur social',
      'Fast-paced aur challenging'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: '5 saal baad tum khud ko kaise dekhte ho?',
    opts: [
      'Kuch unique create karte hue',
      'Kisi skill mein expert bante hue',
      'Bahut saare logon se connected',
      'Apne decisions khud lete hue'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  },
  {
    q: 'Party mein tum usually kya karte ho?',
    opts: [
      'Thode logon ke saath rehta hoon',
      'Sabse milta-julta hoon',
      'Fun activities enjoy karta hoon',
      'Group ko organize karta hoon'
    ],
    categories: ['DATA', 'MARKETING', 'GRAPHICS', 'CONTENT_CREATOR']
  },
  {
    q: 'Group discussion mein tumhara role kya hota hai?',
    opts: [
      'Ideas dena',
      'Sunna aur analyse karna',
      'Sabko engage rakhna',
      'Direction dena'
    ],
    categories: ['GRAPHICS', 'DATA', 'MARKETING', 'CONTENT_CREATOR']
  }
];

const STORAGE_KEY = 'studentCareerQuizState';
const SESSION_KEY = 'studentCareerQuizSessionId';

// Set your deployed Google Apps Script Web App URL here to save submissions remotely.
// Example: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbye1Sb4yCGukGxUiHfMUkGt1JNvCd0rODFQrC2kqkHnELOAHzEtewaMdixfvpJT9891/exec';

function getSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    if (
      state.version === 1 &&
      typeof state.sessionId === 'string' &&
      Array.isArray(state.questionOrder) &&
      state.questionOrder.length === questionsData.length &&
      Array.isArray(state.optionOrder) &&
      state.optionOrder.length === questionsData.length &&
      Array.isArray(state.answers) &&
      state.answers.length === questionsData.length
    ) {
      return state;
    }
  } catch (error) {
    console.warn('Failed to load saved quiz state:', error);
  }
  return null;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSessionId(sessionId) {
  sessionStorage.setItem(SESSION_KEY, sessionId);
}

function getSessionId() {
  return sessionStorage.getItem(SESSION_KEY);
}

function clearSessionId() {
  sessionStorage.removeItem(SESSION_KEY);
}

function clearSavedState() {
  localStorage.removeItem(STORAGE_KEY);
  clearSessionId();
}

function submitToGoogleSheets(submission) {
  if (!GOOGLE_SHEETS_ENDPOINT) return Promise.resolve(null);

  return fetch(GOOGLE_SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
  })
  .then(response => response.json())
  .catch(error => {
    console.warn('Google Sheets submission failed:', error);
    return null;
  });
}

function createQuizState() {
  const questionOrder = questionsData.map((_, index) => index);
  const optionOrder = questionsData.map(() => [0, 1, 2, 3]);
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  saveSessionId(sessionId);
  return {
    version: 1,
    sessionId,
    started: true,
    questionOrder: fisherYatesShuffle(questionOrder),
    optionOrder: optionOrder.map(order => fisherYatesShuffle(order)),
    answers: new Array(questionsData.length).fill(null),
    current: 0
  };
}

function buildQuestionsFromState(state) {
  questions = state.questionOrder.map((questionIndex, questionPosition) => {
    const baseQuestion = questionsData[questionIndex];
    const optionMap = state.optionOrder[questionPosition];
    return {
      q: baseQuestion.q,
      opts: optionMap.map(index => baseQuestion.opts[index]),
      categories: optionMap.map(index => baseQuestion.categories[index])
    };
  });
  answers = state.answers.map(answer => (answer === null ? null : answer));
  current = typeof state.current === 'number' ? Math.max(0, Math.min(state.current, questions.length - 1)) : 0;
}

function updateSavedQuizState() {
  if (!quizState) return;
  quizState.answers = answers.slice();
  quizState.current = current;
  saveState(quizState);
}

// Utility: Fisher-Yates Shuffle
function fisherYatesShuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

let quizState = null;
let questions = [];
let current = 0;
let answers = [];
let lastCounts = null;
let lastChoices = null;
let lastRecommendationText = null;

const entryForm = document.getElementById('entryForm');
const quizSection = document.getElementById('quiz');
const entrySection = document.getElementById('entry');
const resultSection = document.getElementById('result');
const quizForm = document.getElementById('quizForm');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const recommendationEl = document.getElementById('recommendation');
const retakeBtn = document.getElementById('retake');

function renderQuestion(index) {
  quizForm.innerHTML = '';
  const question = questions[index];
  const heading = document.createElement('h3');
  heading.textContent = question.q;
  quizForm.appendChild(heading);

  question.opts.forEach((opt, idx) => {
    const id = `q${index}_opt${idx}`;
    const label = document.createElement('label');
    label.className = 'option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q${index}`;
    input.value = idx;
    input.id = id;
    if (answers[index] === idx) input.checked = true;
    input.addEventListener('change', () => {
      answers[index] = idx;
      nextBtn.disabled = answers[index] === null;
      updateSavedQuizState();
    });

    const span = document.createElement('span');
    span.textContent = opt;

    label.appendChild(input);
    label.appendChild(span);
    quizForm.appendChild(label);
  });

  qIndexEl.textContent = index + 1;
  qTotalEl.textContent = questions.length;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = answers[index] === null;
  nextBtn.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
  current = index;
  updateSavedQuizState();
}

prevBtn.addEventListener('click', () => {
  if (current > 0) {
    renderQuestion(current - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (current < questions.length - 1) {
    renderQuestion(current + 1);
  } else {
    submitQuiz();
  }
});

function formatCategoryDisplay(key) {
  const display = {
    DATA: 'Analytical Thinking',
    GRAPHICS: 'Creative Design',
    MARKETING: 'Marketing & Communication',
    CONTENT_CREATOR: 'Content Creator'
  };
  return display[key] || key;
}

function getCategoryRecommendations(key) {
  const recommendations = {
    DATA: ['Data Analytics', 'MIS Executive', 'Advanced Excel'],
    GRAPHICS: ['Graphic Designing', 'VFX Creator'],
    MARKETING: ['Digital Marketing', 'Social Media Marketing'],
    CONTENT_CREATOR: ['Video Editing', 'Animation', 'Motion Graphics', 'Content Creation']
  };
  return recommendations[key] || [];
}

function getCategoryDescription(key) {
  const descriptions = {
    DATA: 'Aap facts, analysis aur logic mein majboot interest rakhte hain. Data-driven decisions aapke style mein hote hain.',
    GRAPHICS: 'Aap creative thinking, design aur visual expression mein apni strength dhoondte hain.',
    MARKETING: 'Aap audience, communication aur trend-based strategies mein prakashit hote hain.',
    CONTENT_CREATOR: 'Aap storytelling, content creation aur audience engagement ko enjoy karte hain.'
  };
  return descriptions[key] || '';
}

function submitQuiz() {
  const unanswered = answers.filter(answer => answer === null).length;
  if (unanswered > 0) {
    if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
      return;
    }
  }

  const counts = {
    DATA: 0,
    GRAPHICS: 0,
    MARKETING: 0,
    CONTENT_CREATOR: 0
  };

  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex === null) return;
    const category = questions[questionIndex].categories[answerIndex];
    if (counts.hasOwnProperty(category)) {
      counts[category] += 1;
    }
  });

  const total = questions.length;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const scoreGroups = [...new Set(sorted.map(([, value]) => value))];
  const primaryCategories = sorted.filter(([, value]) => value === scoreGroups[0]).map(([key]) => key);
  
  // Pick the first category when there's a tie
  const selectedPrimaryCategory = primaryCategories[0];

  const primaryLabel = formatCategoryDisplay(selectedPrimaryCategory);
  const primaryCourses = getCategoryRecommendations(selectedPrimaryCategory);
  const primaryCoursesHtml = primaryCourses.map(course => `<li>${course}</li>`).join('');
  const breakdownHtml = Object.entries(counts).map(([key, value]) => {
    const percent = Math.round((value / total) * 100);
    return `<li><strong>${formatCategoryDisplay(key)}</strong> (${value}/${total}) — ${percent}%</li>`;
  }).join('');

  let resultHtml = `
    <div class="result-summary">
      <h3>Primary Recommendation</h3>
      <p>${primaryLabel}</p>
      <h4>Suggested Courses</h4>
      <ul>${primaryCoursesHtml}</ul>
      <h3>Score Breakdown</h3>
      <ul>${breakdownHtml}</ul>
    </div>
  `;

  recommendationEl.innerHTML = resultHtml;
  lastCounts = counts;
  lastChoices = answers.map((answerIndex, questionIndex) => answerIndex === null ? '' : questions[questionIndex].categories[answerIndex]);
  lastRecommendationText = primaryLabel;


  try {
    const submission = {
      timestamp: new Date().toISOString(),
      name: (document.getElementById('name') || { value: '' }).value,
      email: (document.getElementById('email') || { value: '' }).value,
      mobile: (document.getElementById('mobile') || { value: '' }).value,
      class: (document.getElementById('class') || { value: '' }).value,
      school: (document.getElementById('school') || { value: '' }).value,
      recommendation: lastRecommendationText,
      counts: lastCounts,
      answers: lastChoices
    };
    const raw = localStorage.getItem('quiz_submissions') || '[]';
    const arr = JSON.parse(raw);
    arr.push(submission);
    localStorage.setItem('quiz_submissions', JSON.stringify(arr));
    
    // Try to send to Google Sheets if endpoint is configured.
    submitToGoogleSheets(submission).then(response => {
      if (response && response.success) {
        console.log('Saved to Google Sheets successfully');
      }
    });
  } catch (e) {
    console.warn('Could not save submission', e);
  }

  clearSavedState();
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
}

function downloadCSV() {
  if (!lastCounts) {
    alert('No result available to export. Please complete the quiz first.');
    return;
  }
  const name = (document.getElementById('name') || { value: '' }).value.replace(/\n/g, ' ').replace(/"/g, '""');
  const email = (document.getElementById('email') || { value: '' }).value.replace(/\n/g, ' ').replace(/"/g, '""');
  const mobile = (document.getElementById('mobile') || { value: '' }).value.replace(/\n/g, ' ').replace(/"/g, '""');
  const cls = (document.getElementById('class') || { value: '' }).value.replace(/\n/g, ' ').replace(/"/g, '""');
  const school = (document.getElementById('school') || { value: '' }).value.replace(/\n/g, ' ').replace(/"/g, '""');
  const timestamp = new Date().toISOString();
  const header = [
    'timestamp',
    'name',
    'email',
    'mobile',
    'class',
    'school',
    'recommendation',
    'DATA_count',
    'GRAPHICS_count',
    'MARKETING_count',
    'CONTENT_CREATOR_count',
    'answers'
  ];
  const row = [
    timestamp,
    name,
    email,
    mobile,
    cls,
    school,
    lastRecommendationText,
    lastCounts.DATA,
    lastCounts.GRAPHICS,
    lastCounts.MARKETING,
    lastCounts.CONTENT_CREATOR,
    '"' + lastChoices.join('|') + '"'
  ];
  const csv = header.join(',') + '\n' + row.map(v => typeof v === 'string' && v.includes(',') ? '"' + v.replace(/"/g, '""') + '"' : v).join(',');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz_result_${timestamp.replace(/[:.]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  const dl = document.getElementById('downloadCsv');
  if (dl) dl.addEventListener('click', downloadCSV);

  const savedState = getSavedState();
  const sessionId = getSessionId();
  if (savedState && sessionId && savedState.sessionId === sessionId) {
    quizState = savedState;
    buildQuestionsFromState(quizState);
    entrySection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    renderQuestion(current);
  } else {
    clearSavedState();
  }
});

retakeBtn.addEventListener('click', () => {
  clearSavedState();
  quizState = null;
  questions = [];
  answers = [];
  current = 0;
  lastCounts = null;
  lastChoices = null;
  lastRecommendationText = null;
  resultSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  entrySection.classList.remove('hidden');
  entryForm.reset();
});

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const savedState = getSavedState();
  const sessionId = getSessionId();
  if (savedState && sessionId && savedState.sessionId === sessionId) {
    quizState = savedState;
  } else {
    clearSavedState();
    quizState = createQuizState();
  }
  saveState(quizState);
  buildQuestionsFromState(quizState);
  entrySection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
  renderQuestion(current);
});
