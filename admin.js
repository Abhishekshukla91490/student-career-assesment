// require authentication: redirect to login if not authed
if(!sessionStorage.getItem('quiz_admin_authed')){
  window.location.href = 'admin-login.html';
}

const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxWVDyLzWPAZ199fatUENDYFMswC_nnHJ-c8Xwmry3CY8QdhROcDXOnthlMNPHtL0cw/exec';

async function readSubmissions(){
  try {
    // Try to fetch from Google Sheets first (remote/cloud data)
    const response = await fetch(GOOGLE_SHEETS_ENDPOINT, { method: 'GET' });
    if(response.ok){
      const result = await response.json();
      if(result.submissions && Array.isArray(result.submissions)){
        return result.submissions;
      }
    }
  } catch(e) {
    console.log('Google Sheets fetch failed, falling back to localStorage:', e);
  }
  
  // Fallback to localStorage if Google Sheets unavailable
  try {
    const raw = localStorage.getItem('quiz_submissions')||'[]';
    return JSON.parse(raw);
  } catch(e) {
    return [];
  }
}

function saveSubmissions(arr){ localStorage.setItem('quiz_submissions', JSON.stringify(arr)); }

function formatTime(ts){ try{ return new Date(ts).toLocaleString(); }catch(e){return ts;} }

async function renderList(filter=''){
  const list = document.getElementById('list');
  list.innerHTML='<p style="text-align:center;color:#999;">Loading submissions...</p>';
  
  try {
    const subs = await readSubmissions();
    list.innerHTML='';
    const tmpl = document.getElementById('itemTemplate');
    
    subs.slice().reverse().filter(s=>{
      if(!filter) return true;
      const f = filter.toLowerCase();
      return (s.name||'').toLowerCase().includes(f) || (s.email||'').toLowerCase().includes(f);
    }).forEach((s, idx)=>{
      const node = tmpl.content.cloneNode(true);
      const item = node.querySelector('.item');
      node.querySelector('.name').textContent = s.name || '—';
      node.querySelector('.email').textContent = s.email || '';
      node.querySelector('.time').textContent = formatTime(s.timestamp);
      node.querySelector('.rec').textContent = s.recommendation || '';
      
      // Support both old (A/B/C/D) and new (DATA/GRAPHICS/MARKETING/CONTENT_CREATOR) formats
      const countsDisplay = s.counts && (s.counts.DATA !== undefined)
        ? `DATA:${s.counts.DATA||0} GRAPHICS:${s.counts.GRAPHICS||0} MARKETING:${s.counts.MARKETING||0} CONTENT_CREATOR:${s.counts.CONTENT_CREATOR||0}`
        : `A:${s.counts?.A||0} B:${s.counts?.B||0} C:${s.counts?.C||0} D:${s.counts?.D||0}`;
      node.querySelector('.counts').textContent = countsDisplay;
      node.querySelector('.answers').textContent = (s.answers||[]).join('|');
      node.querySelector('.other').textContent = `Mobile: ${s.mobile||''} • Class: ${s.class||''} • School: ${s.school||''}`;
      const details = node.querySelector('.details');
      item.addEventListener('click', (e)=>{ if(e.target.tagName.toLowerCase()!=='button'){ details.classList.toggle('hidden'); } });
      node.querySelector('.export').addEventListener('click', (ev)=>{ ev.stopPropagation(); exportSingle(s); });
      // Note: delete only removes from localStorage, not from Google Sheets
      node.querySelector('.delete').addEventListener('click', (ev)=>{ ev.stopPropagation(); deleteSingle(s.timestamp); });
      list.appendChild(node);
    });
    
    if(subs.length === 0){
      list.innerHTML='<p style="text-align:center;color:#999;">No submissions yet</p>';
    }
  } catch(e) {
    list.innerHTML='<p style="text-align:center;color:red;">Error loading submissions: '+e.message+'</p>';
  }
}

function exportSingle(s){
  // Support both old and new formats
  const isNewFormat = s.counts && s.counts.DATA !== undefined;
  const header = isNewFormat
    ? ['timestamp','name','email','mobile','class','school','recommendation','DATA','GRAPHICS','MARKETING','CONTENT_CREATOR','answers']
    : ['timestamp','name','email','mobile','class','school','recommendation','A','B','C','D','answers'];
  const row = isNewFormat
    ? [s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.DATA||0,s.counts?.GRAPHICS||0,s.counts?.MARKETING||0,s.counts?.CONTENT_CREATOR||0,'"'+(s.answers||[]).join('|')+'"']
    : [s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.A||0,s.counts?.B||0,s.counts?.C||0,s.counts?.D||0,'"'+(s.answers||[]).join('|')+'"'];
  const csv = header.join(',') + '\n' + row.map(v=>typeof v==='string' && v.includes(',')? '"'+v.replace(/"/g,'""')+'"' : v).join(',');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = `submission_${s.timestamp}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function deleteSingle(ts){
  if(!confirm('Delete this submission?')) return;
  const arr = readSubmissions().filter(s=>s.timestamp !== ts);
  saveSubmissions(arr); renderList(document.getElementById('search').value);
}

function exportAll(){
  readSubmissions().then(arr=>{
    if(!arr.length){ alert('No submissions'); return; }
    
    // Detect format from first submission
    const isNewFormat = arr.length > 0 && arr[0].counts && arr[0].counts.DATA !== undefined;
    const header = isNewFormat
      ? ['timestamp','name','email','mobile','class','school','recommendation','DATA','GRAPHICS','MARKETING','CONTENT_CREATOR','answers']
      : ['timestamp','name','email','mobile','class','school','recommendation','A','B','C','D','answers'];
    
    const rows = arr.map(s=>{
      const values = isNewFormat
        ? [s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.DATA||0,s.counts?.GRAPHICS||0,s.counts?.MARKETING||0,s.counts?.CONTENT_CREATOR||0,'"'+(s.answers||[]).join('|')+'"']
        : [s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.A||0,s.counts?.B||0,s.counts?.C||0,s.counts?.D||0,'"'+(s.answers||[]).join('|')+'"'];
      return values.map(v=>typeof v==='string' && v.includes(',')? '"'+v.replace(/"/g,'""')+'"' : v).join(',');
    });
    const csv = header.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download = `quiz_submissions_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
}

function clearAll(){ if(!confirm('Clear all submissions from local storage? (Google Sheets data will remain)')) return; localStorage.removeItem('quiz_submissions'); renderList(); }

document.addEventListener('DOMContentLoaded', ()=>{
  renderList();
  document.getElementById('search').addEventListener('input',(e)=>renderList(e.target.value));
  document.getElementById('exportCsv').addEventListener('click', exportAll);
  document.getElementById('clearAll').addEventListener('click', clearAll);
  const logout = document.getElementById('logout');
  if(logout){
    logout.addEventListener('click', ()=>{ sessionStorage.removeItem('quiz_admin_authed'); window.location.href='admin-login.html'; });
  }
});
