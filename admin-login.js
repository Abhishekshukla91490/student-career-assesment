document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  const pwdInput = document.getElementById('password');
  const setupBtn = document.getElementById('setupBtn');

  function getStoredPassword(){
    return localStorage.getItem('quiz_admin_password') || 'admin123';
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = pwdInput.value || '';
    if(v === getStoredPassword()){
      sessionStorage.setItem('quiz_admin_authed', '1');
      window.location.href = 'admin.html';
    } else {
      alert('Incorrect password');
    }
  });

  setupBtn.addEventListener('click', ()=>{
    const current = getStoredPassword();
    const newPwd = prompt('Enter new admin password (leave blank to cancel):','');
    if(!newPwd) return;
    if(!confirm('Set new password?')) return;
    localStorage.setItem('quiz_admin_password', newPwd);
    alert('Password updated. Use new password to login.');
  });
});
