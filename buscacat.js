/* Buscador de categoría y cuenta: cualquier lista de categorías (Movimientos, Finanzas) se abre con un buscador.
   Se puede escribir parte de la categoría ("sueldo", "hilos") o de la cuenta ("mano de obra", "insumos"). */
(function(){
  if (window.__nvBuscaCat) return; window.__nvBuscaCat = 1;
  var css = document.createElement("style");
  css.textContent = [
    ".nvbc{position:fixed;z-index:9999;background:#F6F2ED;border:1px solid #E2DAD1;border-radius:16px;box-shadow:0 18px 40px rgba(74,63,55,.18);width:340px;max-width:calc(100vw - 24px);padding:10px;font-family:inherit;color:#4A3F37}",
    ".nvbc input{width:100%;box-sizing:border-box;border:0;outline:0;background:#ECE6DF;border-radius:11px;padding:9px 12px;font:inherit;font-size:14px;color:#4A3F37;box-shadow:inset 2px 2px 5px rgba(120,100,85,.16),inset -2px -2px 5px rgba(255,255,255,.8)}",
    ".nvbc-l{max-height:300px;overflow:auto;margin-top:8px}",
    ".nvbc-g{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9C7B62;font-weight:600;padding:8px 8px 3px}",
    ".nvbc-o{padding:7px 10px;border-radius:9px;font-size:13.5px;cursor:pointer}",
    ".nvbc-o:hover,.nvbc-o.sel{background:#E6DDD3}.nvbc-o.act{font-weight:600}",
    ".nvbc-v{color:#8C7D71;font-size:13px;padding:10px}"
  ].join("");
  document.head.appendChild(css);

  function N(s){ return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  // cuenta de cada categoría, sacada de lo ya cargado en Finanzas
  var CUENTA = null;
  function cuentas(){
    if (CUENTA) return CUENTA; CUENTA = {};
    try { var d = JSON.parse(localStorage.getItem("nv-base-v1") || "{}").d || {};
      (d.fin_euge || []).concat(d.fin_pau || []).forEach(function(r){ if (r.cat && r.cuenta && !CUENTA[r.cat]) CUENTA[r.cat] = r.cuenta; }); } catch(e){}
    var porNum = {}; Object.keys(CUENTA).forEach(function(c){ porNum[String(c).split(".")[0]] = CUENTA[c]; });
    CUENTA.__num = porNum; return CUENTA;
  }
  function cuentaDe(cat){ var C = cuentas(); return C[cat] || C.__num[String(cat).split(".")[0]] || "Otras"; }
  function esDeCategorias(sel){
    if (sel.dataset.nvbc === "no") return false;
    if (sel.dataset.nvbc === "si") return true;
    var ok = [].some.call(sel.options, function(o){ return /^\d+\.\d+\s/.test(o.value || o.text); }) && sel.options.length > 8;
    sel.dataset.nvbc = ok ? "si" : "no"; return ok;
  }

  var POP = null;
  function cerrar(){ if (POP){ POP.remove(); POP = null; document.removeEventListener("mousedown", fuera, true); } }
  function fuera(e){ if (POP && !POP.contains(e.target)) cerrar(); }
  function abrir(sel){
    cerrar();
    var ops = [].filter.call(sel.options, function(o){ return o.value; }).map(function(o){ return { v: o.value, t: o.text, c: cuentaDe(o.value) }; });
    var pop = document.createElement("div"); pop.className = "nvbc";
    var inp = document.createElement("input"); inp.placeholder = "Buscar categoría o cuenta…";
    var L = document.createElement("div"); L.className = "nvbc-l";
    pop.appendChild(inp); pop.appendChild(L); document.body.appendChild(pop); POP = pop;
    var r = sel.getBoundingClientRect(), top = r.bottom + 6;
    if (top + 360 > innerHeight) top = Math.max(8, r.top - 366);
    pop.style.top = top + "px"; pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pop.offsetWidth - 8)) + "px";
    var vis = [], idx = 0;
    function elegir(v){ sel.value = v; sel.dispatchEvent(new Event("input", { bubbles: true })); sel.dispatchEvent(new Event("change", { bubbles: true })); cerrar(); }
    function pintar(){
      var q = N(inp.value).trim().split(/\s+/).filter(Boolean);
      vis = ops.filter(function(o){ var h = N(o.t + " " + o.c); return q.every(function(w){ return h.indexOf(w) >= 0; }); });
      if (idx >= vis.length) idx = 0;
      L.innerHTML = ""; var g = null;
      if (!vis.length){ var v = document.createElement("div"); v.className = "nvbc-v"; v.textContent = "No encontré nada con eso"; L.appendChild(v); return; }
      vis.forEach(function(o, i){
        if (o.c !== g){ g = o.c; var h = document.createElement("div"); h.className = "nvbc-g"; h.textContent = g; L.appendChild(h); }
        var d = document.createElement("div"); d.className = "nvbc-o" + (i === idx ? " sel" : "") + (o.v === sel.value ? " act" : ""); d.textContent = o.t;
        d.onmousedown = function(e){ e.preventDefault(); elegir(o.v); }; L.appendChild(d);
      });
      var s = L.querySelector(".sel"); if (s) s.scrollIntoView({ block: "nearest" });
    }
    inp.oninput = function(){ idx = 0; pintar(); };
    inp.onkeydown = function(e){
      if (e.key === "ArrowDown"){ idx = Math.min(vis.length - 1, idx + 1); pintar(); e.preventDefault(); }
      else if (e.key === "ArrowUp"){ idx = Math.max(0, idx - 1); pintar(); e.preventDefault(); }
      else if (e.key === "Enter"){ if (vis[idx]) elegir(vis[idx].v); e.preventDefault(); }
      else if (e.key === "Escape"){ cerrar(); }
    };
    pintar(); setTimeout(function(){ inp.focus(); }, 0);
    document.addEventListener("mousedown", fuera, true);
  }
  // reemplaza la lista común por el buscador (mouse y teclado)
  document.addEventListener("mousedown", function(e){
    var s = e.target && e.target.closest && e.target.closest("select");
    if (!s || s.disabled || !esDeCategorias(s)) return;
    e.preventDefault(); abrir(s);
  }, true);
  document.addEventListener("keydown", function(e){
    var s = document.activeElement;
    if (!s || s.tagName !== "SELECT" || !esDeCategorias(s)) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown"){ e.preventDefault(); abrir(s); }
  }, true);
  window.addEventListener("scroll", function(e){ if (POP && !POP.contains(e.target)) cerrar(); }, true);
})();
