/* Perfil: tarjeta con foto y estado, en línea, y "está escribiendo…" */
(function(){
  if (window.__nvPerfil) return; window.__nvPerfil = 1;
  var SB = window.__sb; if (!SB) return;
  var YO = null, MIEMBROS = [], ONLINE = {}, ESCRIBE = {}, canalRT = null;
  var ESTADOS = [["🚚","En el depósito"],["📦","Armando pedidos"],["🍽","Almorzando"],["📵","Ocupada"],["🏠","Trabajando desde casa"],["✈️","De viaje"]];
  function h(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function vigente(m){ return m && m.estado && (!m.estado_hasta || new Date(m.estado_hasta) > new Date()); }
  function porNombre(n){ return MIEMBROS.find(function(m){ return (m.nombre || "").toLowerCase() === String(n || "").toLowerCase(); }); }
  function inicial(m){ return ((m && m.nombre) || "?").slice(0, 1).toUpperCase(); }
  function avatar(m, cls){
    var a = h("span", "nvav " + (cls || "")); a.style.background = (m && m.color) || "#C08A80";
    if (m && m.foto){ a.style.backgroundImage = "url(" + m.foto + ")"; a.classList.add("foto"); } else a.textContent = inicial(m);
    if (m && ONLINE[m.email]) a.classList.add("on");
    return a;
  }

  /* ---------- datos ---------- */
  function cargar(){
    return SB.from("miembros").select("email,nombre,color,estado,estado_emoji,estado_hasta,foto").then(function(r){
      if (r.error) return; MIEMBROS = r.data || [];
      return SB.auth.getSession().then(function(s){
        var em = s && s.data && s.data.session && s.data.session.user.email;
        YO = MIEMBROS.find(function(m){ return m.email.toLowerCase() === String(em || "").toLowerCase(); }) || null;
        pintar(); if (YO) conectar();
      });
    });
  }
  function guardar(campos){
    if (!YO) return Promise.resolve();
    Object.assign(YO, campos); pintar();
    return SB.from("miembros").update(campos).eq("email", YO.email).then(function(r){ if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; } avisarCambio(); });
  }

  /* ---------- en línea y escribiendo ---------- */
  function conectar(){
    if (canalRT) return;
    canalRT = SB.channel("nervo-presencia", { config: { presence: { key: YO.email } } });
    canalRT.on("presence", { event: "sync" }, function(){
      var st = canalRT.presenceState(); ONLINE = {}; Object.keys(st).forEach(function(k){ ONLINE[k] = 1; }); pintar();
    });
    canalRT.on("broadcast", { event: "escribe" }, function(p){
      var d = p.payload || {}; if (!d.n || d.n === YO.nombre) return;
      ESCRIBE[d.n] = { c: d.c, t: Date.now() }; pintarEscribe();
      setTimeout(pintarEscribe, 4200);
    });
    canalRT.on("broadcast", { event: "perfil" }, function(){ cargar(); });
    canalRT.subscribe(function(s){ if (s === "SUBSCRIBED") canalRT.track({ n: YO.nombre, at: Date.now() }); });
  }
  function avisarCambio(){ try { canalRT && canalRT.send({ type: "broadcast", event: "perfil", payload: {} }); } catch(e){} }
  var ultimoEnvio = 0;
  document.addEventListener("input", function(e){
    if (!YO || !canalRT || !e.target.matches(".chw form.chf textarea")) return;
    var now = Date.now(); if (now - ultimoEnvio < 2000) return; ultimoEnvio = now;
    var S = window.__nv && window.__nv.S, c = S && S.chat && S.chat.canal;
    try { canalRT.send({ type: "broadcast", event: "escribe", payload: { n: YO.nombre, c: c } }); } catch(err){}
  });
  function pintarEscribe(){
    var form = document.querySelector(".chw form.chf"); if (!form) return;
    var S = window.__nv && window.__nv.S, c = S && S.chat && S.chat.canal, now = Date.now();
    var quien = Object.keys(ESCRIBE).filter(function(n){ var x = ESCRIBE[n]; return x.c === c && now - x.t < 4000; });
    var el = document.querySelector(".chw .nvtyp");
    if (!quien.length){ if (el) el.remove(); return; }
    if (!el){ el = h("div", "nvtyp"); form.parentNode.insertBefore(el, form); }
    var t = quien.join(" y ") + (quien.length > 1 ? " están" : " está") + " escribiendo…";
    if (el.dataset.t !== t){ el.dataset.t = t; el.innerHTML = '<span class="nvdots"><i></i><i></i><i></i></span>'; el.appendChild(document.createTextNode(" " + t)); }
  }

  /* ---------- tarjeta y ventana de estado ---------- */
  function lineaEstado(m){ return vigente(m) ? (m.estado_emoji ? m.estado_emoji + " " : "") + m.estado : ""; }
  function pintar(){
    var nav = document.querySelector("nav.tabs");
    if (nav){
      var card = nav.querySelector(".nvyo");
      if (!card){ card = h("button", "nvyo"); card.type = "button"; card.onclick = function(e){ e.stopPropagation(); abrir(card); }; nav.appendChild(card); }
      card.replaceChildren();
      if (YO){
        var tx = h("span", "nvyo-t"); tx.append(h("b", null, YO.nombre), h("small", vigente(YO) ? "con" : "sin", lineaEstado(YO) || "Poné un estado"));
        card.append(avatar(YO), tx, h("span", "nvyo-x", "⋯"));
      } else card.append(h("small", null, "Cargando…"));
    }
    var hdr = document.querySelector("header.top .hdr-r");
    if (hdr && YO){
      var mb = hdr.querySelector(".nvyo-m");
      if (!mb){ mb = h("button", "nvyo-m"); mb.type = "button"; mb.title = "Tu perfil y estado"; mb.onclick = function(e){ e.stopPropagation(); abrir(mb); }; hdr.appendChild(mb); }
      mb.replaceChildren(avatar(YO));
    }
    decorarChat();
    var p = document.querySelector(".nvperf"); if (p && p.dataset.abierto) refrescar(p);
  }
  /* actualiza solo cabecera, foto y equipo: no toca lo que estás escribiendo ni el scroll */
  function refrescar(p){
    if (!YO) return;
    var cab = p.querySelector(".nvperf-h"), eq = p.querySelector(".nvperf-q"), fo = p.querySelector(".nvperf-f");
    if (!cab || !eq || !fo){ llenar(p); return; }
    cab.replaceWith(cabecera()); eq.replaceWith(equipo()); fo.replaceWith(bloqueFoto());
  }
  var FI = null;
  function elegirFoto(){
    if (!FI){
      FI = h("input"); FI.type = "file"; FI.accept = "image/*"; FI.style.display = "none"; FI.onclick = function(e){ e.stopPropagation(); }; document.body.appendChild(FI);
      FI.onchange = function(){
        var f = FI.files[0]; if (!f) return;
        toast("Subiendo foto…");
        achicar(f, 200).then(function(url){ return guardar({ foto: url }); }).then(function(){ toast("Foto guardada."); }, function(){});
        FI.value = "";
      };
    }
    FI.click();
  }
  function cabecera(){
    var cab = h("div", "nvperf-h"); var av = avatar(YO, "grande");
    var bt = h("button", "nvperf-av"); bt.type = "button"; bt.title = "Cambiar foto"; bt.onclick = elegirFoto;
    bt.append(av, h("span", "nvperf-cam", "📷")); cab.append(bt);
    var nm = h("div"); nm.append(h("b", null, YO.nombre), h("small", null, ONLINE[YO.email] ? "● En línea" : "Conectando…")); cab.append(nm);
    return cab;
  }
  function bloqueFoto(){
    var fo = h("div", "nvperf-f");
    var fb = h("button", null, YO.foto ? "📷 Cambiar foto" : "📷 Poner foto"); fb.type = "button"; fb.onclick = elegirFoto;
    fo.append(fb);
    if (YO.foto){ var fq = h("button", null, "Quitar foto"); fq.type = "button"; fq.onclick = function(){ guardar({ foto: null }); }; fo.append(fq); }
    return fo;
  }
  function equipo(){
    var eq = h("div", "nvperf-q"); eq.append(h("small", null, "EQUIPO"));
    MIEMBROS.filter(function(m){ return m.email !== YO.email; }).forEach(function(m){
      var r = h("div", "nvperf-m"); r.append(avatar(m));
      var t = h("span"); t.append(h("b", null, m.nombre), h("small", null, (ONLINE[m.email] ? "En línea" : "Desconectada") + (vigente(m) ? " · " + lineaEstado(m) : "")));
      r.append(t); eq.append(r);
    });
    return eq;
  }
  function cerrar(){ var p = document.querySelector(".nvperf"); if (p) p.remove(); }
  document.addEventListener("click", function(e){ if (!e.target.closest(".nvperf,.nvyo,.nvyo-m")) cerrar(); });
  function abrir(ancla){
    if (document.querySelector(".nvperf")){ cerrar(); return; }
    var p = h("div", "nvperf"); p.dataset.abierto = 1; document.body.appendChild(p); llenar(p);
    var r = ancla.getBoundingClientRect(), H = window.innerHeight;
    if (window.innerWidth > 800){ p.style.left = Math.max(12, r.left) + "px"; p.style.bottom = Math.max(12, H - r.top + 8) + "px"; p.style.maxHeight = Math.max(240, r.top - 20) + "px"; }
    else { p.style.right = "12px"; p.style.top = (r.bottom + 8) + "px"; p.style.maxHeight = Math.max(240, H - r.bottom - 20) + "px"; }
  }
  function llenar(p){
    p.replaceChildren(); if (!YO) return;
    p.append(cabecera());
    /* estado */
    var fila = h("div", "nvperf-e");
    var emo = h("input", "nvperf-emo"); emo.value = vigente(YO) ? (YO.estado_emoji || "💬") : "💬"; emo.maxLength = 4; emo.title = "Emoji";
    var txt = h("input", "nvperf-tx"); txt.placeholder = "¿Qué estás haciendo?"; txt.value = vigente(YO) ? YO.estado : ""; txt.maxLength = 60;
    fila.append(emo, txt); p.append(fila);
    var pres = h("div", "nvperf-p");
    ESTADOS.forEach(function(x){ var b = h("button", null, x[0] + " " + x[1]); b.type = "button"; b.onclick = function(){ emo.value = x[0]; txt.value = x[1]; txt.focus(); }; pres.append(b); });
    p.append(pres);
    var dur = h("select", "nvperf-d");
    [["hoy","Hasta que termine el día"],["1h","Por 1 hora"],["4h","Por 4 horas"],["nunca","Sin vencimiento"]].forEach(function(o){ var op = h("option", null, o[1]); op.value = o[0]; dur.append(op); });
    var acc = h("div", "nvperf-a");
    var ok = h("button", "pri", "Guardar estado"); ok.type = "button";
    ok.onclick = function(){
      var t = txt.value.trim(), hasta = null, d = new Date();
      if (dur.value === "hoy"){ d.setHours(23, 59, 0, 0); hasta = d.toISOString(); }
      else if (dur.value === "1h") hasta = new Date(Date.now() + 36e5).toISOString();
      else if (dur.value === "4h") hasta = new Date(Date.now() + 4 * 36e5).toISOString();
      guardar({ estado: t || null, estado_emoji: t ? (emo.value.trim() || "💬") : null, estado_hasta: t ? hasta : null }).then(function(){ toast(t ? "Estado guardado." : "Estado borrado."); });
    };
    var bo = h("button", null, "Borrar"); bo.type = "button"; bo.onclick = function(){ txt.value = ""; guardar({ estado: null, estado_emoji: null, estado_hasta: null }); };
    acc.append(dur, ok, bo); p.append(acc);
    p.append(bloqueFoto(), equipo());
    var sal = h("button", "nvperf-s", "Salir de la app"); sal.type = "button";
    sal.onclick = function(){ SB.auth.signOut().then(function(){ location.reload(); }); };
    p.append(sal);
  }
  function achicar(file, lado){
    return new Promise(function(ok, mal){
      var img = new Image(), fr = new FileReader();
      fr.onload = function(){ img.onload = function(){
        var c = document.createElement("canvas"), s = Math.min(img.width, img.height);
        c.width = c.height = lado; c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, lado, lado);
        ok(c.toDataURL("image/jpeg", .82));
      }; img.onerror = mal; img.src = fr.result; };
      fr.onerror = mal; fr.readAsDataURL(file);
    });
  }
  function toast(t){ var d = h("div", "nvtoast", t); document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 3500); }

  /* ---------- fotos, en línea y estado dentro del chat ---------- */
  function decorarChat(){
    if (!MIEMBROS.length) return;
    document.querySelectorAll(".chw .chmsg .chav").forEach(function(a){
      var m = porNombre((a.closest(".chmsg").querySelector(".chh b") || {}).textContent);
      if (!m) return;
      var f = m.foto ? "url(" + m.foto + ")" : "";
      if (a.style.backgroundImage !== f){ a.style.backgroundImage = f; a.classList.toggle("nvfoto", !!m.foto); }
      a.classList.toggle("nvon", !!ONLINE[m.email]);
    });
    document.querySelectorAll(".chw .chdmt ~ .chb").forEach(function(b){
      var otra = MIEMBROS.find(function(m){ return YO && m.email !== YO.email && /pau|euge/i.test(m.nombre) && (b.textContent || "").toLowerCase().indexOf(m.nombre.toLowerCase()) >= 0; });
      if (!otra) return;
      b.classList.toggle("nvon", !!ONLINE[otra.email]);
      var st = b.querySelector(".nvdmst"), t = lineaEstado(otra) || (ONLINE[otra.email] ? "En línea" : "");
      if (!st){ st = h("span", "nvdmst"); (b.querySelector(".chbt") || b).appendChild(st); }
      if (st.textContent !== t) st.textContent = t;
    });
  }
  var pend = false;
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; try {
    if (!document.querySelector("nav.tabs .nvyo") || (YO && !document.querySelector("header.top .nvyo-m"))) pintar(); else decorarChat();
  } catch(e){} }); }).observe(document.documentElement, { childList: true, subtree: true });
  SB.auth.onAuthStateChange(function(ev){ if (ev === "SIGNED_IN" && !YO) cargar(); });
  setInterval(function(){ if (YO) pintar(); }, 60000);
  cargar();
})();
