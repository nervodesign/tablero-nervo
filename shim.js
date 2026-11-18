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
      if (s) return s.access_token;
      if (!espera) espera = new Promise(function(ok){
        var sub = SB.auth.onAuthStateChange(function(ev, ses){ if (ses && ses.access_token){ quitarLogin(); ok(ses.access_token); } });
        mostrarLogin();
      });
      return espera;
    });
  }
  function runner(ok, fail){
    return new Proxy({}, { get: function(_, name){
      if (name === "withSuccessHandler") return function(f){ return runner(f, fail); };
      if (name === "withFailureHandler") return function(f){ return runner(ok, f); };
      if (name === "withUserObject") return function(){ return runner(ok, fail); };
      return function(){
        var args = Array.prototype.slice.call(arguments);
        token().then(function(t){
          return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: name, args: args, token: t }) });
        }).then(function(r){ return r.json(); }).then(function(j){
          if (j.ok) { if (ok) ok(j.r); }
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
  function mostrarLogin(){
    if (caja) return;
    var st = document.createElement("style");
    st.textContent = "#nv-login{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at 15% 10%,#F8EADE,transparent 45%),radial-gradient(circle at 90% 90%,#DDE6ED,transparent 45%),#FEFAF8;font-family:Outfit,system-ui,sans-serif;color:#3A241C}"+
      "#nv-login .c{width:100%;max-width:390px;background:#fff;border-radius:28px;padding:32px 28px;box-shadow:0 18px 50px rgba(58,36,28,.12)}"+
      "#nv-login small{display:block;font-size:10px;letter-spacing:.24em;color:#9B8576;margin:8px 0 24px}#nv-login h1{font-size:26px;margin:0 0 4px}#nv-login p{color:#9B8576;font-size:14px;margin:0 0 18px}"+
      "#nv-login label{display:block;font-size:12px;color:#9B8576;margin:0 0 12px}#nv-login input{display:block;width:100%;box-sizing:border-box;margin-top:5px;border:1.5px solid #F0E6DD;border-radius:14px;padding:12px 14px;font:inherit;font-size:15px;outline:0}#nv-login input:focus{border-color:#DFB9B6}"+
      "#nv-login button.p{width:100%;border:0;border-radius:14px;padding:13px;background:#59392D;color:#fff;font:inherit;font-weight:500;font-size:15px;cursor:pointer;margin-top:4px}"+
      "#nv-login .alt{display:flex;justify-content:space-between;margin-top:14px}#nv-login .alt button{border:0;background:none;color:#6C4D38;font:inherit;font-size:13px;cursor:pointer;padding:0}"+
      "#nv-login button.g{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid #E8DDD3;border-radius:14px;padding:12px;background:#fff;color:#3A241C;font:inherit;font-weight:500;font-size:15px;cursor:pointer;box-shadow:0 1px 2px rgba(58,36,28,.06)}#nv-login button.g:hover{background:#FDF9F6}"+
      "#nv-login .or{display:flex;align-items:center;gap:10px;margin:18px 0 14px;color:#B5A397;font-size:12px}#nv-login .or::before,#nv-login .or::after{content:\"\";flex:1;height:1px;background:#F0E6DD}"+
      "#nv-login .m{font-size:13px;margin-top:12px;padding:10px 12px;border-radius:12px;background:#F7ECEC;color:#9A5F5A}#nv-login .m.ok{background:#EEF3EC;color:#5B6E57}";
    document.head.appendChild(st);
    caja = document.createElement("div"); caja.id = "nv-login";
    (document.body || document.documentElement).appendChild(caja); pintar();
  }
  function pintar(msg, ok){
    var t = { entrar: ["Hola de nuevo","Entrá con tu mail. La sesión queda abierta en este dispositivo.","Entrar"],
              crear: ["Crear tu acceso","Usá tu mail (Euge, Pau o Nervo) y elegí una contraseña.","Crear acceso"],
              olvide: ["Recuperar contraseña","Te mandamos un mail para elegir una nueva.","Mandar mail"] }[modo];
    caja.innerHTML = '<div class="c">'+LOGO+'<small>ILUMINACIÓN &amp; DECO</small><h1>'+t[0]+'</h1><p>'+t[1]+'</p>'+
      (modo==="entrar" ? '<button class="g" id="nv-g"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 2.9-2.2 5.4-4.7 7.1l7.3 5.7c4.3-4 7.2-9.9 7.2-17.3z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>Entrar con Google</button><div class="or"><span>o con tu mail</span></div>' : '')+
      '<label>Mail<input id="nv-m" type="email" autocomplete="email"></label>'+
      (modo!=="olvide" ? '<label>Contraseña<input id="nv-p" type="password" autocomplete="'+(modo==="crear"?"new-password":"current-password")+'"></label>' : '')+
      '<button class="p" id="nv-go">'+t[2]+'</button><div class="alt"><button id="nv-a">'+(modo==="crear"?"Ya tengo acceso":"Es mi primera vez")+'</button>'+
      (modo==="entrar" ? '<button id="nv-o">Olvidé la contraseña</button>' : '<button id="nv-v">Volver</button>')+'</div>'+
      (msg ? '<div class="m'+(ok?' ok':'')+'">'+msg+'</div>' : '')+'</div>';
    var g = document.getElementById("nv-g"); if (g) g.onclick = function(){ g.disabled = true; SB.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } } }).then(function(r){ if (r.error){ g.disabled = false; pintar("No se pudo abrir Google: " + r.error.message); } }); };
    document.getElementById("nv-go").onclick = enviar;
    var p = document.getElementById("nv-p"); if (p) p.onkeydown = function(e){ if (e.key === "Enter") enviar(); };
    document.getElementById("nv-a").onclick = function(){ modo = modo==="crear" ? "entrar" : "crear"; pintar(); };
    var o = document.getElementById("nv-o"); if (o) o.onclick = function(){ modo = "olvide"; pintar(); };
    var v = document.getElementById("nv-v"); if (v) v.onclick = function(){ modo = "entrar"; pintar(); };
  }
  function enviar(){
    var m = (document.getElementById("nv-m").value || "").trim(), pe = document.getElementById("nv-p"), p = pe ? pe.value : "";
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
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then(function(rs){ rs.forEach(function(r){ r.unregister(); }); }).catch(function(){});
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
