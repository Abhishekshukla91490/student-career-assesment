// Use the provided Top 10 Student Personality Questions and simple A/B/C/D scoring
const questions = [
  {q: 'School ke group project mein aap kya karna pasand karte ho?', opts: [
    'A. Research aur information collect karna.',
    'B. Poster ya design banana.',
    'C. Presentation dena.',
    'D. Team ko organize karna.'
  ]},
  {q: 'Game khelte waqt sabse zyada maza kis cheez mein aata hai?', opts: [
    'A. Puzzle solve karna aur strategy banana.',
    'B. Character ya world customize karna.',
    'C. Doston ke saath khelna aur baat karna.',
    'D. Team ko jeet tak le jaana.'
  ]},
  {q: 'Free time mein aap kya karna pasand karte ho?', opts: [
    'A. Nayi cheez seekhna ya puzzle solve karna.',
    'B. Drawing, music ya craft banana.',
    'C. Friends se baat karna ya social media dekhna.',
    'D. Naye ideas ya plans banana.'
  ]},
  {q: 'Koi advertisement dekhte ho to sabse pehle kya notice karte ho?', opts: [
    'A. Product ka fayda aur features.',
    'B. Design aur colours.',
    'C. Slogan aur message.',
    'D. Product kitna useful ya successful lag raha hai.'
  ]},
  {q: 'Aapko kis type ki challenge pasand hai?', opts: [
    'A. Tough problem solve karna.',
    'B. Kuch naya aur creative banana.',
    'C. Logon ko convince karna.',
    'D. Team ko lead karna.'
  ]},
  {q: 'Agar school mein ek club join karna ho to?', opts: [
    'A. Science ya Technology Club.',
    'B. Art ya Creativity Club.',
    'C. Media ya Communication Club.',
    'D. Leadership ya Entrepreneurship Club.'
  ]},
  {q: 'Aapko kis tarah ki achievement sabse zyada khushi deti hai?', opts: [
    'A. Mushkil problem solve karna.',
    'B. Kuch unique create karna.',
    'C. Logon ki appreciation milna.',
    'D. Target achieve karna.'
  ]},
  {q: 'Doston ke group mein aap aksar kya role nibhate ho?', opts: [
    'A. Advice dene wala.',
    'B. Ideas dene wala.',
    'C. Sabko connect karne wala.',
    'D. Plans banane wala.'
  ]},
  {q: 'Agar aapko ek YouTube channel banana ho to?', opts: [
    'A. Facts aur learning content.',
    'B. Creative ya artistic content.',
    'C. Entertainment aur social content.',
    'D. Business ya motivational content.'
  ]},
  {q: 'Agar aapke paas ek superpower ho to?', opts: [
    'A. Har problem ka solution dhoondhna.',
    'B. Kuch bhi create kar paana.',
    'C. Sabse easily connect kar paana.',
    'D. Logon ko inspire aur lead kar paana.'
  ]}
];

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

let current = 0;
// answers will store selected option index for each question
let answers = new Array(questions.length).fill(null);
let lastCounts = null;
let lastChoices = null;
let lastRecommendationText = null;

function renderQuestion(i){
  quizForm.innerHTML = '';
  const q = questions[i];
  const h = document.createElement('h3');
  h.textContent = q.q;
  quizForm.appendChild(h);
  q.opts.forEach((opt, idx)=>{
    const id = `q${i}_opt${idx}`;
    const label = document.createElement('label');
    label.className='option';
    const input = document.createElement('input');
    input.type='radio';
    input.name = `q${i}`;
    input.value = idx; // store option index
    input.id = id;
    if(answers[i]===idx) input.checked=true;
    input.addEventListener('change', ()=>{ answers[i]=idx; nextBtn.disabled=false; });
    const span = document.createElement('span');
    // show option letter and text (e.g., "A. ...")
    span.textContent = opt;
    label.appendChild(input);
    label.appendChild(span);
    quizForm.appendChild(label);
  });
  qIndexEl.textContent = i+1;
  qTotalEl.textContent = questions.length;
  // update navigation state
  prevBtn.disabled = (i===0);
  // if already answered, enable next; otherwise disable
  nextBtn.disabled = !answers[i];
  nextBtn.textContent = (i===questions.length-1) ? 'Submit' : 'Next';
}

prevBtn.addEventListener('click', ()=>{
  if(current>0){ current--; renderQuestion(current); }
});

nextBtn.addEventListener('click', ()=>{
  if(current < questions.length-1){ current++; renderQuestion(current); }
  else { submitQuiz(); }
});

function submitQuiz(){
  // ensure all answered (optional)
  const unanswered = answers.filter(a=>a===null).length;
  if(unanswered>0){
    if(!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
  }
  // simple A/B/C/D tally based on provided result calculation
  const counts = {A:0,B:0,C:0,D:0};
  answers.forEach(sel=>{
    if(sel===null) return;
    const letter = ['A','B','C','D'][sel] || 'A';
    counts[letter]++;
  });
  
  // result data with Hindi descriptions and courses
  const resultData = {
    A: {
      emoji: '📊',
      title: 'Data Analytics / MIS / Advanced Excel',
      hindi: 'Aapko data, logic, patterns aur problem-solving pasand hai. Aap facts, analysis aur planning par focus karte hain.',
      courses: ['Data Analytics', 'MIS Executive', 'Advanced Excel', 'Dashboard & Reporting']
    },
    B: {
      emoji: '🎨',
      title: 'Graphics Designing / VFX Creator',
      hindi: 'Aap creative soch rakhte hain aur visuals, colours, design aur imagination mein interest rakhte hain.',
      courses: ['Graphic Designing', 'VFX Creator', 'Photoshop', 'Illustrator', 'Branding Design']
    },
    C: {
      emoji: '📢',
      title: 'Digital Marketing Specialist',
      hindi: 'Aap logon se connect karna, communication, trends aur audience ko samajhna pasand karte hain.',
      courses: ['Digital Marketing', 'Social Media Marketing', 'Content Marketing', 'SEO', 'Online Advertising']
    },
    D: {
      emoji: '🎬',
      title: 'Video Editing / Animator',
      hindi: 'Aapko ideas ko action mein badalna, storytelling, content creation aur engaging experiences banana pasand hai.',
      courses: ['Video Editing', 'Animation', 'Motion Graphics', 'Reels & Content Creation', 'YouTube Video Production']
    }
  };
  
  const combinations = {
    'AC': 'Marketing Analytics',
    'AD': 'Data Driven Content Creator',
    'BC': 'Creative Digital Marketer',
    'BD': 'Graphic Designer + Video Editor',
    'CD': 'Content Creator & Social Media Specialist'
  };
  
  // determine result based on score distribution
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const maxCount = sorted[0][1];
  const maxCategories = sorted.filter(e=>e[1]===maxCount).map(e=>e[0]);
  
  let resultHtml = '';
  let resultText = '';
  
  if(maxCategories.length === 1){
    // single clear winner
    const winner = maxCategories[0];
    const data = resultData[winner];
    const level = maxCount >= 7 ? 'Strong Interest & Natural Fit' : maxCount >= 4 ? 'Good Potential & Learning Interest' : 'Learning Path';
    resultHtml = `
      <strong>${data.emoji} ${data.title}</strong><br/>
      <em>${level}</em><br/>
      <p>${data.hindi}</p>
      <strong>Recommended Courses:</strong><br/>
      ${data.courses.map(c => '• ' + c).join('<br/>')}
    `;
    resultText = `${data.title} - ${level}`;
  }
  else if(maxCategories.length === 2){
    // mixed categories (tie)
    const combo = maxCategories.sort().join('');
    const comboName = combinations[combo] || `${maxCategories.join(' + ')}`;
    const cat1Data = resultData[maxCategories[0]];
    const cat2Data = resultData[maxCategories[1]];
    resultHtml = `
      <strong>🌟 Combination Career Path: ${comboName}</strong><br/>
      <em>Mixed Categories - Combination Interest</em><br/>
      <p><strong>${cat1Data.emoji} ${cat1Data.title}</strong><br/>${cat1Data.hindi}</p>
      <p><strong>${cat2Data.emoji} ${cat2Data.title}</strong><br/>${cat2Data.hindi}</p>
      <strong>Recommended Courses:</strong><br/>
      ${[...cat1Data.courses, ...cat2Data.courses].slice(0,8).map(c => '• ' + c).join('<br/>')}
    `;
    resultText = `${comboName} - Combination Path`;
  }
  else{
    // 3+ way tie (rare)
    resultHtml = `<strong>Diverse Interests</strong><br/>You have interests across multiple fields. Explore all recommended paths and choose based on passion.`;
    resultText = 'Diverse Interests';
  }
  
  recommendationEl.innerHTML = resultHtml;
  // store last result for CSV export
  lastCounts = counts;
  lastChoices = answers.map(a => a===null ? '' : (['A','B','C','D'][a]));
  lastRecommendationText = resultText;
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
}

function downloadCSV(){
  if(!lastCounts){
    alert('No result available to export. Please complete the quiz first.');
    return;
  }
  const name = (document.getElementById('name')||{value:''}).value.replace(/\n/g,' ').replace(/"/g,'""');
  const email = (document.getElementById('email')||{value:''}).value.replace(/\n/g,' ').replace(/"/g,'""');
  const mobile = (document.getElementById('mobile')||{value:''}).value.replace(/\n/g,' ').replace(/"/g,'""');
  const cls = (document.getElementById('class')||{value:''}).value.replace(/\n/g,' ').replace(/"/g,'""');
  const school = (document.getElementById('school')||{value:''}).value.replace(/\n/g,' ').replace(/"/g,'""');
  const timestamp = new Date().toISOString();
  const header = ['timestamp','name','email','mobile','class','school','recommendation','A_count','B_count','C_count','D_count','answers'];
  const row = [timestamp, name, email, mobile, cls, school, lastRecommendationText, lastCounts.A, lastCounts.B, lastCounts.C, lastCounts.D, '"'+lastChoices.join('|')+'"'];
  const csv = header.join(',') + '\n' + row.map(v=>typeof v==='string' && v.includes(',') ? '"'+v.replace(/"/g,'""')+'"' : v).join(',');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz_result_${timestamp.replace(/[:.]/g,'-')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const dl = document.getElementById('downloadCsv');
  if(dl) dl.addEventListener('click', downloadCSV);
});

retakeBtn.addEventListener('click', ()=>{
  // reset
  answers = new Array(questions.length).fill(null);
  current = 0;
  resultSection.classList.add('hidden');
  entrySection.classList.remove('hidden');
});

entryForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  // basic HTML5 validation already enforces required
  entrySection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  renderQuestion(current);
});
