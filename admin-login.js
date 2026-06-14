document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  const pwdInput = document.getElementById('password');

  function getStoredPassword(){
    return localStorage.getItem('quiz_admin_password') || 'dmcounslor@26';
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
});
