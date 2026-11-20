/* ================= Tareas: elegir qué días se repite + aviso al celu cuando te cargan una tarea ================= */
(function(){
  if (window.__nvTareasPlus) return; window.__nvTareasPlus = 1;
  var D = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"], ORD = [1,2,3,4,5,6,0];
  var CSS = [
    ".nvrep-ch{display:inline-flex!important;align-items:center;gap:6px;white-space:nowrap}",
    ".nvrep{border:0;background:rgba(255,255,255,.75);color:#7A5E50;border-radius:999px;width:20px;height:20px;margin:0 -4px 0 2px;cursor:pointer;font-size:11px;line-height:20px;padding:0;flex:0 0 auto}",
    ".nvrep:hover{background:#EDE3DB;color:#3B2418}.nvrep.on{background:#E4ECE4;color:#4E6B4F}",
    ".nvrep-pop{position:fixed;z-index:9500;background:#fff;border-radius:18px;box-shadow:0 10px 34px rgba(58,36,28,.18);padding:14px;width:280px;font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    ".nvrep-pop b{display:block;font-weight:500;font-size:14px;margin-bottom:10px}",
    ".nvrep-pop .op{display:flex;gap:6px;margin-bottom:10px}.nvrep-pop .op button{flex:1;border:0;border-radius:12px;padding:8px 6px;background:#F5EFEA;font:400 13px Outfit,system-ui,sans-serif;color:#5A3A2A;cursor:pointer}",
    ".nvrep-pop .op button.sel{background:#3B2418;color:#fff}",
    ".nvrep-pop .ds{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px}",
    ".nvrep-pop .ds button{border:0;border-radius:10px;padding:8px 0;background:#F5EFEA;font:400 12px Outfit,system-ui,sans-serif;color:#5A3A2A;cursor:pointer}",
    ".nvrep-pop .ds button.sel{background:#7E9A82;color:#fff}",
    ".nvrep-pop .ft{display:flex;gap:6px;justify-content:flex-end}.nvrep-pop .ft button{border:0;border-radius:999px;padding:8px 14px;font:400 13px Outfit,system-ui,sans-serif;cursor:pointer;background:#F5EFEA;color:#3B2418}",
    ".nvrep-pop .ft button.ok{background:#3B2418;color:#fff}",
    ".nvrep-pop .hint{font-size:11.5px;color:#9A8274;margin:-4px 0 10px;font-weight:300}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function S(){ return (window.__nv && window.__nv.S) || {}; }
  function tarea(id){ return (S().tareas || []).find(function(t){ return String(t.id) === String(id); }); }
  function diasDe(rep){ var m = /^dias:([\d,]*)/.exec(rep || ""); return m ? m[1].split(",").filter(Boolean).map(Number) : (rep === "diaria" ? [0,1,2,3,4,5,6] : []); }
  function toast(t){ try { var d = document.createElement("div"); d.textContent = t; d.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#3B2418;color:#fff;padding:11px 18px;border-radius:999px;font:400 14px Outfit,system-ui,sans-serif;z-index:9999"; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 2400); } catch(e){} }

  /* ---------- botón ↻ al lado de la fecha de cada tarea ---------- */
  function botones(){
    document.querySelectorAll("[data-nvt]").forEach(function(ch){
      var on = !!(window.__nvRR && window.__nvRR(tarea(ch.dataset.nvt) || {}));
      var b = ch.querySelector(".nvrep");
      if (b){ b.classList.toggle("on", on); return; }
      var sig = ch.nextElementSibling; if (sig && sig.classList.contains("nvrep")) sig.remove();
      b = document.createElement("button"); b.type = "button"; b.className = "nvrep"; b.textContent = "↻"; b.title = "¿Se repite?";
      b.dataset.id = ch.dataset.nvt; if (on) b.classList.add("on");
      ch.classList.add("nvrep-ch"); ch.appendChild(b);
    });
  }
  setInterval(function(){ try { botones(); } catch(e){} }, 700);

  var POP = null;
  function cerrar(){ if (POP){ POP.remove(); POP = null; } }
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest(".nvrep");
    if (!b){ if (POP && !POP.contains(e.target)) cerrar(); return; }
    e.preventDefault(); e.stopPropagation();
    cerrar();
    var t = tarea(b.dataset.id); if (!t){ toast("No encontré la tarea"); return; }
    var sel = diasDe(t.rep), modo = !sel.length ? "no" : sel.length === 7 ? "todos" : "dias";
    POP = document.createElement("div"); POP.className = "nvrep-pop";
    function dib(){
      POP.innerHTML = "<b>¿Se repite?</b>" +
        '<div class="op"><button data-m="no"' + (modo === "no" ? ' class="sel"' : "") + '>No</button><button data-m="todos"' + (modo === "todos" ? ' class="sel"' : "") + '>Todos los días</button><button data-m="dias"' + (modo === "dias" ? ' class="sel"' : "") + ">Algunos días</button></div>" +
        (modo === "dias" ? '<div class="hint">Tocá los días en que se repite</div><div class="ds">' + ORD.map(function(d){ return '<button data-d="' + d + '"' + (sel.indexOf(d) >= 0 ? ' class="sel"' : "") + ">" + D[d].slice(0, 2) + "</button>"; }).join("") + "</div>" : "") +
        '<div class="ft"><button data-x="1">Cancelar</button><button class="ok" data-ok="1">Guardar</button></div>';
    }
    dib(); document.body.appendChild(POP);
    var r = b.getBoundingClientRect(), w = 280, x = Math.min(window.innerWidth - w - 10, Math.max(10, r.left - 120)), y = r.bottom + 8;
    if (y + 220 > window.innerHeight) y = Math.max(10, r.top - 220);
    POP.style.left = x + "px"; POP.style.top = y + "px";
    POP.addEventListener("click", function(ev){
      ev.stopPropagation();
      var m = ev.target.closest("[data-m]"); if (m){ modo = m.dataset.m; if (modo === "dias" && (!sel.length || sel.length === 7)) sel = [1,2,3,4,5]; dib(); return; }
      var d = ev.target.closest("[data-d]"); if (d){ var n = +d.dataset.d, i = sel.indexOf(n); if (i >= 0) sel.splice(i, 1); else sel.push(n); dib(); return; }
      if (ev.target.closest("[data-x]")){ cerrar(); return; }
      if (ev.target.closest("[data-ok]")){
        var rep = modo === "no" ? "" : modo === "todos" ? "diaria" : (sel.length ? "dias:" + sel.slice().sort().join(",") : "");
        if (modo === "dias" && sel.length === 7) rep = "diaria";
        if (typeof window.__nvObjSave !== "function"){ toast("Actualizá la página y probá de nuevo"); return; }
        var cambio = { id: t.id, rep: rep };
        if (rep && t.estado === "hecha") cambio.estado = "pendiente";
        window.__nvObjSave("tareas", cambio, rep ? "↻ Se repite: " + (window.__nvRTxt ? window.__nvRTxt({ rep: rep }) : "") : "Ya no se repite");
        cerrar();
      }
    });
  }, true);

  /* ---------- aviso al celu cuando cargás una tarea para otra persona ---------- */
  var VISTO = null, RESP = {};
  function avisar(t){
    try {
      var para = String(t.resp || "").toLowerCase(); if (!/^(euge|pau|nervo)$/.test(para)) para = "";
      window.__sb.functions.invoke("avisos", { body: { accion: "tarea", para: para, titulo: t.titulo || "", id: t.id } }).catch(function(){});
    } catch(e){}
  }
  setInterval(function(){
    try {
      var s = S(), L = s.tareas || [], yo = s.soy; if (!yo || !L.length || !window.__sb) return;
      if (!VISTO){ VISTO = {}; L.forEach(function(t){ VISTO[t.id] = 1; RESP[t.id] = t.resp || ""; }); return; }
      L.forEach(function(t){
        var nueva = !VISTO[t.id], cambioResp = !nueva && (t.resp || "") !== RESP[t.id];
        VISTO[t.id] = 1; RESP[t.id] = t.resp || "";
        if (!nueva && !cambioResp) return;
        if (t.por && t.por !== yo) return;
        if (!t.resp || t.resp === yo) return;
        avisar(t);
      });
    } catch(e){}
  }, 2500);
})();
