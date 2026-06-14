// require authentication: redirect to login if not authed
if(!sessionStorage.getItem('quiz_admin_authed')){
  window.location.href = 'admin-login.html';
}

function readSubmissions(){
  try{
    const raw = localStorage.getItem('quiz_submissions')||'[]';
    return JSON.parse(raw);
  }catch(e){ return []; }
}

function saveSubmissions(arr){ localStorage.setItem('quiz_submissions', JSON.stringify(arr)); }

function formatTime(ts){ try{ return new Date(ts).toLocaleString(); }catch(e){return ts;} }

function renderList(filter=''){
  const list = document.getElementById('list');
  list.innerHTML='';
  const tmpl = document.getElementById('itemTemplate');
  const subs = readSubmissions().slice().reverse();
  subs.filter(s=>{
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
    node.querySelector('.counts').textContent = `A:${s.counts?.A||0} B:${s.counts?.B||0} C:${s.counts?.C||0} D:${s.counts?.D||0}`;
    node.querySelector('.answers').textContent = (s.answers||[]).join('|');
    node.querySelector('.other').textContent = `Mobile: ${s.mobile||''} • Class: ${s.class||''} • School: ${s.school||''}`;
    const details = node.querySelector('.details');
    item.addEventListener('click', (e)=>{ if(e.target.tagName.toLowerCase()!=='button'){ details.classList.toggle('hidden'); } });
    node.querySelector('.export').addEventListener('click', (ev)=>{ ev.stopPropagation(); exportSingle(s); });
    node.querySelector('.delete').addEventListener('click', (ev)=>{ ev.stopPropagation(); deleteSingle(s.timestamp); });
    list.appendChild(node);
  });
}

function exportSingle(s){
  const header = ['timestamp','name','email','mobile','class','school','recommendation','A','B','C','D','answers'];
  const row = [s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.A||0,s.counts?.B||0,s.counts?.C||0,s.counts?.D||0,'"'+(s.answers||[]).join('|')+'"'];
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
  const arr = readSubmissions();
  if(!arr.length){ alert('No submissions'); return; }
  const header = ['timestamp','name','email','mobile','class','school','recommendation','A','B','C','D','answers'];
  const rows = arr.map(s=>[s.timestamp,s.name,s.email,s.mobile,s.class,s.school,s.recommendation,s.counts?.A||0,s.counts?.B||0,s.counts?.C||0,s.counts?.D||0,'"'+(s.answers||[]).join('|')+'"'].map(v=>typeof v==='string' && v.includes(',')? '"'+v.replace(/"/g,'""')+'"' : v).join(','));
  const csv = header.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = `quiz_submissions_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function clearAll(){ if(!confirm('Clear all submissions? This cannot be undone.')) return; localStorage.removeItem('quiz_submissions'); renderList(); }

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
