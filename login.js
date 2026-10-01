/* ATG 116 POC V1.0.1 | 2026-10-01 | See CHANGELOG.md */

document.getElementById('showPassword').addEventListener('change',e=>document.getElementById('password').type=e.target.checked?'text':'password');
document.getElementById('loginForm').addEventListener('submit',async e=>{
 e.preventDefault();const btn=document.getElementById('loginBtn'),err=document.getElementById('loginError');
 btn.disabled=true;btn.textContent='驗證中…';err.textContent='';
 try{const ok=await ATGAuth.login(document.getElementById('username').value.trim(),document.getElementById('password').value);
 document.getElementById('password').value='';
 if(ok)location.replace('app.html');else err.textContent='帳號或密碼錯誤，請重新輸入。';
 }catch(x){err.textContent=x.message;}finally{btn.disabled=false;btn.textContent='登入系統';}
});
