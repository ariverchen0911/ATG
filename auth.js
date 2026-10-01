/* ATG 116 POC V1.0.1 | 2026-10-01 | See CHANGELOG.md */

const ATGAuth=(()=>{
 const config={user:'geoinfor',salt:'f007304291a99be540b696a95bf7a608',hash:'29046c050b91dfae7e76f8801d10e96f3d9a631a93633e7f873a7f7c2bbc0b78',iterations:600000};
 const key='atg116.session.v1'; const TTL=30*60*1000;
 const unhex=s=>Uint8Array.from(s.match(/../g),v=>parseInt(v,16));
 function valid(){try{const s=JSON.parse(sessionStorage.getItem(key));return s&&s.user===config.user&&Number.isFinite(s.at)&&Date.now()-s.at<TTL&&Date.now()>=s.at;}catch{return false;}}
 async function login(user,password){
  if(!globalThis.crypto?.subtle)throw new Error('瀏覽器不支援安全密碼驗證。請改用 localhost 啟動方式。');
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password), 'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:unhex(config.salt),iterations:config.iterations,hash:'SHA-256'},material,256);
  const actual=new Uint8Array(bits), expected=unhex(config.hash);let diff=0;
  for(let i=0;i<expected.length;i++)diff|=actual[i]^expected[i];
  if(diff!==0||user!==config.user)return false;
  sessionStorage.setItem(key,JSON.stringify({user:config.user,at:Date.now()}));return true;
 }
 function requireLogin(){if(!valid()){sessionStorage.removeItem(key);location.replace('index.html');return false;}return true;}
 function logout(){sessionStorage.removeItem(key);location.replace('index.html');}
 return {login,valid,requireLogin,logout};
})();
