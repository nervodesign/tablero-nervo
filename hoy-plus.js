/* Hoy con el diseño nuevo: tarjeta grande de facturación + tarjetas + pedidos en camino */
(function(){
  if (window.__nvHoy) return; window.__nvHoy = 1;
  var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  function h(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function plata(n){ n = Math.round(n || 0); if (Math.abs(n) >= 1e6) return "$ " + (n / 1e6).toFixed(1).replace(".", ",") + "M"; if (Math.abs(n) >= 1e3) return "$ " + Math.round(n / 1e3) + "k"; return "$ " + n; }
  function hoyStr(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function mesAnt(mm){ var y = +mm.slice(0, 4), m = +mm.slice(5, 7) - 1; if (m === 0){ y--; m = 12; } return y + "-" + String(m).padStart(2, "0"); }

  function datos(){
    var S = window.__nv && window.__nv.S; if (!S || !S.ven || !S.ven.ord) return null;
    var hoy = hoyStr(), mm = hoy.slice(0, 7), dia = +hoy.slice(8, 10), ma = mesAnt(mm);
    var ord = S.ven.ord || [], may = S.ven.may || [];
    function del(L, m){ return L.filter(function(x){ return String(x.f || "").slice(0, 7) === m; }); }
    function sum(L){ return L.reduce(function(a, x){ return a + (Number(x.t) || 0); }, 0); }
    var oM = del(ord, mm), yM = del(may, mm);
    var hastaDia = function(L){ return L.filter(function(x){ return +String(x.f).slice(8, 10) <= dia; }); };
    var antes = sum(hastaDia(del(ord, ma))) + sum(hastaDia(del(may, ma)));
    var total = sum(oM) + sum(yM);
    var serie = [], ac = 0, porDia = {};
    oM.concat(yM).forEach(function(x){ var d = +String(x.f).slice(8, 10); porDia[d] = (porDia[d] || 0) + (Number(x.t) || 0); });
    for (var d = 1; d <= dia; d++){ ac += porDia[d] || 0; serie.push(ac); }
    var hoyN = oM.filter(function(x){ return x.f === hoy; }).length + yM.filter(function(x){ return x.f === hoy; }).length;
    return { mes: MESES[+mm.slice(5, 7) - 1], total: total, antes: antes, serie: serie,
      minN: oM.length, minT: sum(oM), mayN: yM.length, mayT: sum(yM),
      ticket: oM.length ? sum(oM) / oM.length : 0, hoyN: hoyN };
  }

  function spark(vals){
    var W = 600, H = 110;
    var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("preserveAspectRatio", "none"); svg.setAttribute("class", "nvh-sp");
    if (!vals || vals.length < 2) return svg;
    var mx = Math.max.apply(null, vals) || 1;
    var pts = vals.map(function(v, i){ return [i * (W - 8) / (vals.length - 1) + 4, H - 6 - (v / mx) * (H - 16)]; });
    var d = "M" + pts.map(function(p){ return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L");
    var area = document.createElementNS(NS, "path"); area.setAttribute("d", d + " L" + pts[pts.length - 1][0] + " " + H + " L4 " + H + " Z"); area.setAttribute("class", "nvh-ar");
    var ln = document.createElementNS(NS, "path"); ln.setAttribute("d", d); ln.setAttribute("class", "nvh-ln");
    var c = document.createElementNS(NS, "circle"); var u = pts[pts.length - 1]; c.setAttribute("cx", u[0]); c.setAttribute("cy", u[1]); c.setAttribute("r", 5); c.setAttribute("class", "nvh-pt");
    var g = document.createElementNS(NS, "linearGradient"); g.id = "nvhg"; g.setAttribute("x1", 0); g.setAttribute("x2", 0); g.setAttribute("y1", 0); g.setAttribute("y2", 1);
    g.innerHTML = '<stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>';
    var defs = document.createElementNS(NS, "defs"); defs.appendChild(g);
    svg.append(defs, area, ln, c);
    return svg;
  }

  function heroEl(D, kFac){
    var hero = h("button", "nvh-hero"); hero.type = "button";
    if (kFac) hero.onclick = function(){ kFac.click(); };
    var mes = D ? D.mes : MESES[new Date().getMonth()];
    var lab = h("div", "nvh-lab"); lab.append(h("span", null, "Facturado " + mes), h("span", null, "En curso"));
    hero.append(lab, h("div", "nvh-big", D ? plata(D.total) : "…"));
    if (D && D.antes > 0){
      var p = Math.round((D.total / D.antes - 1) * 100);
      hero.append(h("span", "nvh-chip", (p >= 0 ? "▲ " : "▼ ") + Math.abs(p) + "% vs. " + MESES[(new Date().getMonth() + 11) % 12] + " a esta altura"));
    } else hero.append(h("span", "nvh-chip", D ? "Primer mes con datos" : "Cargando ventas…"));
    hero.append(spark(D ? D.serie : null));
    var sp = h("div", "nvh-split"), mxx = D ? (Math.max(D.minT, D.mayT) || 1) : 1;
    function caja(t, v, bar, col){ var c = h("div"); c.append(h("small", null, t), h("b", null, v)); if (bar != null){ var br = h("i", "nvh-bar"), f = h("em"); f.style.width = Math.round(bar * 100) + "%"; f.style.background = col; br.append(f); c.append(br); } return c; }
    sp.append(caja("Minorista" + (D ? " · " + D.minN + " ventas" : ""), D ? plata(D.minT) : "…", D ? D.minT / mxx : 0, "#E9C6C2"),
              caja("Mayorista" + (D ? " · " + D.mayN + " pedidos" : ""), D ? plata(D.mayT) : "…", D ? D.mayT / mxx : 0, "#BFD0DD"),
              caja("Ticket promedio", D ? plata(D.ticket) : "…"),
              caja("Ventas hoy", D ? String(D.hoyN) : "…"));
    hero.append(sp);
    return hero;
  }
  function armar(list){
    var top = list.querySelector(".pz-top"); if (!top) return;
    var kpis = top.querySelector(".kpis"); if (!kpis) return;
    var bs = Array.prototype.slice.call(kpis.querySelectorAll(".kpi"));
    var kFac = bs.find(function(b){ return /Facturado/i.test(b.textContent); });
    var D = datos(), g = list.querySelector(".nvh");
    if (g){
      if (g.dataset.ph && D){ var old = g.querySelector(".nvh-hero"); g.replaceChild(heroEl(D, kFac), old); delete g.dataset.ph; }
      kanban(g);
      return;
    }
    var kTar = bs.find(function(b){ return /Tareas/i.test(b.textContent); });
    var kPag = bs.find(function(b){ return /pagar/i.test(b.textContent); });
    var pipe = list.querySelector(".hp-pipe");
    g = h("div", "nvh"); if (!D) g.dataset.ph = 1;
    g.append(heroEl(D, kFac));
    if (kTar){ kTar.classList.add("nvh-k"); g.append(kTar); }
    if (kPag){ kPag.classList.add("nvh-k"); g.append(kPag); }
    if (pipe){ pipe.classList.add("nvh-pipe"); g.append(pipe); }
    kpis.style.setProperty("display", "none", "important");
    top.appendChild(g);
    kanban(g);
  }

  /* ---------- Pedidos en camino como kanban (solo muestra, no cambia nada) ---------- */
  var KB = [["Por revisar",/REVISAR/i,"#C9AE9A"],["Para hacer",/PARA HACER/i,"#E2AEB8"],["En proceso",/PROCESO/i,"#9DBCD6"],["Para embalar",/EMBALAR/i,"#8A6552"],["Listo",/LISTO/i,"#5F87A8"]];
  function txt(v){ if (v == null) return ""; if (Array.isArray(v)) return v.map(txt).filter(Boolean).join(", "); if (typeof v === "object") return txt(v.nombre || v.n || v.prod || v.producto || ""); return String(v); }
  function kanban(g){
    var S = window.__nv && window.__nv.S, B = S && S.bzData && S.bzData.min; if (!B) return;
    var mes = new Date().toISOString().slice(0, 7), R = B.filter(function(r){ return !/ARCHIVADO/i.test(r.env || ""); });
    var cols = KB.map(function(k){ return R.filter(function(r){ return k[1].test(r.env || ""); }); });
    var env = R.filter(function(r){ return /ENVIADO|RETIRADO/i.test(r.env || "") && String(r.fecha || "").slice(0, 7) === mes; }).length;
    var act = cols.reduce(function(a, c){ return a + c.length; }, 0);
    var sig = cols.map(function(c){ return c.map(function(r){ return r.id || r.num; }).join(","); }).join("|") + "|" + env;
    var card = g.querySelector(".nvpk");
    if (card && card.dataset.sig === sig) return;
    if (!card){ card = h("section", "nvpk"); g.append(card); }
    card.dataset.sig = sig; card.replaceChildren();
    var hd = h("div", "nvpk-h");
    var t = h("div"); t.append(h("b", null, "Pedidos en camino"), h("small", null, act + " activos · " + env + " enviados este mes"));
    var ver = h("button", "nvpk-ver", "Ver todos →"); ver.type = "button"; ver.onclick = function(){ try { window.__nv.setTab("base"); } catch(e){} };
    hd.append(t, ver); card.append(hd);
    var wrap = h("div", "nvpk-cols");
    KB.forEach(function(k, i){
      var c = h("div", "nvpk-col"), lst = cols[i];
      var ch = h("div", "nvpk-ch"); var d = h("i"); d.style.background = k[2]; ch.append(d, h("span", null, k[0]), h("em", null, String(lst.length))); c.append(ch);
      lst.slice().sort(function(a, b){ return String(a.fecha || "").localeCompare(String(b.fecha || "")); }).slice(0, 2).forEach(function(r){
        var tk = h("div", "nvpk-tk"); tk.onclick = function(){ try { window.__nv.setTab("base"); } catch(e){} };
        tk.append(h("b", null, txt(r.cliente) || ("Pedido " + txt(r.num))));
        var p = txt(r.prods); if (p) tk.append(h("span", null, p));
        var f = String(r.fecha || "").slice(0, 10); if (f || r.num) tk.append(h("small", null, (r.num ? "#" + txt(r.num) : "") + (f ? (r.num ? " · " : "") + f.split("-").reverse().slice(0, 2).join("/") : "")));
        c.append(tk);
      });
      if (lst.length > 2) c.append(h("div", "nvpk-mas", "+ " + (lst.length - 2) + " más"));
      if (!lst.length) c.append(h("div", "nvpk-vacio", "—"));
      wrap.append(c);
    });
    card.append(wrap);
  }

  var pend = false;
  function pasar(){ var L = document.querySelector("main#list"); if (L) try { armar(L); } catch(e){ console.warn(e); } }
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; pasar(); }); })
    .observe(document.documentElement, { childList: true, subtree: true });
  pasar();
})();

/* ---------- Fiesta: cuando marcás una tarea como hecha, papelitos ---------- */
(function(){
  if (window.__nvFiesta) return; window.__nvFiesta = 1;
  var COL = ["#DFB9B6","#F2C9CF","#6B4A3A","#A47E65","#B7CEDE","#8FB3CF","#EAD9C6"];
  var ult = { t: 0, x: innerWidth / 2, y: innerHeight / 2 };
  document.addEventListener("pointerdown", function(e){ ult = { t: Date.now(), x: e.clientX, y: e.clientY }; }, true);
  function hoy(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function hechas(){
    var S = window.__nv && window.__nv.S, T = S && S.tareas; if (!T) return null;
    var o = {}, h = hoy();
    T.forEach(function(t){ if (t.estado === "hecha" || String(t.hdia || "").indexOf(h) === 0) o[t.id] = 1; });
    return o;
  }
  function fiesta(x, y){
    var cv = document.createElement("canvas"), dpr = devicePixelRatio || 1;
    cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999";
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; document.body.appendChild(cv);
    var c = cv.getContext("2d"); c.scale(dpr, dpr);
    var P = [];
    for (var i = 0; i < 90; i++){
      var a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1, v = 6 + Math.random() * 9;
      P.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.28, vr: (Math.random() - .5) * .35,
        w: 5 + Math.random() * 6, h: 8 + Math.random() * 8, col: COL[i % COL.length], round: Math.random() < .3 });
    }
    var t0 = performance.now();
    (function paso(t){
      var dt = t - t0; c.clearRect(0, 0, innerWidth, innerHeight);
      P.forEach(function(p){
        p.vy += .28; p.vx *= .99; p.vy *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        c.save(); c.globalAlpha = Math.max(0, 1 - dt / 1900); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.col;
        if (p.round){ c.beginPath(); c.arc(0, 0, p.w / 2, 0, 6.28); c.fill(); } else c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
        c.restore();
      });
      if (dt < 1900) requestAnimationFrame(paso); else cv.remove();
    })(t0);
    var frases = ["¡Bien ahí!", "¡Una menos!", "¡Genia!", "¡Hecho!", "¡Vamos!"];
    var m = document.createElement("div"); m.textContent = frases[Math.floor(Math.random() * frases.length)] + " 🎉";
    m.style.cssText = "position:fixed;left:50%;bottom:40px;transform:translate(-50%,20px);opacity:0;background:#fff;color:#3B2418;border:1px solid #EEDCD5;border-radius:20px;padding:10px 18px;font:600 15px Outfit,system-ui,sans-serif;box-shadow:0 14px 34px rgba(58,36,28,.16);z-index:99999;transition:all .35s cubic-bezier(.2,.8,.2,1);pointer-events:none";
    document.body.appendChild(m);
    requestAnimationFrame(function(){ m.style.opacity = 1; m.style.transform = "translate(-50%,0)"; });
    setTimeout(function(){ m.style.opacity = 0; m.style.transform = "translate(-50%,20px)"; setTimeout(function(){ m.remove(); }, 400); }, 1600);
  }
  window.__nvFiestaYa = fiesta;
  var antes = null;
  setInterval(function(){
    var now = hechas(); if (!now) return;
    if (antes){
      var nueva = Object.keys(now).some(function(id){ return !antes[id]; });
      if (nueva && Date.now() - ult.t < 4000){ fiesta(ult.x, ult.y); ult.t = 0; }
    }
    antes = now;
  }, 300);
})();
