/* Chat tipo Slack: formato, barra de herramientas, avisos tipo WhatsApp */
(function(){
  if (window.__nvChat) return; window.__nvChat = 1;

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
    return t.split("\n").map(function(l){
      var m;
      if ((m = l.match(/^#{1,3}\s+(.*)$/))) return '<span class="nvh">'+inline(m[1])+'</span>';
      if ((m = l.match(/^\s*[-•]\s+(.*)$/))) return '<span class="nvli">'+inline(m[1])+'</span>';
      if ((m = l.match(/^\s*(\d+)[.)]\s+(.*)$/))) return '<span class="nvli nvol" data-n="'+m[1]+'.">'+inline(m[2])+'</span>';
      if ((m = l.match(/^&gt;\s?(.*)$/)) || (m = l.match(/^>\s?(.*)$/))) return '<span class="nvq">'+inline(m[1])+'</span>';
      return inline(l);
    }).join("\n");
  }
  function formatear(box){
    if (box.dataset.nvf) return; box.dataset.nvf = 1;
    Array.prototype.slice.call(box.childNodes).forEach(function(n){
      if (n.nodeType !== 3 || !/[*_~`#>\-•]|https?:/.test(n.nodeValue)) return;
      var sp = document.createElement("span"); sp.className = "nvf"; sp.innerHTML = fmtText(n.nodeValue);
      n.replaceWith(sp);
    });
  }
  function limpiarPrevia(el){
    if (!/\*\*|__|~~|`|(^|:\s*)#{1,3}\s|(^|\s)[*_~][^\s]/.test(el.textContent)) return;
    el.textContent = el.textContent.replace(/\*\*|__|~~|`/g, "").replace(/(^|\s)[*_~]([^*_~]+)[*_~]/g, "$1$2").replace(/(^|:\s*)#{1,3}\s+/, "$1");
  }

  /* ---------- barra de formato ---------- */
  var BOTONES = [
    ["b", "<b>B</b>", "Negrita (⌘B)", "**", "**"],
    ["i", "<i>I</i>", "Cursiva (⌘I)", "_", "_"],
    ["u", "<u>U</u>", "Subrayado (⌘U)", "__", "__"],
    ["s", "<s>S</s>", "Tachado", "~~", "~~"],
    ["sep"],
    ["c", "&lt;/&gt;", "Código", "`", "`"],
    ["l", "•", "Lista", "- ", "", 1],
    ["n", "1.", "Lista numerada", "1. ", "", 1],
    ["q", "❝", "Cita", "> ", "", 1]
  ];
  function envolver(ta, a, b, linea){
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value, sel = v.slice(s, e);
    if (linea){
      var ini = v.lastIndexOf("\n", s - 1) + 1;
      var bloque = v.slice(ini, e) || "";
      var nuevo = bloque.split("\n").map(function(l, i){ return (a === "1. " ? (i + 1) + ". " : a) + l; }).join("\n");
      ta.value = v.slice(0, ini) + nuevo + v.slice(e);
      ta.selectionStart = ta.selectionEnd = ini + nuevo.length;
    } else {
      ta.value = v.slice(0, s) + a + sel + b + v.slice(e);
      if (sel) { ta.selectionStart = s; ta.selectionEnd = e + a.length + b.length; }
      else { ta.selectionStart = ta.selectionEnd = s + a.length; }
    }
    ta.focus(); ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function barra(form){
    if (form.querySelector(".nvtb")) return;
    var ta = form.querySelector("textarea"); if (!ta) return;
    var tb = document.createElement("div"); tb.className = "nvtb";
    BOTONES.forEach(function(x){
      if (x[0] === "sep"){ var sp = document.createElement("i"); sp.className = "nvsep"; tb.appendChild(sp); return; }
      var bt = document.createElement("button"); bt.type = "button"; bt.innerHTML = x[1]; bt.title = x[2];
      bt.onmousedown = function(e){ e.preventDefault(); };
      bt.onclick = function(){ envolver(ta, x[3], x[4], x[5]); };
      tb.appendChild(bt);
    });
    form.insertBefore(tb, form.firstChild);
    form.classList.add("nvform");
    ta.addEventListener("keydown", function(e){
      if (!(e.metaKey || e.ctrlKey)) return;
      var k = e.key.toLowerCase();
      if (k === "b"){ e.preventDefault(); envolver(ta, "**", "**"); }
      else if (k === "i"){ e.preventDefault(); envolver(ta, "_", "_"); }
      else if (k === "u"){ e.preventDefault(); envolver(ta, "__", "__"); }
    });
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
    var titulo = t ? t.textContent : "Nervo", cuerpo = c ? c.textContent.replace(/\*\*|__|~~|`/g, "") : "";
    try {
      var no = new Notification(titulo, { body: cuerpo, icon: "img/icon-192.png", badge: "img/icon-192.png", tag: "nv-chat", renotify: true });
      no.onclick = function(){ window.focus(); n.click(); no.close(); };
    } catch(e){
      if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function(r){ r.showNotification(titulo, { body: cuerpo, icon: "img/icon-192.png", tag: "nv-chat" }); }).catch(function(){});
    }
  }
  function botonAvisos(h){
    if (!("Notification" in window) || h.querySelector(".nvbell")) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "nvbell";
    function pintar(){
      var p = Notification.permission;
      b.textContent = p === "granted" ? "🔔 Avisos activados" : p === "denied" ? "🔕 Avisos bloqueados" : "🔔 Activar avisos";
      b.classList.toggle("on", p === "granted");
    }
    pintar();
    b.onclick = function(){
      if (Notification.permission === "denied"){ alertita("Los avisos están bloqueados en este navegador. Activalos desde el candado de la barra de direcciones."); return; }
      Notification.requestPermission().then(function(){ pintar(); if (Notification.permission === "granted"){ sonido(); new Notification("Listo", { body: "Así te van a llegar los mensajes del chat.", icon: "img/icon-192.png" }); } });
    };
    h.appendChild(b);
  }
  function alertita(t){ var d = document.createElement("div"); d.className = "nvtoast"; d.textContent = t; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 5000); }

  /* ---------- observar la app ---------- */
  function pasar(raiz){
    (raiz.querySelectorAll ? raiz : document).querySelectorAll(".chx:not([data-nvf])").forEach(formatear);
    (raiz.querySelectorAll ? raiz : document).querySelectorAll(".chp").forEach(limpiarPrevia);
    document.querySelectorAll("form.chf").forEach(barra);
    document.querySelectorAll(".chtt").forEach(botonAvisos);
  }
  var pend = false;
  new MutationObserver(function(muts){
    muts.forEach(function(m){ m.addedNodes.forEach(function(n){ if (n.nodeType === 1 && n.classList.contains("chnot")) avisar(n); }); });
    if (pend) return; pend = true;
    requestAnimationFrame(function(){ pend = false; pasar(document); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") pasar(document); else document.addEventListener("DOMContentLoaded", function(){ pasar(document); });
})();
