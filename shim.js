/* Puente: el tablero de siempre, servido desde GitHub. Login con Supabase y llamadas al servidor de Google. */
(function(){
  var API = "https://script.google.com/macros/s/AKfycbzsq8e0UgrugGzbZy1xCSicQPfHu2d9Ui5Nb5fUnXEO_Jds-2y2SJfckSsZuj1yz4S7/exec";
  var SB = window.supabase.createClient("https://ymraduqedgmvstmlqevx.supabase.co", "sb_publishable_s-fvStpdSozLEcaZ-tuRNw_Zk70WObS",
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "nervo-sesion" } });
  window.__sb = SB;
  var espera = null;
  function token(){
    return SB.auth.getSession().then(function(r){
      var s = r && r.data && r.data.session;
      if (s && s.expires_at && s.expires_at * 1000 < Date.now() + 60000) return SB.auth.refreshSession().then(function(x){ var n = x && x.data && x.data.session; return n ? n.access_token : s.access_token; }, function(){ return s.access_token; });
      if (s) return s.access_token;
      if (!espera) espera = new Promise(function(ok){
        var sub = SB.auth.onAuthStateChange(function(ev, ses){ if (ses && ses.access_token){ quitarLogin(); ok(ses.access_token); } });
        mostrarLogin();
      });
      return espera;
    });
  }
  function rawCall(name, args){
    return token().then(function(t){ return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: name, args: args || [], token: t }) }); })
      .then(function(r){ return r.json(); }).then(function(j){ if (j.ok) return j.r; throw new Error(j.e); });
  }
  window.__nvGRun = rawCall; window.__nvTok = token;
  function runner(ok, fail){
    return new Proxy({}, { get: function(_, name){
      if (name === "withSuccessHandler") return function(f){ return runner(f, fail); };
      if (name === "withFailureHandler") return function(f){ return runner(ok, f); };
      if (name === "withUserObject") return function(){ return runner(ok, fail); };
      return function(){
        var args = Array.prototype.slice.call(arguments);
        var LOC = window.__nvLocal; var usarGoogle = false; try { usarGoogle = localStorage.getItem("nv-google") === "1"; } catch(e){}
        if (LOC && LOC[name] && !usarGoogle){
          LOC[name](args, function(r2){ try { if (ok) ok(r2); } catch(e3){} }).then(function(r){ if (ok) ok(r); }, function(e){
            if (name === "leerTodo") { rawCall(name, args).then(function(r){ if (ok) ok(r); }, function(e2){ if (fail) fail(e2); else console.error(e2); }); return; }
            if (fail) fail(e); else console.error(e);
          });
          return;
        }
        token().then(function(t){
          return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: name, args: args, token: t }) });
        }).then(function(r){ return r.json(); }).then(function(j){
          if (j.ok) { if (/^base(Guardar|Borrar)/.test(name) && window.__nvBaseCambio) { try { window.__nvBaseCambio(); } catch(e){} } if (ok) ok(j.r); }
          else { if (/Sin acceso/.test(j.e)) { SB.auth.signOut(); } if (fail) fail(new Error(j.e)); else console.error(j.e); }
        }).catch(function(e){ if (fail) fail(e); else console.error(e); });
      };
    }});
  }
  window.google = { script: { run: runner(null, null), host: { close: function(){}, setHeight: function(){} },
    url: { getLocation: function(cb){ cb({ parameter: {}, parameters: {}, hash: "" }); } } } };

  /* ---------- pantalla de entrada ---------- */
  var caja = null, modo = "entrar";
  var LOGO = '<svg viewBox="0 0 501 425" width="70"><path fill="#684F3A" d="M432 411C439 410 447 409 450 408C460 406 491 390 491 387C491 385 490 386 485 389C466 400 438 404 415 401C368 393 329 357 315 308C307 280 306 269 305 199C304 140 304 129 300 112C290 57 254 18 208 12C166 7 129 24 105 59C98 69 98 69 98 48C97 24 95 11 92 13C88 15 54 30 53 30C52 30 48 31 43 33C35 35 22 38 15 38C11 38 9 40 10 42C11 42 14 43 17 43C37 45 46 58 49 86C50 98 50 274 49 298C47 327 41 339 27 342C24 342 23 343 23 344C24 346 34 347 65 347C78 347 89 348 89 348C90 348 93 348 96 348C99 347 106 347 110 346C115 346 120 346 121 345C123 345 122 342 118 341C108 339 102 331 99 316C98 307 97 115 99 101C101 85 108 64 113 59C116 56 117 54 116 54C115 54 124 45 132 39C138 34 143 31 148 30C152 29 158 27 161 26C166 25 187 26 193 28C202 31 212 37 216 41C219 43 221 45 223 46C230 52 239 68 245 86C253 109 254 121 255 190C256 220 256 247 256 248C257 250 257 255 258 260C261 286 269 310 281 332C289 347 290 348 292 351C294 352 297 356 299 359C316 382 358 407 385 410C387 410 390 410 391 410C392 411 395 411 398 412C402 412 405 412 405 412C405 413 424 412 432 411ZM469 300C489 290 489 261 469 251C448 241 425 266 436 288C443 300 457 306 469 300Z"/></svg>';
  var MAILS = { euge: "eugeabdon@gmail.com", pau: "mpauabdon@gmail.com", nervo: "nervodesigncordoba@gmail.com" };
  var PERMITIDOS = [MAILS.euge, MAILS.pau, MAILS.nervo];
  var GSVG = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 48 48\"><path fill=\"#EA4335\" d=\"M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.6 9.5 24 9.5z\"/><path fill=\"#4285F4\" d=\"M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.2 7-17.6z\"/><path fill=\"#FBBC05\" d=\"M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z\"/><path fill=\"#34A853\" d=\"M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.4 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z\"/></svg>";
  var CSSG = "#nv-login .gg{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);background:rgba(255,255,255,.85);color:var(--ink);border-radius:14px;padding:12px;font:inherit;font-size:15px;font-weight:500;cursor:pointer;box-shadow:0 4px 14px rgba(58,36,28,.08);margin-bottom:6px}#nv-login .gg:hover{background:#fff}#nv-login.noche .gg{background:rgba(255,245,235,.08)}#nv-login .sep{display:flex;align-items:center;gap:10px;margin:12px 0 14px;color:var(--sub);font-size:12px}#nv-login .sep::before,#nv-login .sep::after{content:'';flex:1;height:1px;background:var(--line)}";
  function temaGuardado(){ try { return localStorage.getItem("nv-tema") || ""; } catch(e){ return ""; } }
  function mostrarLogin(){
    if (caja) return;
    var st = document.createElement("style");
    st.textContent = "#nv-login{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Outfit,system-ui,sans-serif;color:#3A241C;overflow:hidden;background:#FBF8F4;--ink:#3A241C;--sub:#8E7869;--card:rgba(255,253,251,.78);--line:rgba(120,90,70,.14)}\n#nv-login .esc{position:absolute;inset:0;pointer-events:none;overflow:hidden}\n#nv-login .cielo{position:absolute;inset:0;background:linear-gradient(180deg,#E6EEF4 0%,#F1F3F2 38%,#FAF6F1 62%,#F4EDE5 100%);transition:background 1.2s}\n#nv-login .nube{position:absolute;border-radius:50%;background:#fff;filter:blur(28px);opacity:.85;animation:nvNube 70s linear infinite}\n#nv-login .nube.a{width:520px;height:150px;top:6%;left:-10%}\n#nv-login .nube.b{width:420px;height:120px;top:16%;left:40%;animation-duration:95s;animation-delay:-30s;opacity:.7}\n#nv-login .nube.c{width:360px;height:110px;top:3%;left:75%;animation-duration:120s;animation-delay:-60s;opacity:.6}\n@keyframes nvNube{from{transform:translateX(-30vw)}to{transform:translateX(70vw)}}\n#nv-login .mar{position:absolute;left:0;right:0;top:44%;height:20%;background:linear-gradient(180deg,#C9DAE6 0%,#B4CCDD 55%,#C7D8E3 100%);transition:background 1.2s}\n#nv-login .mar::before,#nv-login .mar .b2{content:\"\";position:absolute;inset:0;background-image:radial-gradient(1.6px 1px at 10px 8px,rgba(255,255,255,.95),transparent 70%),radial-gradient(2.2px 1px at 70px 22px,rgba(255,255,255,.85),transparent 70%),radial-gradient(1.4px .8px at 120px 14px,rgba(255,255,255,.9),transparent 70%),radial-gradient(3px 1px at 160px 30px,rgba(255,255,255,.7),transparent 70%);background-size:190px 38px;animation:nvBrillo 14s linear infinite,nvTit2 2.6s ease-in-out infinite alternate}\n#nv-login .mar::before{background-image:linear-gradient(180deg,rgba(255,255,255,.25),transparent 30%),radial-gradient(1.6px 1px at 10px 8px,rgba(255,255,255,.95),transparent 70%),radial-gradient(2.2px 1px at 70px 22px,rgba(255,255,255,.85),transparent 70%),radial-gradient(1.4px .8px at 120px 14px,rgba(255,255,255,.9),transparent 70%),radial-gradient(3px 1px at 160px 30px,rgba(255,255,255,.7),transparent 70%);background-size:100% 100%,190px 38px,190px 38px,190px 38px,190px 38px}\n@keyframes nvBrillo{from{background-position:0 0,0 0,0 0,0 0,0 0}to{background-position:0 0,190px 0,190px 0,190px 0,190px 0}}\n@keyframes nvTit2{from{opacity:.55}to{opacity:1}}\n#nv-login .mar::after{content:\"\";position:absolute;left:0;right:0;top:0;height:1px;background:rgba(255,255,255,.7)}\n#nv-login .isla{position:absolute;left:8%;top:calc(44% - 34px);width:280px;height:40px;background:#BDCCD7;border-radius:60% 70% 0 0/100% 100% 0 0;filter:blur(1px);opacity:.75;transition:background 1.2s}\n#nv-login .piso{position:absolute;left:0;right:0;bottom:0;height:36%;background:linear-gradient(180deg,#EFE7DE 0%,#F4EEE7 100%);transition:background 1.2s}\n#nv-login .pared{position:absolute;right:0;top:0;bottom:36%;width:38%;background:#FAF6F0;box-shadow:-30px 0 60px rgba(120,95,75,.10) inset;transition:background 1.2s}\n#nv-login .arco{position:absolute;right:22%;bottom:0;width:34%;max-width:190px;height:62%;border-radius:999px 999px 0 0;background:linear-gradient(180deg,#B9CEDF,#9EB9CF);box-shadow:inset 0 0 0 10px #F4EEE6,inset 0 0 0 11px rgba(120,95,75,.12);transition:background 1.2s}\n#nv-login .sombra{position:absolute;top:-8%;right:-6%;width:70vw;max-width:820px;height:auto;opacity:.16;filter:blur(7px);transform-origin:92% 4%;animation:nvPalma 8s ease-in-out infinite alternate;mix-blend-mode:multiply}\n#nv-login .sombra.dos{top:auto;bottom:-18%;left:-10%;right:auto;width:60vw;opacity:.10;filter:blur(10px);transform-origin:10% 100%;animation-duration:11s;animation-delay:-4s}\n@keyframes nvPalma{0%{transform:rotate(-2.5deg) translateY(0)}50%{transform:rotate(1.5deg) translateY(6px)}100%{transform:rotate(3deg) translateY(-4px)}}\n#nv-login .luz{position:absolute;inset:0;background:radial-gradient(circle at 80% 8%,rgba(255,244,225,.55),transparent 40%);transition:opacity 1.2s}\n#nv-login .luna{position:absolute;top:9%;left:14%;width:70px;height:70px;border-radius:50%;background:#F3EAD8;box-shadow:0 0 60px 20px rgba(243,234,216,.25);opacity:0;transition:opacity 1.2s}\n#nv-login .est{position:absolute;inset:0 0 56% 0;opacity:0;transition:opacity 1.2s;background-image:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 12%,#fff,transparent),radial-gradient(1.5px 1.5px at 75% 40%,#fff,transparent),radial-gradient(1px 1px at 40% 55%,#fff,transparent),radial-gradient(1px 1px at 88% 20%,#fff,transparent),radial-gradient(1px 1px at 8% 50%,#fff,transparent);animation:nvTit 4s ease-in-out infinite alternate}\n@keyframes nvTit{from{filter:brightness(.7)}to{filter:brightness(1.3)}}\n#nv-login .c{position:relative;width:100%;max-width:390px;background:var(--card);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);border:1px solid rgba(255,255,255,.7);border-radius:28px;padding:30px 28px;box-shadow:0 24px 60px rgba(58,36,28,.14),0 2px 6px rgba(58,36,28,.05);transition:background .8s,border-color .8s}\n#nv-login .c svg.logo path{fill:var(--ink)}\n#nv-login small{display:block;font-size:10px;letter-spacing:.24em;color:var(--sub);margin:8px 0 22px}\n#nv-login h1{font-size:26px;font-weight:500;margin:0 0 4px;letter-spacing:-.02em}\n#nv-login p{color:var(--sub);font-size:14px;margin:0 0 16px;font-weight:300}\n#nv-login label{display:block;font-size:12px;color:var(--sub);margin:0 0 12px}\n#nv-login input{display:block;width:100%;box-sizing:border-box;margin-top:5px;border:1px solid var(--line);background:rgba(255,255,255,.75);color:var(--ink);border-radius:14px;padding:12px 14px;font:inherit;font-size:15px;outline:0}\n#nv-login input:focus{border-color:#DFB9B6;background:#fff}\n#nv-login .quien{display:flex;gap:8px;margin:-4px 0 14px}\n#nv-login .quien button{flex:1;border:1px solid var(--line);background:rgba(255,255,255,.6);color:var(--ink);border-radius:999px;padding:7px 0;font:inherit;font-size:13px;cursor:pointer;transition:all .2s}\n#nv-login .quien button.on{background:#59392D;color:#fff;border-color:#59392D}\n#nv-login button.p{width:100%;border:0;border-radius:14px;padding:13px;background:#59392D;color:#fff;font:inherit;font-weight:500;font-size:15px;cursor:pointer;margin-top:4px;box-shadow:0 8px 20px rgba(89,57,45,.25)}\n#nv-login .alt{display:flex;justify-content:space-between;margin-top:14px}\n#nv-login .alt button{border:0;background:none;color:var(--sub);font:inherit;font-size:13px;cursor:pointer;padding:0}\n#nv-login .m{font-size:13px;margin-top:12px;padding:10px 12px;border-radius:12px;background:#F7ECEC;color:#9A5F5A}\n#nv-login .m.ok{background:#EEF3EC;color:#5B6E57}\n#nv-login .tema{position:absolute;top:18px;right:18px;z-index:2;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.7);background:rgba(255,253,251,.7);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(58,36,28,.12);transition:transform .3s}\n#nv-login .tema:hover{transform:rotate(-12deg) scale(1.05)}\n#nv-login .tema svg{width:28px;height:28px;stroke:#6C4D38;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}\n#nv-login .tema .sol{display:block}#nv-login .tema .lun{display:none}\n#nv-login.noche{--ink:#F3EAE0;--sub:#B9A99C;--card:rgba(42,34,31,.62);--line:rgba(255,240,225,.14);background:#1C1F27;color:var(--ink)}\n#nv-login.noche .cielo{background:linear-gradient(180deg,#141A26 0%,#232838 40%,#2B2A33 62%,#2A2521 100%)}\n#nv-login.noche .nube{opacity:.08}\n#nv-login.noche .mar{background:linear-gradient(180deg,#2A3B4C 0%,#22313F 60%,#2C3A46 100%)}\n#nv-login.noche .mar::before{opacity:.3}\n#nv-login.noche .isla{background:#2D3744}\n#nv-login.noche .piso{background:linear-gradient(180deg,#2E2925 0%,#26221F 100%)}\n#nv-login.noche .pared{background:#36302B}\n#nv-login.noche .arco{background:linear-gradient(180deg,#3E5568,#2F4456);box-shadow:inset 0 0 0 10px #3B342F,inset 0 0 0 11px rgba(255,240,225,.08)}\n#nv-login.noche .sombra{opacity:.22;mix-blend-mode:normal}\n#nv-login.noche .luz{opacity:0}\n#nv-login.noche .luna,#nv-login.noche .est{opacity:1}\n#nv-login.noche .c{border-color:rgba(255,240,225,.12);box-shadow:0 24px 60px rgba(0,0,0,.35)}\n#nv-login.noche input{background:rgba(255,245,235,.06);color:var(--ink)}\n#nv-login.noche input:focus{background:rgba(255,245,235,.1)}\n#nv-login.noche .quien button{background:rgba(255,245,235,.05)}\n#nv-login.noche .quien button.on,#nv-login.noche button.p{background:#E8D3C3;color:#2A1E18;border-color:#E8D3C3}\n#nv-login.noche .tema{background:rgba(42,34,31,.6);border-color:rgba(255,240,225,.15)}\n#nv-login.noche .tema svg{stroke:#F0E2D3}\n#nv-login.noche .tema .sol{display:none}#nv-login.noche .tema .lun{display:block}\n#nv-login.noche .m{background:rgba(220,150,160,.15);color:#F0C7CD}#nv-login.noche .m.ok{background:rgba(150,200,160,.15);color:#C8E3CD}\n@media (max-width:640px){#nv-login .pared{width:46%}#nv-login .arco{right:14%;width:46%}#nv-login .sombra{width:130vw}}\n@media (prefers-reduced-motion:reduce){#nv-login *{animation:none!important}}\n";
    document.head.appendChild(st);
    var st2 = document.createElement("style"); st2.textContent = CSSG; document.head.appendChild(st2);
    caja = document.createElement("div"); caja.id = "nv-login";
    if (temaGuardado() === "oscuro") caja.classList.add("noche");
    (document.body || document.documentElement).appendChild(caja); pintar();
  }
  function hoja(x0,y0,ang,L,n,lw){ var cx=x0+Math.cos(ang)*L*.5+30, cy=y0+Math.sin(ang)*L*.5+40, ex=x0+Math.cos(ang)*L, ey=y0+Math.sin(ang)*L+60, s='<path d="M'+x0+' '+y0+' Q'+cx+' '+cy+' '+ex+' '+ey+'" stroke="#000" stroke-width="5" fill="none"/>'; for (var i=2;i<n;i++){ var t=i/n, bx=(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*ex, by=(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*ey, dx=2*(1-t)*(cx-x0)+2*t*(ex-cx), dy=2*(1-t)*(cy-y0)+2*t*(ey-cy), a=Math.atan2(dy,dx), ll=lw*(1-Math.abs(t-.45)*1.2); [1,-1].forEach(function(sg){ var la=a+sg*(1.05+((i*7%5)-2)*.04)+.35, tx=bx+Math.cos(la)*ll, ty=by+Math.sin(la)*ll, mx=(bx+tx)/2+Math.cos(la+sg*1.57)*ll*.09, my=(by+ty)/2+Math.sin(la+sg*1.57)*ll*.09, m2=(bx+tx)/2-Math.cos(la+sg*1.57)*ll*.03, n2=(by+ty)/2-Math.sin(la+sg*1.57)*ll*.03; s+='<path d="M'+bx.toFixed(0)+' '+by.toFixed(0)+' Q'+mx.toFixed(0)+' '+my.toFixed(0)+' '+tx.toFixed(0)+' '+ty.toFixed(0)+' Q'+m2.toFixed(0)+' '+n2.toFixed(0)+' '+bx.toFixed(0)+' '+by.toFixed(0)+'Z"/>'; }); } return s; }
  var R = Math.PI/180;
  var ESCENA = '<div class="esc"><div class="cielo"></div><div class="est"></div><div class="luna"></div><div class="nube a"></div><div class="nube b"></div><div class="nube c"></div><div class="isla"></div><div class="mar"></div><div class="piso"></div><div class="pared"><div class="arco"></div></div><div class="luz"></div>'+
    '<svg class="sombra" viewBox="0 0 820 700"><g fill="#3B2418">'+hoja(800,0,150*R,620,26,190)+hoja(800,0,115*R,520,22,150)+hoja(800,0,175*R,480,20,140)+'</g></svg>'+
    '<svg class="sombra dos" viewBox="0 0 820 700"><g fill="#3B2418">'+hoja(0,700,-40*R,520,22,160)+hoja(0,700,-70*R,430,18,130)+'</g></svg></div>';
  var BTEMA = '<button class="tema" id="nv-t" type="button" title="Modo claro / oscuro"><svg class="sol" viewBox="0 0 32 32"><path d="M16.2 10.1c3.4-.2 6 2.6 5.8 5.9-.1 3.3-2.9 5.9-6.1 5.8-3.3-.1-5.8-2.8-5.7-6 .1-3 2.8-5.6 6-5.7"/><path d="M15.6 10.6c3 .1 5.5 2.4 5.6 5.3"/><path d="M16 3.2v3.1M16.3 25.8l-.2 3M3.3 16.2h3M25.9 15.8h2.9M6.9 6.7l2.1 2.2M23.1 23l2 2.1M6.8 25.2 9 23.1M23.2 8.9l2.1-2.1"/></svg><svg class="lun" viewBox="0 0 32 32"><path d="M20.5 5.2c-5.6.9-9.4 6.3-8.4 11.8.9 5.2 5.9 8.8 11.2 8.1-2.1 2.2-5.1 3.5-8.3 3.4C9 28.3 4.1 23.1 4.4 16.9 4.6 10.6 9.9 5.6 16.2 5.8c1.5 0 2.9.3 4.3-.6"/><path d="M19.8 6c-4.4 1.6-7 6.2-6.1 10.9"/><path d="M24.3 9.6l.6 1.7 1.7.5-1.7.6-.6 1.7-.5-1.7-1.7-.6 1.7-.5zM27.6 4.6l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z"/></svg></button>';
  function pintar(msg, ok){
    var t = { entrar: ["Hola de nuevo","Entrá con tu mail. La sesión queda abierta en este dispositivo.","Entrar"],
              crear: ["Crear tu acceso","Elegí quién sos y una contraseña.","Crear acceso"],
              olvide: ["Recuperar contraseña","Te mandamos un mail para elegir una nueva.","Mandar mail"] }[modo];
    var mv = (document.getElementById("nv-m") || {}).value || "";
    caja.innerHTML = ESCENA + BTEMA + '<div class="c">'+LOGO.replace('<svg ','<svg class="logo" ')+'<small>ILUMINACIÓN &amp; DECO</small><h1>'+t[0]+'</h1><p>'+t[1]+'</p>'+
      (modo!=="olvide" ? '<button class="gg" id="nv-g" type="button">'+GSVG+'<span>Entrar con Google</span></button><div class="sep"><span>o con tu mail</span></div>' : '')+'<label>Mail<input id="nv-m" type="email" autocomplete="email" placeholder="Tocá quién sos o escribí tu mail"></label>'+
      '<div class="quien"><button type="button" data-q="euge">Euge</button><button type="button" data-q="pau">Pau</button><button type="button" data-q="nervo">Nervo</button></div>'+
      (modo!=="olvide" ? '<label>Contraseña<input id="nv-p" type="password" autocomplete="'+(modo==="crear"?"new-password":"current-password")+'"></label>' : '')+
      '<button class="p" id="nv-go">'+t[2]+'</button><div class="alt"><button id="nv-a">'+(modo==="crear"?"Ya tengo acceso":"Es mi primera vez")+'</button>'+
      (modo==="entrar" ? '<button id="nv-o">Olvidé la contraseña</button>' : '<button id="nv-v">Volver</button>')+'</div>'+
      (msg ? '<div class="m'+(ok?' ok':'')+'">'+msg+'</div>' : '')+'</div>';
    var me = document.getElementById("nv-m"); me.value = mv;
    function marcar(){ var v = me.value.trim().toLowerCase(); caja.querySelectorAll(".quien button").forEach(function(b){ b.classList.toggle("on", MAILS[b.dataset.q] === v); }); }
    caja.querySelectorAll(".quien button").forEach(function(b){ b.onclick = function(){ me.value = MAILS[b.dataset.q]; marcar(); var p = document.getElementById("nv-p"); if (p) p.focus(); }; });
    me.oninput = marcar; marcar();
    document.getElementById("nv-t").onclick = function(){ var n = !caja.classList.contains("noche"); caja.classList.toggle("noche", n); try { localStorage.setItem("nv-tema", n ? "oscuro" : "claro"); } catch(e){} };
    document.getElementById("nv-go").onclick = enviar;
    var gb = document.getElementById("nv-g"); if (gb) gb.onclick = function(){ SB.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } }).then(function(r){ if (r && r.error) pintar("No se pudo entrar con Google: " + r.error.message); }); };
    var p = document.getElementById("nv-p"); if (p) p.onkeydown = function(e){ if (e.key === "Enter") enviar(); };
    document.getElementById("nv-a").onclick = function(){ modo = modo==="crear" ? "entrar" : "crear"; pintar(); };
    var o = document.getElementById("nv-o"); if (o) o.onclick = function(){ modo = "olvide"; pintar(); };
    var v = document.getElementById("nv-v"); if (v) v.onclick = function(){ modo = "entrar"; pintar(); };
  }
  function enviar(){
    var m = (document.getElementById("nv-m").value || "").trim().toLowerCase(), pe = document.getElementById("nv-p"), p = pe ? pe.value : "";
    if (PERMITIDOS.indexOf(m) < 0){ pintar("Ese mail no tiene acceso. Solo entran Euge, Pau y Nervo."); return; }
    var aqui = location.origin + location.pathname, pr;
    if (modo === "entrar") pr = SB.auth.signInWithPassword({ email: m, password: p });
    else if (modo === "crear") pr = SB.auth.signUp({ email: m, password: p, options: { emailRedirectTo: aqui } });
    else pr = SB.auth.resetPasswordForEmail(m, { redirectTo: aqui });
    pr.then(function(r){
      if (r.error) throw r.error;
      if (modo === "crear" && !(r.data && r.data.session)) pintar("Te mandamos un mail para confirmar. Abrilo y volvé acá.", true);
      if (modo === "olvide") pintar("Listo, revisá tu mail.", true);
    }).catch(function(e){
      var s = String(e && e.message || e);
      pintar(/Invalid login/i.test(s) ? "Mail o contraseña incorrectos." : /confirm/i.test(s) ? "Falta confirmar el mail: revisá tu casilla." : /at least/i.test(s) ? "La contraseña tiene que tener al menos 6 caracteres." : /registered/i.test(s) ? "Ese mail ya tiene acceso: tocá “Ya tengo acceso”." : s);
    });
  }
  function quitarLogin(){ if (caja) { caja.remove(); caja = null; } }
  SB.auth.onAuthStateChange(function(ev){ if (ev === "PASSWORD_RECOVERY") { var n = prompt("Elegí tu nueva contraseña"); if (n) SB.auth.updateUser({ password: n }); } });
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then(function(rs){ rs.forEach(function(r){ var u = ((r.active || r.installing || r.waiting) || {}).scriptURL || ""; if (!/avisos-sw\.js/.test(u)) r.unregister(); }); }).catch(function(){});
})();

/* tema visual, chat y Hoy: se cargan de entrada para que no aparezca el diseño viejo */
(function(){
  var cs = document.currentScript, m = cs && /[?&]v=(\d+)/.exec(cs.src), V = m ? m[1] : String(Date.now());
  var h = document.documentElement;
  /* quién soy, según el mail con el que entré */
  var QUIEN = { "eugeabdon@gmail.com": "euge", "mpauabdon@gmail.com": "pau" };
  function fijarYo(email){
    var k = QUIEN[String(email || "").toLowerCase()]; if (!k) return;
    try { var me = JSON.parse(localStorage.getItem("nervo-me") || "{}"); if (me.soy !== k){ me.soy = k; if (!me.visto) me.visto = Date.now(); localStorage.setItem("nervo-me", JSON.stringify(me)); }
      var S = window.__nv && window.__nv.S; if (S && S.soy !== k){ S.soy = k; try { window.__nv.render(); } catch(e){} } } catch(e){}
  }
  try { var ses = JSON.parse(localStorage.getItem("nervo-sesion") || "null"); fijarYo(ses && ses.user && ses.user.email); } catch(e){}
  try { window.__sb.auth.onAuthStateChange(function(ev, s){ if (s && s.user) fijarYo(s.user.email); }); } catch(e){}
  /* si hay una versión más nueva publicada, abrirla (una sola vez) */
  try { fetch("version.txt?z=" + Date.now(), { cache: "no-store" }).then(function(r){ return r.ok ? r.text() : ""; }).then(function(t){
    t = String(t || "").trim(); if (!/^\d+$/.test(t) || !m || t === V || +t < +V) return;
    var k = "nv-rl-" + t; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1");
    location.replace(location.pathname + "?v=" + t + location.hash);
  }).catch(function(){}); } catch(e){}
  try{ localStorage.setItem("hub_theme","light"); }catch(e){}
  function L(){ if (h.getAttribute("data-theme") !== "light") h.setAttribute("data-theme","light"); }
  L(); new MutationObserver(L).observe(h, { attributes: true, attributeFilter: ["data-theme"] });
  var tapa = document.createElement("style"); tapa.id = "nv-tapa";
  tapa.textContent = "html{background:#FFFDFB}body{opacity:0!important}";
  document.head.appendChild(tapa);
  function destapar(){ var t = document.getElementById("nv-tapa"); if (t) t.remove(); }
  setTimeout(destapar, 2500);
  var pend = 0;
  function css(id, href){ var l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href + "?v=" + V; pend++;
    l.onload = l.onerror = function(){ if (--pend <= 0) destapar(); }; document.head.appendChild(l); }
  css("nv-tema-l", "tema.css"); css("nv-chat-l", "chat.css"); css("nv-hoy-l", "hoy.css"); css("nv-perfil-l", "perfil.css"); css("nv-mov-l", "movs.css");
  function js(){ ["chat-plus.js","hoy-plus.js","perfil.js","movs.js"].forEach(function(f){ var s = document.createElement("script"); s.src = f + "?v=" + V; document.body.appendChild(s); });
    var b = document.getElementById("themeBtn"); if (b) b.style.display = "none"; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", js); else js();
})();

/* ---------- Inicio de sesión: video real de playa de fondo ---------- */
(function(){
  if (window.__nvLgVideo) return; window.__nvLgVideo = 1;
  var SRC = "https://videos.pexels.com/video-files/3575062/3575062-hd_1920_1080_30fps.mp4";
  var POSTER = "https://images.pexels.com/videos/3575062/free-video-3575062.jpg?auto=compress&w=1600";
  var quieto = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function poner(){
    var L = document.getElementById("nv-login"); if (!L || L.querySelector("#nvlg-v")) return;
    var esc = L.querySelector(".esc"); if (esc) esc.style.visibility = "hidden";
    var w = document.createElement("div"); w.id = "nvlg-v";
    w.style.cssText = "position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none;background:#E6E1DB url(" + POSTER + ") center/cover no-repeat";
    if (!quieto){
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.preload = "auto"; v.poster = POSTER;
      v.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:" + (innerWidth < 700 ? "78% center" : "center") + ";filter:saturate(.75) brightness(1.06)";
      v.src = SRC; w.appendChild(v);
      v.addEventListener("error", function(){ v.remove(); });
    }
    var velo = document.createElement("div"); velo.style.cssText = "position:absolute;inset:0;background:rgba(230,225,219,.22)"; w.appendChild(velo);
    L.insertBefore(w, L.firstChild);
    var c = L.querySelector(".c"); if (c){ c.style.position = "relative"; c.style.zIndex = 1; }
    var t = L.querySelector(".tema"); if (t){ t.style.position = t.style.position || "absolute"; t.style.zIndex = 2; }
  }
  poner(); var n = 0, iv = setInterval(function(){ poner(); if (++n > 40) clearInterval(iv); }, 250);
  new MutationObserver(poner).observe(document.documentElement, { childList: true, subtree: true });
})();

/* ---------- tareas que se repiten ciertos días (lo usan los ganchos de publicarApp) ---------- */
window.__nvRR = function(t){ var r = (t && t.rep) || ""; return r === "diaria" || /^dias:/.test(r); };
window.__nvRH = function(t){ var r = (t && t.rep) || ""; if (r === "diaria") return true; var m = /^dias:([\d,]*)/.exec(r); return !!m && m[1].split(",").indexOf(String(new Date().getDay())) >= 0; };
window.__nvRTxt = function(t){ var r = (t && t.rep) || ""; if (r === "diaria") return "todos los días"; var m = /^dias:([\d,]*)/.exec(r); if (!m) return ""; var D = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"], L = m[1].split(",").filter(Boolean).map(Number).sort(function(a, b){ return ((a + 6) % 7) - ((b + 6) % 7); }); if (L.length === 7) return "todos los días"; if (L.join() === "1,2,3,4,5") return "lun a vie"; return L.map(function(d){ return D[d]; }).join(" · "); };

/* ================= Datos en Supabase: el tablero lee y guarda acá (rápido); Google queda de copia ================= */
(function(){
  if (window.__nvLocal) return;
  var TABLAS = ["presupuestos","catalogo","config","mayoristas","campanas","contenido","seguimiento","costos","preciosweb","ganancias","tareas","proveedores","notas","links","recordatorios","stock","tejedoras","mayclientes","objetivos"];
  var LS = "nv-datos-v1", MEM = null, DEL = {}, CARGANDO = null, ULT = 0, VACIO_D = 0;
  try { var c = JSON.parse(localStorage.getItem(LS) || "null"); if (c && c.d) MEM = c.d; } catch(e){}
  function SB(){ return window.__sb; }
  function tok(){ return window.__nvTok ? window.__nvTok() : Promise.resolve(); }
  function g(name, args){ return window.__nvGRun ? window.__nvGRun(name, args) : Promise.reject(new Error("sin Google")); }
  function s(v){ return v == null ? "" : String(v); }
  function limpio(d){ var o = {}; Object.keys(d || {}).forEach(function(k){ if (k !== "_n") o[k] = s(d[k]); }); return o; }
  function salida(){ var o = {}; TABLAS.forEach(function(t){ o[t] = ((MEM && MEM[t]) || []).map(limpio); }); return o; }
  function guardarLS(){ try { localStorage.setItem(LS, JSON.stringify({ d: MEM, t: Date.now() })); } catch(e){} }
  function ordenar(L){ L.sort(function(a, b){ return (Number(a._n) || 0) - (Number(b._n) || 0); }); }

  function traer(){
    if (CARGANDO) return CARGANDO;
    CARGANDO = (async function(){
      var all = [], from = 0;
      while (true){
        var q = await SB().from("registros").select("tabla,id,data,borrado").in("tabla", TABLAS).range(from, from + 999);
        if (q.error) throw q.error;
        all = all.concat(q.data || []); if ((q.data || []).length < 1000) break; from += 1000;
      }
      /* si llega vacío (todavía no terminó de entrar), no pisa nada: espera y vuelve a probar */
      if (!all.length){ VACIO_D++; if (VACIO_D < 8){ await new Promise(function(ok){ setTimeout(ok, 1500); }); CARGANDO = null; return traer(); } if (MEM) return MEM; } else VACIO_D = 0;
      var M = {}, D = {}; TABLAS.forEach(function(t){ M[t] = []; });
      all.forEach(function(r){ if (r.borrado){ D[r.tabla + "|" + r.id] = 1; return; } var d = r.data || {}; if (d.id == null || d.id === "") d.id = r.id; M[r.tabla].push(d); });
      TABLAS.forEach(function(t){ ordenar(M[t]); });
      MEM = M; DEL = D; ULT = Date.now(); guardarLS(); return M;
    })();
    CARGANDO.then(function(){ CARGANDO = null; }, function(){ CARGANDO = null; });
    return CARGANDO;
  }
  function asegurar(){ return MEM && ULT ? Promise.resolve(MEM) : traer(); }
  function fila(nombre, id){ var L = MEM[nombre] || (MEM[nombre] = []); for (var i = 0; i < L.length; i++) if (s(L[i].id) === s(id)) return i; return -1; }
  function mezclar(nombre, item){
    var L = MEM[nombre] || (MEM[nombre] = []), i = fila(nombre, item.id);
    var prev = i >= 0 ? L[i] : null, base = L[0] || {};
    var n = Object.assign({}, prev || {});
    if (!prev){ Object.keys(base).forEach(function(k){ if (k !== "_n") n[k] = ""; }); n._n = String(Date.now()); }
    Object.keys(item || {}).forEach(function(k){ n[k] = s(item[k]); });
    if (i >= 0) L[i] = n; else L.push(n);
    delete DEL[nombre + "|" + s(item.id)];
    return n;
  }
  function quien(item){ return s((item && item.por) || (window.__nv && window.__nv.S && window.__nv.S.soy) || ""); }
  function subir(nombre, filas){
    var now = new Date().toISOString();
    return SB().from("registros").upsert(filas.map(function(d){ return { tabla: nombre, id: s(d.id), data: d, borrado: false, actualizado: now, por: quien(d) }; }), { onConflict: "tabla,id" })
      .then(function(r){ if (r.error) throw new Error("No se pudo guardar: " + r.error.message); });
  }
  function copiaGoogle(name, args){ g(name, args).catch(function(e){ console.warn("copia en Google pendiente:", name, e && e.message); }); }

  var L = {};
  L.leerTodo = function(){
    return tok().then(function(){
      if (MEM && ULT && Date.now() - ULT < 60000) return salida();
      if (MEM){ var p = traer(); return Promise.race([p.then(salida), new Promise(function(ok){ setTimeout(function(){ ok(salida()); }, 1200); })]); }
      return traer().then(salida);
    });
  };
  L.guardar = function(a){
    var nombre = a[0], item = a[1] || {};
    if (TABLAS.indexOf(nombre) < 0) return g("guardar", a);
    if (item.id == null || item.id === "") return g("guardar", a);
    return tok().then(asegurar).then(function(){ var n = mezclar(nombre, item); return subir(nombre, [n]); })
      .then(function(){ guardarLS(); copiaGoogle("guardar", a); return salida(); });
  };
  L.guardarVarios = function(a){
    var nombre = a[0], items = (a[1] || []).filter(function(x){ return x && x.id != null && x.id !== ""; });
    if (TABLAS.indexOf(nombre) < 0) return g("guardarVarios", a);
    return tok().then(asegurar).then(function(){ var F = items.map(function(it){ return mezclar(nombre, it); }); return F.length ? subir(nombre, F) : null; })
      .then(function(){ guardarLS(); copiaGoogle("guardarVarios", a); return salida(); });
  };
  L.borrar = function(a){
    var nombre = a[0], id = s(a[1]);
    if (TABLAS.indexOf(nombre) < 0) return g("borrar", a);
    return tok().then(asegurar).then(function(){
      var i = fila(nombre, id); if (i >= 0) MEM[nombre].splice(i, 1); DEL[nombre + "|" + id] = 1;
      return SB().from("registros").update({ borrado: true, actualizado: new Date().toISOString(), por: quien({}) }).eq("tabla", nombre).eq("id", id)
        .then(function(r){ if (r.error) throw new Error("No se pudo borrar: " + r.error.message); });
    }).then(function(){ guardarLS(); copiaGoogle("borrar", a); return salida(); });
  };
  L.ajustarStock = function(a){
    var id = s(a[0]), delta = Number(a[1]) || 0, por = a[2], cambiado = a[3];
    return tok().then(asegurar).then(function(){
      var i = fila("stock", id); if (i < 0) return g("ajustarStock", a);
      var r = MEM.stock[i], n = mezclar("stock", { id: id, cantidad: String(Math.max(0, (Number(r.cantidad) || 0) + delta)), cambiado: s(cambiado || Date.now()), por: s(por || "") });
      return subir("stock", [n]).then(function(){ guardarLS(); copiaGoogle("ajustarStock", a); return salida(); });
    });
  };
  window.__nvLocal = L;

  /* ---------- lo que se cargue por otro lado (la app vieja, procesos de Google) entra solo ---------- */
  var SYNC = false, REENVIADOS = {};
  async function desdeGoogle(){
    if (SYNC || document.hidden || !window.__nvGRun) return; SYNC = true;
    try {
      await tok(); await asegurar();
      var G = await g("leerTodo", []); if (!G) return;
      var cambios = {};
      TABLAS.forEach(function(t){
        (G[t] || []).forEach(function(o, idx){
          if (!o || o.id == null || o.id === "") return;
          var k = t + "|" + s(o.id); if (DEL[k]) return;
          var i = fila(t, o.id), cur = i >= 0 ? MEM[t][i] : null;
          var nuevo = !cur, masNuevo = cur && o.cambiado && (Number(o.cambiado) || 0) > (Number(cur.cambiado) || 0);
          if (!nuevo && !masNuevo) return;
          var d = {}; Object.keys(o).forEach(function(x){ d[x] = s(o[x]); });
          d._n = cur ? cur._n : String(Date.now() + idx);
          if (cur) MEM[t][i] = d; else MEM[t].push(d);
          (cambios[t] = cambios[t] || []).push(d);
        });
      });
      for (var t in cambios) await subir(t, cambios[t]);
      if (Object.keys(cambios).length){ TABLAS.forEach(function(t){ ordenar(MEM[t]); }); guardarLS(); }
    } catch(e){ console.warn("sync Google:", e && e.message); }
    finally { SYNC = false; }
  }
  /* app nueva manda: Google es solo copia de respaldo (no se lee de vuelta) */

  /* ---------- cambios de la otra persona: llegan al toque ---------- */
  setTimeout(function(){
    try {
      SB().channel("nervo-registros").on("postgres_changes", { event: "*", schema: "public", table: "registros" }, function(p){
        var r = p.new || {}; if (!MEM || TABLAS.indexOf(r.tabla) < 0) return;
        var i = fila(r.tabla, r.id);
        if (r.borrado){ if (i >= 0) MEM[r.tabla].splice(i, 1); DEL[r.tabla + "|" + r.id] = 1; }
        else { var d = r.data || {}; if (i >= 0) MEM[r.tabla][i] = d; else { MEM[r.tabla].push(d); ordenar(MEM[r.tabla]); } }
        ULT = Date.now(); guardarLS();
      }).subscribe();
    } catch(e){}
  }, 3000);
})();

/* ================= Finanzas y ventas: la base vive en Supabase; lo que calcula Google se muestra al instante (último guardado) y se actualiza solo ================= */
(function(){
  if (!window.__nvLocal || window.__nvLocal.baseLeer) return;
  var L = window.__nvLocal;
  var BT = ["base_min","base_may","fin_euge","fin_pau","fin_usd"];
  var LS = "nv-base-v1", MEM = null, ON = true, ULT = 0, CARG = null, RECIENTES = {}, ON_PEDIDO = false;
  try { var c = JSON.parse(localStorage.getItem(LS) || "null"); if (c && c.d){ MEM = c.d; ON = c.on !== false; } } catch(e){}
  function SB(){ return window.__sb; }
  function tok(){ return window.__nvTok ? window.__nvTok() : Promise.resolve(); }
  function g(n, a){ return window.__nvGRun(n, a); }
  function s(v){ return v == null ? "" : (typeof v === "object" ? JSON.stringify(v) : String(v)); }
  function gls(){ try { localStorage.setItem(LS, JSON.stringify({ d: MEM, on: ON, t: Date.now() })); } catch(e){} }
  function ord(A){ A.sort(function(a, b){ return (Number(a._n) || 0) - (Number(b._n) || 0); }); }
  function limpio(d){ var o = {}; Object.keys(d || {}).forEach(function(k){ if (k !== "_n") o[k] = s(d[k]); }); return o; }
  function salida(){ var o = {}; BT.forEach(function(t){ o[t] = ((MEM && MEM[t]) || []).map(limpio); }); o.on = ON; return o; }
  function traer(){
    if (CARG) return CARG;
    CARG = (async function(){
      var all = [], from = 0;
      while (true){ var q = await SB().from("registros").select("tabla,id,data").in("tabla", BT).eq("borrado", false).range(from, from + 999); if (q.error) throw q.error; all = all.concat(q.data || []); if ((q.data || []).length < 1000) break; from += 1000; }
      var M = {}; BT.forEach(function(t){ M[t] = []; });
      all.forEach(function(r){ var d = r.data || {}; if (d.id == null || d.id === "") d.id = r.id; M[r.tabla].push(d); });
      if (!all.length){ VACIOS++; if (VACIOS < 6) setTimeout(function(){ traer().then(avisarBase, function(){}); }, 2500); if (MEM && BT.some(function(t){ return (MEM[t] || []).length; })) return MEM; }
      else VACIOS = 0;
      BT.forEach(function(t){ ord(M[t]); }); MEM = M; if (all.length){ ULT = Date.now(); gls(); } return M;
    })();
    CARG.then(function(){ CARG = null; }, function(){ CARG = null; });
    return CARG;
  }
  function aseg(){ return MEM && ULT ? Promise.resolve(MEM) : traer(); }
  function idx(t, id){ var A = MEM[t] || (MEM[t] = []); for (var i = 0; i < A.length; i++) if (String(A[i].id) === String(id)) return i; return -1; }
  function mezclar(t, item){
    var A = MEM[t] || (MEM[t] = []), i = idx(t, item.id), prev = i >= 0 ? A[i] : null, n = Object.assign({}, prev || {});
    if (!prev){ Object.keys(A[0] || {}).forEach(function(k){ if (k !== "_n") n[k] = ""; }); n._n = String(Date.now()); }
    Object.keys(item || {}).forEach(function(k){ n[k] = s(item[k]); });
    if (i >= 0) A[i] = n; else A.push(n); RECIENTES[t + "|" + item.id] = Date.now(); return n;
  }
  function quien(){ return String((window.__nv && window.__nv.S && window.__nv.S.soy) || ""); }
  function subir(t, F){ var now = new Date().toISOString(); return SB().from("registros").upsert(F.map(function(d){ return { tabla: t, id: String(d.id), data: d, borrado: false, actualizado: now, por: quien() }; }), { onConflict: "tabla,id" }).then(function(r){ if (r.error) throw new Error("No se pudo guardar: " + r.error.message); }); }
  function copia(n, a){ ventasLocalOtraVez(); g(n, a).then(function(){ refrescarVentas(); }, function(e){ console.warn("copia en Google pendiente:", n, e && e.message); }); }

  var VACIOS = 0, BCB = null;
  function avisarBase(){ try { if (typeof ventasLocalOtraVez === "function") ventasLocalOtraVez(); } catch(e){} if (BCB && MEM) { try { BCB(salida()); } catch(e){} } }
  L.baseLeer = function(a, otraVez){
    if (otraVez) BCB = otraVez;
    return tok().then(function(){
      if (false && !ON_PEDIDO){ ON_PEDIDO = true; g("baseLeer", []).then(function(r){ if (r && typeof r.on === "boolean" && r.on !== ON){ ON = r.on; gls(); } }, function(){}); }
      if (MEM && ULT && Date.now() - ULT < 20000) return salida();
      if (MEM){ var p = traer(), tarde = false; p.then(function(){ if (tarde) avisarBase(); }, function(){}); return Promise.race([p.then(salida), new Promise(function(ok){ setTimeout(function(){ tarde = true; ok(salida()); }, 1200); })]); }
      return traer().then(salida);
    });
  };
  L.baseGuardarVarios = function(a){
    var t = a[0], items = (a[1] || []).filter(function(x){ return x && x.id != null && x.id !== ""; });
    if (BT.indexOf(t) < 0) return g("baseGuardarVarios", a);
    return tok().then(aseg).then(function(){ var F = items.map(function(it){ return mezclar(t, it); }); return F.length ? subir(t, F) : null; })
      .then(function(){ gls(); copia("baseGuardarVarios", a); return true; });
  };
  L.baseGuardar = function(a){ return L.baseGuardarVarios([a[0], [a[1]]]); };
  L.baseBorrar = function(a){
    var t = a[0], id = String(a[1]);
    if (BT.indexOf(t) < 0) return g("baseBorrar", a);
    return tok().then(aseg).then(function(){
      var i = idx(t, id); if (i >= 0) MEM[t].splice(i, 1);
      return SB().from("registros").update({ borrado: true, actualizado: new Date().toISOString(), por: quien() }).eq("tabla", t).eq("id", id).then(function(r){ if (r.error) throw new Error("No se pudo borrar: " + r.error.message); });
    }).then(function(){ gls(); copia("baseBorrar", a); return true; });
  };

  /* ---------- lo que calcula Google (ventas, envíos, clima…): se muestra lo último al instante y se actualiza atrás ---------- */
  var SWR = ["envios","pedidosGanancia","clima","mayoristasAT","resenasAT","mayHistAT"];
  var VIVOS = {};
  function clave(n, a){ return "nv-swr-" + n + "-" + JSON.stringify(a || []).slice(0, 80); }
  function leerC(k){ try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } }
  function guardarC(k, r){ try { localStorage.setItem(k, JSON.stringify({ r: r, t: Date.now() })); } catch(e){} }
  SWR.forEach(function(n){
    L[n] = function(a, otraVez){
      var k = clave(n, a), c = leerC(k);
      var fresco = g(n, a).then(function(r){ guardarC(k, r); return r; });
      if (c && c.r != null){
        VIVOS[n] = { a: a, cb: otraVez };
        fresco.then(function(r){ if (otraVez && JSON.stringify(r) !== JSON.stringify(c.r)) { try { otraVez(r); } catch(e){} } }, function(){});
        return Promise.resolve(c.r);
      }
      return fresco;
    };
  });
  /* ---------- resumen de ventas: se calcula acá mismo con la base (ya no se le pide a Google) ---------- */
  var VCB = null, tVL = null;
  function ventasArmar(b){
    b = b || {};
    var J = function(v){ try { var x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : []; } catch(e){ return []; } };
    var N = function(t){ return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); };
    var porF = function(x, y){ return x.f < y.f ? -1 : x.f > y.f ? 1 : 0; };
    var ord = [], agg = {}, items = [];
    (b.base_min || []).forEach(function(r){
      var fac0 = Number(r.facturar) || 0, cob = Number(r.cobrado) || 0, fac = fac0 || cob;
      var cli = String(r.cliente || "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").split("\n")[0].trim();
      ord.push({ f: String(r.fecha || ""), t: cob || fac, fac: fac, cob: cob, v: String(r.venta || r.num || ""), c: cli });
      var m = String(r.fecha || "").slice(0, 7); if (!m) return;
      var Q = String(r.cant || "").split("\n").map(function(l){ var x = /^\s*\[[ xX]?\]\s*(\d+)/.exec(l); return x ? Number(x[1]) : null; }).filter(function(x){ return x != null; });
      J(r.prods).forEach(function(p, i){ var nm = String(p).split(" · ")[0].trim(), k = m + "|" + N(nm); if (!agg[k]){ agg[k] = { p: nm, q: 0, m: m }; items.push(agg[k]); } agg[k].q += Q[i] != null ? Q[i] : 1; });
    });
    var may = (b.base_may || []).map(function(r){ return { f: String(r.fecha || ""), t: (Number(r.sena) || 0) + (Number(r.saldo) || 0) }; });
    var fin = (b.fin_euge || []).concat(b.fin_pau || []).map(function(r){ return { f: String(r.fecha || ""), k: String(r.cat || ""), t: Number(r.total) || 0, c: String(r.concepto || "") }; });
    ord.sort(porF); may.sort(porF); fin.sort(porF);
    return { ord: ord, items: items, may: may, fin: fin, sinAcceso: [], at: Date.now(), base: true };
  }
  L.ventas = function(a, otraVez){ if (otraVez) VCB = otraVez; return L.baseLeer([]).then(ventasArmar); };
  function ventasLocalOtraVez(){ clearTimeout(tVL); tVL = setTimeout(function(){ if (!VCB || !MEM) return; try { VCB(ventasArmar(salida())); } catch(e){} }, 400); }

  var tRef = null;
  function refrescarVentas(){
    clearTimeout(tRef);
    tRef = setTimeout(function(){
      ["ventas","pedidosGanancia"].forEach(function(n){
        var v = VIVOS[n]; if (!v || !v.cb) return;
        g(n, v.a).then(function(r){ guardarC(clave(n, v.a), r); try { v.cb(r); } catch(e){} }, function(){});
      });
    }, 2500);
  }

  setTimeout(function(){
    try {
      SB().channel("nervo-base").on("postgres_changes", { event: "*", schema: "public", table: "registros" }, function(p){
        var r = p.new || {}; if (!MEM || BT.indexOf(r.tabla) < 0) return;
        var i = idx(r.tabla, r.id);
        if (r.borrado){ if (i >= 0) MEM[r.tabla].splice(i, 1); }
        else { var d = r.data || {}; if (i >= 0) MEM[r.tabla][i] = d; else { MEM[r.tabla].push(d); ord(MEM[r.tabla]); } }
        ULT = Date.now(); gls(); ventasLocalOtraVez();
      }).subscribe();
    } catch(e){}
  }, 3500);

  /* ---------- solo las ventas NUEVAS que entran por Tienda Nube (llegan a Google) se suman; nada más se lee de Google ---------- */
  async function desdeGoogle(){
    if (document.hidden) return;
    try {
      await tok(); await aseg();
      var G = await g("baseLeer", []); if (!G) return; if (typeof G.on === "boolean") ON = G.on;
      var cambios = {};
      ["base_min","base_may"].forEach(function(t){ (G[t] || []).forEach(function(o, j){
        if (!o || o.id == null || o.id === "") return;
        if (Date.now() - (RECIENTES[t + "|" + o.id] || 0) < 10 * 60000) return;
        var i = idx(t, o.id), cur = i >= 0 ? MEM[t][i] : null;
        var d = {}; Object.keys(o).forEach(function(x){ d[x] = s(o[x]); });
        if (cur) return; if (cur){ var igual = true; for (var x in d){ if (s(cur[x]) !== d[x]) { igual = false; break; } } if (igual) return; if (cur.cambiado && d.cambiado && Number(d.cambiado) <= Number(cur.cambiado)) return; d._n = cur._n; MEM[t][i] = d; }
        else { d._n = String(Date.now() + j); MEM[t].push(d); }
        (cambios[t] = cambios[t] || []).push(d);
      }); });
      for (var t in cambios) await subir(t, cambios[t]);
      gls();
    } catch(e){ console.warn("sync base:", e && e.message); }
  }
  /* Tienda Nube entra directo a Supabase (función "tiendanube", cada 5 min); al abrir la app se revisa una vez más */
  setTimeout(function(){ try { SB().functions.invoke("tiendanube", { body: {} }); } catch(e){} }, 4000);
})();

/* ================= Chat en Supabase: los mensajes llegan al toque; Google queda de copia ================= */
(function(){
  if (!window.__nvLocal || window.__nvLocal.chatLeer) return;
  var L = window.__nvLocal;
  function SB(){ return window.__sb; }
  function tok(){ return window.__nvTok ? window.__nvTok() : Promise.resolve(); }
  function g(n, a){ return window.__nvGRun(n, a); }
  function copia(n, a){ g(n, a).catch(function(e){ console.warn("copia chat en Google pendiente:", n, e && e.message); }); }
  function msg(d){ return { id: String(d.id), canal: String(d.canal || ""), texto: String(d.texto || ""), por: String(d.por || ""), creado: Number(d.creado) || 0, cambiado: Number(d.cambiado) || 0, borrado: !!d.borrado, reac: d.reac || {}, adj: d.adj || [] }; }
  function subir(d){ return SB().from("registros").upsert({ tabla: "chat", id: String(d.id), data: d, borrado: false, actualizado: new Date(Number(d.cambiado) || Date.now()).toISOString(), por: String(d.por || "") }, { onConflict: "tabla,id" }).then(function(r){ if (r.error) throw new Error("No se pudo mandar: " + r.error.message); }); }
  function uno(id){ return SB().from("registros").select("data").eq("tabla", "chat").eq("id", String(id)).maybeSingle().then(function(r){ return r.data ? r.data.data : null; }); }
  var VISTO = null;
  function vistos(){ return SB().from("registros").select("data").eq("tabla", "chatvisto").eq("id", "v").maybeSingle().then(function(r){ VISTO = (r.data && r.data.data) || VISTO || {}; return VISTO; }); }

  /* aviso al celu/compu de las demás cuando alguien escribe (sale desde acá, no depende de la pantalla) */
  window.__nvChatAvisoDatos = 1;
  function avisoChat(d){
    try {
      if (!d || /^mov/i.test(d.canal)) return;
      var nom = d.canal; try { (window.__nv.getCH() || []).forEach(function(c){ if (String(c[0]) === String(d.canal)) nom = c[1]; }); } catch(e){}
      SB().functions.invoke("avisos", { body: { accion: "chat", canal: d.canal, canalNombre: nom, texto: d.texto || "" } }).catch(function(){});
    } catch(e){}
  }
  L.chatLeer = function(a){
    var desde = Number(a[0]) || 0;
    return tok().then(function(){
      var q = SB().from("registros").select("data").eq("tabla", "chat");
      if (desde) q = q.gt("actualizado", new Date(desde - 3000).toISOString());
      return Promise.all([q.order("actualizado", { ascending: false }).limit(1500), vistos()]);
    }).then(function(R){
      if (R[0].error) throw R[0].error;
      var m = (R[0].data || []).map(function(r){ return msg(r.data || {}); }).filter(function(x){ return x.cambiado > desde || !desde; });
      m.sort(function(x, y){ return x.creado - y.creado; });
      return { v: R[1] || {}, m: m };
    });
  };
  /* si el chat llega vacío al abrir (todavía entrando), vuelve a probar en vez de quedar vacío */
  (function(){ var base = L.chatLeer; L.chatLeer = function(a){ var desde = Number(a && a[0]) || 0, n = 0;
    function prueba(){ return base(a).then(function(r){ if (!desde && (!r || !r.m || !r.m.length) && n++ < 6) return new Promise(function(ok){ setTimeout(ok, 1500); }).then(prueba); return r; }); }
    return prueba(); }; })();
  L.chatEnviar = function(a){
    var m = a[0] || {}, now = Date.now();
    var d = { id: String(m.id || ("c" + now + Math.random().toString(36).slice(2, 6))), canal: String(m.canal || ""), texto: String(m.texto || "").slice(0, 4000), por: String(m.por || ""), creado: Number(m.creado) || now, cambiado: now, borrado: false, reac: m.padre ? { __p: String(m.padre) } : {}, adj: Array.isArray(m.adj) ? m.adj.slice(0, 10) : [] };
    return tok().then(function(){ return subir(d); }).then(function(){ avisoChat(d); copia("chatEnviar", [Object.assign({}, m, { id: d.id, creado: d.creado })]); return msg(d); });
  };
  function cambiar(id, fn, nombre, args){
    return tok().then(function(){ return uno(id); }).then(function(d){
      if (!d) return g(nombre, args);
      fn(d); d.cambiado = Date.now();
      return subir(d).then(function(){ copia(nombre, args); return msg(d); });
    });
  }
  L.chatBorrar = function(a){ return cambiar(a[0], function(d){ d.borrado = true; }, "chatBorrar", a).then(function(r){ return !!r; }); };
  L.chatReaccionar = function(a){
    var emo = a[1], por = a[2];
    return cambiar(a[0], function(d){ var re = d.reac || {}; var X = re[emo] || []; re[emo] = X.indexOf(por) >= 0 ? X.filter(function(p){ return p !== por; }) : X.concat([por]); if (!re[emo].length) delete re[emo]; d.reac = re; }, "chatReaccionar", a);
  };
  L.chatFijar = function(a){
    var on = a[1], por = a[2];
    return cambiar(a[0], function(d){ var re = d.reac || {}; if (on) re.__pin = [String(por || ""), Date.now()]; else delete re.__pin; d.reac = re; }, "chatFijar", a);
  };
  L.chatVisto = function(a){
    var por = a[0], canal = a[1];
    return tok().then(vistos).then(function(v){
      v = v || {}; v[por] = v[por] || {}; v[por][canal] = Date.now(); VISTO = v;
      return SB().from("registros").upsert({ tabla: "chatvisto", id: "v", data: v, borrado: false, actualizado: new Date().toISOString(), por: String(por || "") }, { onConflict: "tabla,id" })
        .then(function(){ copia("chatVisto", a); return v; });
    });
  };

  /* ---------- lo que escriba Google en el chat (avisos automáticos, la app vieja) entra solo ---------- */
  var ULTG = 0, OCUP = false;
  async function desdeGoogle(){
    if (OCUP || document.hidden) return; OCUP = true;
    try {
      await tok();
      var r = await g("chatLeer", [ULTG]); var M = (r && r.m) || []; if (!M.length) return;
      var ids = M.map(function(x){ return String(x.id); });
      var q = await SB().from("registros").select("id,data").eq("tabla", "chat").in("id", ids);
      var cur = {}; (q.data || []).forEach(function(x){ cur[x.id] = x.data || {}; });
      for (var i = 0; i < M.length; i++){
        var x = M[i], c = cur[String(x.id)];
        if (!c || (Number(x.cambiado) || 0) > (Number(c.cambiado) || 0)) await subir({ id: String(x.id), canal: x.canal, texto: x.texto, por: x.por, creado: Number(x.creado) || 0, cambiado: Number(x.cambiado) || Date.now(), borrado: !!x.borrado, reac: x.reac || {}, adj: x.adj || [] });
        ULTG = Math.max(ULTG, Number(x.cambiado) || 0);
      }
    } catch(e){ console.warn("sync chat:", e && e.message); }
    finally { OCUP = false; }
  }
  /* chat: Google es solo copia de respaldo (no se lee de vuelta) */
})();

/* ---------- más lecturas de Google que se muestran al instante (lo último guardado) y se actualizan atrás ---------- */
(function(){
  var L = window.__nvLocal; if (!L || L.tareasLeer) return;
  ["tareasLeer","mayCatalogo","historialLeer","widgetClave","tnWeb"].forEach(function(n){
    L[n] = function(a, otraVez){
      var k = "nv-swr-" + n + "-" + JSON.stringify(a || []).slice(0, 80), c = null;
      try { c = JSON.parse(localStorage.getItem(k) || "null"); } catch(e){}
      var fresco = window.__nvGRun(n, a).then(function(r){ try { localStorage.setItem(k, JSON.stringify({ r: r, t: Date.now() })); } catch(e){} return r; });
      if (c && c.r != null){ fresco.then(function(r){ if (otraVez && JSON.stringify(r) !== JSON.stringify(c.r)) { try { otraVez(r); } catch(e){} } }, function(){}); return Promise.resolve(c.r); }
      return fresco;
    };
  });
})();


/* ================= aviso de versión nueva: un toque y queda actualizada (sirve también en la app instalada) ================= */
(function(){
  if (window.__nvActualiza) return; window.__nvActualiza = 1;
  var cs = [].slice.call(document.scripts).find(function(x){ return /shim\.js\?v=\d+/.test(x.src); });
  var cur = cs ? Number(/v=(\d+)/.exec(cs.src)[1]) : 0; if (!cur) return;
  var mostrado = false;
  function mirar(){
    if (mostrado || document.hidden) return;
    fetch("version.txt?x=" + Date.now(), { cache: "no-store" }).then(function(r){ return r.ok ? r.text() : ""; }).then(function(t){
      var v = Number(String(t).trim()); if (!v || v <= cur) return; mostrado = true;
      var b = document.createElement("div");
      b.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top, 0px) + 12px);z-index:99999;background:#4A3F37;color:#fff;border-radius:999px;padding:8px 8px 8px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);font-family:inherit;font-size:14px;max-width:calc(100vw - 24px);white-space:nowrap";
      var tx = document.createElement("span"); tx.textContent = "Hay una actualización";
      var bt = document.createElement("button"); bt.textContent = "Actualizar"; bt.style.cssText = "border:0;border-radius:999px;background:#E6E1DB;color:#4A3F37;padding:8px 14px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer";
      bt.onclick = function(){ bt.textContent = "Actualizando…"; location.replace(location.pathname + "?r=" + Date.now() + location.hash); };
      b.appendChild(tx); b.appendChild(bt); document.body.appendChild(b);
    }).catch(function(){});
  }
  setTimeout(mirar, 5000); setInterval(mirar, 2 * 60000);
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) mirar(); });
  window.addEventListener("focus", mirar);
})();


/* ================= celu: el chat se ve completo y los menús se cierran (botón × y gesto de volver) ================= */
(function(){
  if (window.__nvMovilFix) return; window.__nvMovilFix = 1;
  var st = document.createElement("style");
  st.textContent = "@media (max-width:760px){html:not(#a):not(#b) body .chw .chrp{display:none!important} html:not(#a):not(#b) body .chw.vl .chc{max-height:none!important;height:auto!important;flex:1 1 auto!important;overflow:auto!important}}" +
    "html:not(#a):not(#b) body .chmsg .chh{display:flex!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important}html:not(#a):not(#b) body .chmsg .chh .chav{position:static!important;flex:0 0 18px!important;width:18px!important;height:18px!important;margin:0!important;transform:none!important}html:not(#a):not(#b) body .chmsg .chh>b{width:auto!important;flex:0 0 auto!important;white-space:nowrap!important;overflow:visible!important}" +
    ".nvsh-x{position:sticky;top:0;float:right;margin:-6px -4px 0 8px;z-index:5;width:36px;height:36px;border-radius:50%;border:0;background:#ECE6DF;color:#6B5B50;font-size:20px;line-height:36px;cursor:pointer;box-shadow:inset 2px 2px 5px rgba(120,100,85,.16),inset -2px -2px 5px rgba(255,255,255,.8)}";
  document.head.appendChild(st);
  var abierto = false;
  function scrim(){ var h = document.getElementById("sheetHost"); return h && h.querySelector(".scrim"); }
  function cerrar(){ var s = scrim(); if (s) s.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
  function revisar(){
    var s = scrim();
    if (s){
      var sh = s.querySelector(".sheet");
      if (sh && !sh.querySelector(".nvsh-x")){ var b = document.createElement("button"); b.type = "button"; b.className = "nvsh-x"; b.textContent = "×"; b.title = "Cerrar"; b.onclick = function(e){ e.preventDefault(); e.stopPropagation(); cerrar(); }; sh.insertBefore(b, sh.firstChild); }
      if (!abierto){ abierto = true; try { history.pushState({ nvSheet: 1 }, ""); } catch(e){} }
    } else if (abierto){
      abierto = false; try { if (history.state && history.state.nvSheet) history.replaceState(null, ""); } catch(e){}
    }
  }
  window.addEventListener("popstate", function(){ if (abierto && scrim()){ abierto = false; cerrar(); } });
  function vigilar(){ var h = document.getElementById("sheetHost"); if (!h) return setTimeout(vigilar, 1000); new MutationObserver(revisar).observe(h, { childList: true, subtree: true }); }
  vigilar();
})();


/* ================= venta nueva de la web: suena la caja registradora y aparece un festejo (con la app abierta) ================= */
(function(){
  if (window.__nvCaja) return; window.__nvCaja = 1;
  var ctx = null;
  function audio(){ try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); } catch(e){} return ctx; }
  ["pointerdown", "keydown", "touchstart"].forEach(function(ev){ document.addEventListener(ev, function(){ audio(); }, { once: true, passive: true }); });
  function campana(c, t, f, dur, vol){ var o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05); }
  function cajon(c, t){ var n = Math.floor(c.sampleRate * 0.12), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = "bandpass"; f.frequency.value = 2500; g.gain.value = 0.5; s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); }
  function chaChing(){ var c = audio(); if (!c) return; var t = c.currentTime + 0.05; cajon(c, t); campana(c, t + 0.12, 1568, 0.9, 0.35); campana(c, t + 0.12, 3136, 0.6, 0.12); campana(c, t + 0.24, 2093, 1.2, 0.35); campana(c, t + 0.24, 4186, 0.8, 0.1); }
  function plata(n){ n = Math.round(Number(n) || 0); return n ? "$ " + n.toLocaleString("es-AR") : ""; }
  function festejo(d){
    var b = document.createElement("div");
    b.style.cssText = "position:fixed;left:50%;top:calc(env(safe-area-inset-top, 0px) + 70px);transform:translate(-50%,-20px);opacity:0;transition:all .35s ease;z-index:99998;background:#F6F2ED;color:#4A3F37;border:1px solid #E2DAD1;border-radius:22px;padding:14px 20px;box-shadow:0 18px 40px rgba(74,63,55,.2);font-family:inherit;text-align:center;max-width:calc(100vw - 32px)";
    b.innerHTML = '<div style="font-size:28px">💰</div><div style="font-weight:600;font-size:16px">¡Venta nueva en la web!</div><div style="font-size:13px;color:#8C7D71;margin-top:2px"></div>';
    b.lastChild.textContent = [d.num, plata(d.facturar || d.cobrado), String(d.cliente || "").split("\n")[0]].filter(Boolean).join(" · ");
    b.onclick = function(){ b.remove(); };
    document.body.appendChild(b); requestAnimationFrame(function(){ b.style.opacity = "1"; b.style.transform = "translate(-50%,0)"; });
    setTimeout(function(){ b.style.opacity = "0"; setTimeout(function(){ b.remove(); }, 400); }, 7000);
  }
  var vistos = {};
  window.__nvProbarCaja = function(){ chaChing(); festejo({ num: "WEB #prueba", facturar: 150000, cliente: "Prueba" }); };
  function iniciar(){
    if (!window.__sb) return setTimeout(iniciar, 2000);
    try {
      window.__sb.channel("nervo-ventas-web").on("postgres_changes", { event: "INSERT", schema: "public", table: "registros", filter: "tabla=eq.base_min" }, function(p){
        var r = p.new || {}, d = r.data || {}; if (r.por !== "web" && d.por !== "web") return; if (vistos[r.id]) return; vistos[r.id] = 1;
        chaChing(); festejo(d);
      }).subscribe();
    } catch(e){}
  }
  setTimeout(iniciar, 3000);
})();

/* Teclado del celu: que la pantalla no salte al escribir. Sin zoom al tocar un casillero, se esconde la barra de abajo mientras escribís y el chat queda fijo como en WhatsApp. */
(function(){
  if (window.__nvKb) return; window.__nvKb = 1;
  /* sin zoom automático del iPhone: la pantalla queda siempre del ancho del celu */
  try { var mv = document.querySelector("meta[name=viewport]"); if (!mv){ mv = document.createElement("meta"); mv.name = "viewport"; document.head.appendChild(mv); } mv.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"); } catch(e){}
  var st = document.createElement("style");
  st.textContent = "@media (max-width:760px){input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),textarea,select{font-size:16px!important}}" +
    "html.nv-kb nav.tabs,html.nv-kb #nvupd{display:none!important}" +
    "html.nv-kb .chw.nvkb-fix{position:fixed!important;left:0!important;right:0!important;top:var(--vvt,0px)!important;height:var(--vvh,100vh)!important;max-height:none!important;z-index:5000;margin:0!important;border-radius:0!important;background:#FBF8F5}" +
    "html.nv-kb body{overscroll-behavior:none}" +
    "@media (max-width:760px){html,body{overflow-x:clip;max-width:100vw}}";
  document.head.appendChild(st);
  var vv = window.visualViewport; if (!vv) return;
  function escribiendo(){ var a = document.activeElement; return !!a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable); }
  function alFondo(chw){ [].forEach.call(chw.querySelectorAll("*"), function(x){ var o = getComputedStyle(x).overflowY; if ((o === "auto" || o === "scroll") && x.scrollHeight > x.clientHeight + 4 && !x.contains(document.activeElement)) x.scrollTop = x.scrollHeight; }); }
  var abierto = false;
  function upd(){
    var kb = escribiendo() && vv.height < window.innerHeight - 120 && innerWidth <= 760;
    var R = document.documentElement;
    R.classList.toggle("nv-kb", kb);
    R.style.setProperty("--vvh", Math.round(vv.height) + "px");
    R.style.setProperty("--vvt", Math.round(vv.offsetTop) + "px");
    var chw = document.querySelector(".chw");
    if (chw){
      var dentro = kb && chw.contains(document.activeElement);
      chw.classList.toggle("nvkb-fix", dentro);
      if (dentro && !abierto){ abierto = true; setTimeout(function(){ alFondo(chw); }, 30); window.scrollTo(0, 0); }
      if (!dentro) abierto = false;
    }
  }
  vv.addEventListener("resize", upd); vv.addEventListener("scroll", upd);
  document.addEventListener("focusin", function(){ setTimeout(upd, 60); setTimeout(upd, 400); });
  document.addEventListener("focusout", function(){ setTimeout(upd, 120); });
})();

/* Chat en el celu fijo como WhatsApp: la pantalla no se mueve para los costados ni rebota; solo se desplazan los mensajes. */
(function(){
  if (window.__nvChatFijo) return; window.__nvChatFijo = 1;
  var st = document.createElement("style");
  st.textContent = "@media (max-width:760px){" +
    "html.nv-chat,html.nv-chat body{overflow:hidden!important;overscroll-behavior:none!important;height:100%!important;width:100%!important}" +
    "html.nv-chat body{position:fixed!important;left:0;right:0;top:0;bottom:0}" +
    "html.nv-chat .chw{position:fixed!important;left:0!important;right:0!important;top:var(--chtop,64px)!important;bottom:var(--chbot,70px)!important;height:auto!important;max-height:none!important;width:auto!important;margin:0!important;border-radius:0!important;overflow:hidden!important;overscroll-behavior:contain;z-index:40;touch-action:pan-y}" +
    "html.nv-chat .chw *{overscroll-behavior:contain}" +
    "html.nv-chat .chw,html.nv-chat .chw *{overflow-x:hidden}" +
    "html.nv-chat.nv-kb .chw{bottom:auto!important}" +
    "}";
  document.head.appendChild(st);
  function medir(){
    var R = document.documentElement, chw = document.querySelector("main#list .chw");
    var on = !!chw && innerWidth <= 760 && chw.offsetParent !== null;
    if (on && !R.classList.contains("nv-chat")){
      window.scrollTo(0, 0);
      var top = 0, hd = document.elementFromPoint(innerWidth / 2, 8);
      while (hd && hd !== document.body){ var cs = getComputedStyle(hd); if (cs.position === "fixed" || cs.position === "sticky"){ top = Math.max(top, hd.getBoundingClientRect().bottom); break; } hd = hd.parentElement; }
      if (!top) top = Math.max(0, chw.getBoundingClientRect().top);
      var nav = document.querySelector("nav.tabs"), bot = nav ? Math.max(0, innerHeight - nav.getBoundingClientRect().top) : 0;
      R.style.setProperty("--chtop", Math.round(top) + "px"); R.style.setProperty("--chbot", Math.round(bot) + "px");
    }
    R.classList.toggle("nv-chat", on);
  }
  setInterval(medir, 400); window.addEventListener("resize", function(){ document.documentElement.classList.remove("nv-chat"); medir(); });
})();
