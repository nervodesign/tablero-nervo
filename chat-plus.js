/* Chat Nervo: Slack en la compu, WhatsApp en el celu. Se monta encima del chat de siempre. */
(function(){
  if (window.__nvChat) return; window.__nvChat = 1;
  function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch(e){ return null; } }
  function h(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function yo(){ try { var S = window.__nv && window.__nv.S; var n = { euge: "Euge", pau: "Pau" }; return S && S.soy ? n[S.soy] : null; } catch(e){ return null; } }

  /* ---------- formato de mensajes ---------- */
  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function inline(s){
    s = esc(s);
    s = s.replace(/`([^`\n]+)`/g, '<code class="nvc">$1</code>');
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/__([^_\n]+)__/g, '<u>$1</u>');
    s = s.replace(/~~([^~\n]+)~~/g, '<s>$1</s>');
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,!?:;])/g, '$1<b>$2</b>');
    s = s.replace(/(^|[\s(])_([^_\n]+)_(?=$|[\s).,!?:;])/g, '$1<i>$2</i>');
    s = s.replace(/(^|[\s(])~([^~\n]+)~(?=$|[\s).,!?:;])/g, '$1<s>$2</s>');
    s = s.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return s;
  }
  function fmtText(t){
    var out = [], qb = null;
    t.split("\n").forEach(function(l){
      var m = l.match(/^>\s?(.*)$/);
      if (m){
        var q = m[1], a = q.match(/^([A-ZÁÉÍÓÚ][\wáéíóú]+):\s(.*)$/);
        if (!qb){ qb = []; out.push(qb); }
        qb.push(a ? '<b>' + esc(a[1]) + '</b>' + inline(a[2]) : inline(q));
        return;
      }
      qb = null;
      if ((m = l.match(/^#{1,3}\s+(.*)$/))) out.push('<span class="nvh">' + inline(m[1]) + '</span>');
      else if ((m = l.match(/^\s*[-•]\s+(.*)$/))) out.push('<span class="nvli">' + inline(m[1]) + '</span>');
      else if ((m = l.match(/^\s*(\d+)[.)]\s+(.*)$/))) out.push('<span class="nvli nvol" data-n="' + m[1] + '.">' + inline(m[2]) + '</span>');
      else out.push(inline(l));
    });
    return out.map(function(x){ return Array.isArray(x) ? '<span class="nvq">' + x.join("<br>") + '</span>' : x; }).join("\n").replace(/<\/span>\n/g, "</span>");
  }
  function formatear(box){
    if (box.dataset.nvf) return; box.dataset.nvf = 1;
    box.dataset.raw = box.textContent;
    Array.prototype.slice.call(box.childNodes).forEach(function(n){
      if (n.nodeType !== 3 || !/[*_~`#>\-•]|https?:/.test(n.nodeValue)) return;
      var sp = document.createElement("span"); sp.className = "nvf"; sp.innerHTML = fmtText(n.nodeValue);
      n.replaceWith(sp);
    });
  }
  function limpiarPrevia(el){
    var t = el.textContent;
    var nt = t.replace(/\*\*|__|~~|`/g, "").replace(/(^|\s)[*_~]([^*_~\s][^*_~]*)[*_~]/g, "$1$2").replace(/(^|:\s*)(#{1,3}|>)\s+/, "$1");
    if (nt !== t) el.textContent = nt;
  }

  /* ---------- caja para escribir ---------- */
  var BOTONES = [
    ["<b>B</b>", "Negrita (⌘B)", "**", "**"], ["<i>I</i>", "Cursiva (⌘I)", "_", "_"], ["<u>U</u>", "Subrayado (⌘U)", "__", "__"], ["<s>S</s>", "Tachado", "~~", "~~"],
    0, ["☰", "Lista", "- ", "", 1], ["1.", "Lista numerada", "1. ", "", 1],
    0, ["❝", "Cita", "> ", "", 1], ["&lt;/&gt;", "Código", "`", "`"]
  ];
  var EMOJIS = "😀 😂 🥰 😍 😅 😉 🤔 😮 😢 😡 🙏 👍 👎 👏 🙌 💪 👀 🎉 ✨ 🔥 ❤️ 🤎 ✅ ❌ ⚠️ 📦 🚚 💸 🛍️ 💡 📌 ⏰".split(" ");
  function insertar(ta, txt){
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    ta.value = v.slice(0, s) + txt + v.slice(e); ta.selectionStart = ta.selectionEnd = s + txt.length;
    ta.focus(); ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function envolver(ta, a, b, linea){
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value, sel = v.slice(s, e);
    if (linea){
      var ini = v.lastIndexOf("\n", s - 1) + 1, bloque = v.slice(ini, e);
      var nuevo = bloque.split("\n").map(function(l, i){ return (a === "1. " ? (i + 1) + ". " : a) + l; }).join("\n");
      ta.value = v.slice(0, ini) + nuevo + v.slice(e); ta.selectionStart = ta.selectionEnd = ini + nuevo.length;
    } else {
      ta.value = v.slice(0, s) + a + sel + b + v.slice(e);
      if (sel){ ta.selectionStart = s; ta.selectionEnd = e + a.length + b.length; } else ta.selectionStart = ta.selectionEnd = s + a.length;
    }
    ta.focus(); ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function cerrarPops(){ document.querySelectorAll(".nvpop").forEach(function(p){ p.remove(); }); }
  document.addEventListener("click", function(e){ if (!e.target.closest(".nvpop,.nvemo")) cerrarPops(); });
  function caja(form){
    if (form.dataset.nvc) return; form.dataset.nvc = 1;
    var ta = form.querySelector("textarea"); if (!ta) return;
    form.classList.add("nvform");
    var tb = h("div", "nvtb");
    BOTONES.forEach(function(x){
      if (!x){ tb.appendChild(h("i", "nvsep")); return; }
      var bt = h("button"); bt.type = "button"; bt.innerHTML = x[0]; bt.title = x[1];
      bt.onmousedown = function(e){ e.preventDefault(); };
      bt.onclick = function(){ envolver(ta, x[2], x[3], x[4]); };
      tb.appendChild(bt);
    });
    form.insertBefore(tb, form.firstChild);
    var emo = h("button", "nvr nvemo", "😊"); emo.type = "button"; emo.title = "Emojis";
    emo.onclick = function(e){
      e.stopPropagation(); if (document.querySelector(".nvpop")){ cerrarPops(); return; }
      var p = h("div", "nvpop");
      EMOJIS.forEach(function(em){ var b = h("button", null, em); b.type = "button"; b.onmousedown = function(ev){ ev.preventDefault(); }; b.onclick = function(){ insertar(ta, em); cerrarPops(); }; p.appendChild(b); });
      form.appendChild(p);
    };
    var arr = h("button", "nvr nvat", "@"); arr.type = "button"; arr.title = "Mencionar";
    arr.onmousedown = function(e){ e.preventDefault(); };
    arr.onclick = function(){ var v = ta.value, s = ta.selectionStart; insertar(ta, (s && !/\s$/.test(v.slice(0, s)) ? " @" : "@")); };
    var att = form.querySelector(".chatt:not(.chmic)");
    form.insertBefore(emo, att || ta); form.insertBefore(arr, att || ta);
    if (!ta.placeholder || /mensaje/i.test(ta.placeholder)) ta.placeholder = "Escribí un mensaje…";
    ta.addEventListener("keydown", function(e){
      if (!(e.metaKey || e.ctrlKey)) return;
      var k = e.key.toLowerCase();
      if (k === "b"){ e.preventDefault(); envolver(ta, "**", "**"); }
      else if (k === "i"){ e.preventDefault(); envolver(ta, "_", "_"); }
      else if (k === "u"){ e.preventDefault(); envolver(ta, "__", "__"); }
    });
  }

  /* ---------- citar (responder como WhatsApp) ---------- */
  function citar(msg){
    var ta = document.querySelector(".chw form.chf textarea"); if (!ta) return;
    var quien = (msg.querySelector(".chh b") || {}).textContent || "";
    var x = msg.querySelector(".chx"), raw = x ? (x.dataset.raw || x.textContent) : "";
    raw = raw.replace(/^>.*$/gm, "").replace(/\s+/g, " ").trim(); if (raw.length > 140) raw = raw.slice(0, 140) + "…";
    var q = "> " + (quien ? quien + ": " : "") + (raw || "📎 adjunto") + "\n";
    ta.value = q + ta.value.replace(/^(>.*\n)+/, "");
    ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; ta.dispatchEvent(new Event("input", { bubbles: true }));
    if (navigator.vibrate) try { navigator.vibrate(12); } catch(e){}
  }
  function mensaje(m){
    if (m.dataset.nvm) return; m.dataset.nvm = 1;
    var nm = (m.querySelector(".chh b") || {}).textContent, me = yo();
    if (me && nm === me) m.classList.add("nvme");
    var hh = m.querySelector(".chh");
    if (hh && !hh.querySelector(".nvcit")){
      var b = h("button", "nvcit", "❝ Citar"); b.type = "button"; b.title = "Responder citando";
      b.onclick = function(e){ e.stopPropagation(); citar(m); };
      var hilo = hh.querySelector(".chhilo"); hh.insertBefore(b, hilo || null);
    }
    /* deslizar para responder (celu) */
    var x0 = null, y0 = 0, dx = 0;
    m.addEventListener("touchstart", function(e){ var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; dx = 0; }, { passive: true });
    m.addEventListener("touchmove", function(e){ if (x0 == null) return; var t = e.touches[0]; dx = t.clientX - x0; if (Math.abs(t.clientY - y0) > 30){ x0 = null; m.style.transform = ""; return; } if (dx > 0) m.style.transform = "translateX(" + Math.min(dx, 70) + "px)"; }, { passive: true });
    m.addEventListener("touchend", function(){ if (x0 != null && dx > 55) citar(m); x0 = null; m.style.transition = "transform .2s"; m.style.transform = ""; setTimeout(function(){ m.style.transition = ""; }, 220); });
    /* tocar para ver opciones (celu) */
    m.addEventListener("click", function(e){
      if (window.innerWidth > 800 || e.target.closest("button,a,audio,video,img,input")) return;
      var on = m.classList.contains("nvsel");
      document.querySelectorAll(".chmsg.nvsel").forEach(function(z){ z.classList.remove("nvsel"); });
      if (!on) m.classList.add("nvsel");
    });
  }

  /* ---------- canales agrupados ---------- */
  var GRUPOS = [
    { k: "ven", n: "Ventas", ic: "🛍", c: "g1", re: /minorista|mayorista|presupuesto/i },
    { k: "env", n: "Envíos y proveedores", ic: "📦", c: "g2", re: /env[ií]o|proveedor/i },
    { k: "rec", n: "Reclamos y arreglos", ic: "⚠️", c: "g3", re: /reclamo|devoluci/i }
  ];
  function grupos(chc){
    var dmt = chc.querySelector(".chdmt");
    var hd = chc.querySelector(".cht:not(.chdmt)"); if (hd) hd.classList.add("nvhide");
    var otros = { k: "otr", n: "Otros canales", ic: "✨", c: "g4", re: /.*/ };
    var botones = Array.prototype.slice.call(chc.children).filter(function(b){
      return b.classList.contains("chb") && (!dmt || (b.compareDocumentPosition(dmt) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    if (!botones.length) return;
    GRUPOS.concat([otros]).forEach(function(g){
      var mios = botones.filter(function(b){ var n = (b.querySelector(".chl1") || b).textContent; if (b.dataset.nvg) return false; var ok = g === otros || g.re.test(n); if (ok) b.dataset.nvg = g.k; return ok; });
      var cab = chc.querySelector('.nvg[data-g="' + g.k + '"]'), lista = chc.querySelector('.nvgl[data-g="' + g.k + '"]');
      if (!mios.length && !lista) return;
      if (!cab){
        cab = h("button", "nvg " + g.c); cab.type = "button"; cab.dataset.g = g.k;
        cab.append(h("span", "nvgi", g.ic), h("span", "nvgn", g.n), h("span", "nvgb"), h("span", "nvga", "▾"));
        lista = h("div", "nvgl"); lista.dataset.g = g.k;
        cab.onclick = function(){ var c = !cab.classList.contains("cerr"); cab.classList.toggle("cerr", c); lista.classList.toggle("cerr", c); ls("nvg-" + g.k, c ? "1" : "0"); };
        if (ls("nvg-" + g.k) === "1"){ cab.classList.add("cerr"); lista.classList.add("cerr"); }
        chc.insertBefore(cab, dmt || null); chc.insertBefore(lista, dmt || null);
      }
      mios.forEach(function(b){ lista.appendChild(b); });
    });
    /* aviso de no leídos en la carpeta (también si está cerrada) */
    chc.querySelectorAll(".nvg").forEach(function(cab){
      var lista = chc.querySelector('.nvgl[data-g="' + cab.dataset.g + '"]'), n = 0, on = false;
      lista.querySelectorAll(".chb").forEach(function(b){ var x = b.querySelector(".chn"); if (x) n += parseInt(x.textContent, 10) || 0; if (b.classList.contains("on")) on = true; });
      var nb = cab.querySelector(".nvgb"), t = n ? "🔔 " + n : "";
      if (nb.textContent !== t) nb.textContent = t;
      if (on && cab.classList.contains("cerr")){ cab.classList.remove("cerr"); lista.classList.remove("cerr"); }
    });
    if (dmt && !chc.querySelector(".nvdmh")){
      var hint = h("div", "nvdmh", "🔒 Solo ustedes dos ven un mensaje directo.");
      var last = dmt; var n = dmt.nextElementSibling; while (n && n.classList.contains("chb")){ last = n; n = n.nextElementSibling; }
      last.after(hint);
    }
    /* letra en el ícono, para el celu */
    chc.querySelectorAll(".chb .chi:not([data-l])").forEach(function(ic){
      var b = ic.closest(".chb"), n = ((b.querySelector(".chl1") || b).textContent || "").trim();
      ic.dataset.l = /directo|y euge|y pau/i.test(n) ? "✉" : "#";
    });
  }

  /* ---------- encabezado del canal ---------- */
  function encabezado(w){
    var tt = w.querySelector(".chtt"); if (!tt) return;
    if (!tt.querySelector(".nvacts")){
      var a = h("div", "nvacts");
      var bs = h("button", "nvib", "⌕"); bs.type = "button"; bs.title = "Buscar en el chat";
      bs.onclick = function(){ var q = w.querySelector(".chsq"); if (window.innerWidth <= 800){ var bk = w.querySelector(".chback"); if (bk) bk.click(); setTimeout(function(){ var q2 = document.querySelector(".chw .chsq"); if (q2) q2.focus(); }, 80); } else if (q) q.focus(); };
      var bp = h("button", "nvib nvpinb"); bp.type = "button"; bp.title = "Mensajes fijados";
      bp.onclick = function(){ var p = w.querySelector(".chpins"); if (!p) return; w.classList.toggle("nvpinsoff"); };
      var bt = h("button", "nvib nvtkb", "☑ Tareas"); bt.type = "button"; bt.title = "Tareas, fijados y archivos de este chat";
      bt.onclick = function(){ var on = !w.classList.contains("nvrp"); w.classList.toggle("nvrp", on); ls("nv-rp", on ? "1" : "0"); };
      a.append(bs, bp, bt);
      var bell = tt.querySelector(".nvbell"); if (bell) a.insertBefore(bell, bt);
      tt.appendChild(a);
    }
    var bell2 = tt.querySelector(".nvbell"); if (bell2 && bell2.parentNode !== tt.querySelector(".nvacts")) tt.querySelector(".nvacts").insertBefore(bell2, tt.querySelector(".nvtkb"));
    var pins = w.querySelector(".chpins"), n = pins ? pins.querySelectorAll(".chpin,.chmsg,[data-id]").length || pins.children.length : 0;
    var pb = tt.querySelector(".nvpinb"), t = "📌 " + n; if (pb.textContent !== t) pb.textContent = t;
    if (ls("nv-rp") === "1" && !w.dataset.nvrpi){ w.classList.add("nvrp"); }
    w.dataset.nvrpi = 1;
  }

  /* ---------- avisos tipo WhatsApp ---------- */
  var ctx = null;
  function sonido(){
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      [[880, 0], [1320, .09]].forEach(function(p){
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = p[0];
        g.gain.setValueAtTime(0, ctx.currentTime + p[1]);
        g.gain.linearRampToValueAtTime(.12, ctx.currentTime + p[1] + .015);
        g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + p[1] + .22);
        o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + p[1]); o.stop(ctx.currentTime + p[1] + .25);
      });
    } catch(e){}
  }
  function avisar(n){
    if (n.dataset.nvn) return; n.dataset.nvn = 1;
    sonido();
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    var t = n.querySelector(".chnt b"), c = n.querySelector(".chnt span");
    var titulo = t ? t.textContent : "Nervo", cuerpo = c ? c.textContent.replace(/\*\*|__|~~|`/g, "").replace(/^>\s?/, "") : "";
    try {
      var no = new Notification(titulo, { body: cuerpo, icon: "img/icon-192.png", badge: "img/icon-192.png", tag: "nv-chat", renotify: true });
      no.onclick = function(){ window.focus(); n.click(); no.close(); };
    } catch(e){}
  }
  function botonAvisos(tt){
    if (!("Notification" in window) || tt.querySelector(".nvbell")) return;
    var b = h("button", "nvbell nvib"); b.type = "button";
    function pintar(){ var p = Notification.permission; b.textContent = p === "granted" ? "🔔" : p === "denied" ? "🔕" : "🔔 Activar avisos"; b.title = p === "granted" ? "Avisos activados" : p === "denied" ? "Avisos bloqueados en este navegador" : "Activar avisos"; b.classList.toggle("on", p === "granted"); }
    pintar();
    b.onclick = function(){
      if (Notification.permission === "granted"){ toastita("Los avisos ya están activados en este dispositivo."); return; }
      if (Notification.permission === "denied"){ toastita("Los avisos están bloqueados. Activalos desde el candado de la barra de direcciones."); return; }
      Notification.requestPermission().then(function(){ pintar(); if (Notification.permission === "granted"){ sonido(); try { new Notification("Listo", { body: "Así te van a llegar los mensajes del chat.", icon: "img/icon-192.png" }); } catch(e){} } });
    };
    tt.appendChild(b);
  }
  function toastita(t){ var d = h("div", "nvtoast", t); document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 4500); }

  /* ---------- observar la app ---------- */
  function pasar(){
    document.querySelectorAll(".chx:not([data-nvf])").forEach(formatear);
    document.querySelectorAll(".chp").forEach(limpiarPrevia);
    document.querySelectorAll(".chmsg:not([data-nvm])").forEach(mensaje);
    document.querySelectorAll("form.chf").forEach(caja);
    var w = document.querySelector(".chw");
    if (w){
      w.classList.add("nvchat");
      var tt = w.querySelector(".chtt"); if (tt) botonAvisos(tt);
      var chc = w.querySelector(".chc"); if (chc) grupos(chc);
      encabezado(w);
    }
  }
  var pend = false;
  new MutationObserver(function(muts){
    muts.forEach(function(m){ m.addedNodes.forEach(function(n){ if (n.nodeType === 1 && n.classList.contains("chnot")) avisar(n); }); });
    if (pend) return; pend = true;
    requestAnimationFrame(function(){ pend = false; try { pasar(); } catch(e){ console.warn(e); } });
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") pasar(); else document.addEventListener("DOMContentLoaded", pasar);
})();

/* ---------- Movimientos arriba de todo, solo y destacado ---------- */
(function(){
  if (window.__nvMovTop) return; window.__nvMovTop = 1;
  function poner(){
    var chc = document.querySelector(".chw .chc"); if (!chc) return;
    var b = Array.prototype.slice.call(chc.querySelectorAll(".chb")).find(function(x){ var l = x.querySelector(".chl1"); return l && /^\s*movimientos\s*$/i.test(l.textContent); });
    if (!b) return;
    b.dataset.nvg = "top"; b.classList.add("nvmovtop");
    var ancla = chc.querySelector(".chsq");
    var destino = ancla ? ancla.nextSibling : chc.firstChild;
    if (b.parentNode !== chc || b.previousElementSibling !== (ancla || null)) chc.insertBefore(b, destino);
  }
  var pend = false;
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; try { poner(); } catch(e){} }); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
