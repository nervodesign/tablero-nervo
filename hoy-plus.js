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

  function armar(list){
    var top = list.querySelector(".pz-top"); if (!top || list.querySelector(".nvh")) return;
    var D = datos(); if (!D) return;
    var kpis = top.querySelector(".kpis"); if (!kpis) return;
    var bs = Array.prototype.slice.call(kpis.querySelectorAll(".kpi"));
    var kFac = bs.find(function(b){ return /Facturado/i.test(b.textContent); });
    var kTar = bs.find(function(b){ return /Tareas/i.test(b.textContent); });
    var kPag = bs.find(function(b){ return /pagar/i.test(b.textContent); });
    var pipe = list.querySelector(".hp-pipe");

    var g = h("div", "nvh");
    var hero = h("button", "nvh-hero"); hero.type = "button";
    if (kFac) hero.onclick = function(){ kFac.click(); };
    var lab = h("div", "nvh-lab"); lab.append(h("span", null, "Facturado " + D.mes), h("span", null, "En curso"));
    var big = h("div", "nvh-big", plata(D.total));
    hero.append(lab, big);
    if (D.antes > 0){
      var p = Math.round((D.total / D.antes - 1) * 100);
      hero.append(h("span", "nvh-chip", (p >= 0 ? "▲ " : "▼ ") + Math.abs(p) + "% vs. " + MESES[(new Date().getMonth() + 11) % 12] + " a esta altura"));
    }
    hero.append(spark(D.serie));
    var sp = h("div", "nvh-split"), mxx = Math.max(D.minT, D.mayT) || 1;
    function caja(t, v, bar, col){ var c = h("div"); c.append(h("small", null, t), h("b", null, v)); if (bar != null){ var br = h("i", "nvh-bar"), f = h("em"); f.style.width = Math.round(bar * 100) + "%"; f.style.background = col; br.append(f); c.append(br); } return c; }
    sp.append(caja("Minorista · " + D.minN + " ventas", plata(D.minT), D.minT / mxx, "#E9C6C2"),
              caja("Mayorista · " + D.mayN + " pedidos", plata(D.mayT), D.mayT / mxx, "#BFD0DD"),
              caja("Ticket promedio", plata(D.ticket)),
              caja("Ventas hoy", String(D.hoyN)));
    hero.append(sp);
    g.append(hero);
    if (kTar){ kTar.classList.add("nvh-k"); g.append(kTar); }
    if (kPag){ kPag.classList.add("nvh-k"); g.append(kPag); }
    if (pipe){ pipe.classList.add("nvh-pipe"); g.append(pipe); }
    kpis.style.setProperty("display", "none", "important");
    top.appendChild(g);
  }

  var pend = false;
  function pasar(){ var L = document.querySelector("main#list"); if (L) try { armar(L); } catch(e){ console.warn(e); } }
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; pasar(); }); })
    .observe(document.documentElement, { childList: true, subtree: true });
  pasar();
})();
