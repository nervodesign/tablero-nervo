/* ================= Mayoristas: diseño más claro y escribir por WhatsApp con un toque ================= */
(function(){
  if (window.__nvMay) return; window.__nvMay = 1;
  var CSS = [
    /* encabezado y solapas */
    "html:not(#nv) main#list.nvmy .my-top{position:sticky;top:0;z-index:5;background:linear-gradient(#FBFAF9 70%,rgba(251,250,249,0));padding:4px 0 12px;margin-bottom:4px}",
    "html:not(#nv) main#list.nvmy .my-top .pz-sw{background:#F3EEEA!important;border-radius:16px!important;padding:4px!important;box-shadow:none!important;border:0!important;gap:2px;display:inline-flex}",
    "html:not(#nv) main#list.nvmy .my-top .pz-sw button{border-radius:12px!important;padding:8px 14px!important;font-family:Outfit,system-ui,sans-serif!important;font-weight:400!important;font-size:13.5px!important;color:#7A5E50!important;background:transparent!important;box-shadow:none!important;border:0!important;white-space:nowrap}",
    "html:not(#nv) main#list.nvmy .my-top .pz-sw button[aria-pressed=true],html:not(#nv) main#list.nvmy .my-top .pz-sw button.on,html:not(#nv) main#list.nvmy .my-top .pz-sw button.active,html:not(#nv) main#list.nvmy .my-top .pz-sw button.sel{background:#fff!important;color:#3B2418!important;box-shadow:0 1px 3px rgba(58,36,28,.08)!important}",
    /* números de arriba: solo en Hoy, cada uno con su color */
    "html:not(#nv) main#list.nvmy:not(.nvmy-hoy) .mc-kpis{display:none!important}",
    "html:not(#nv) main#list.nvmy .mc-kpis{gap:10px!important;margin-bottom:16px!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi{border:0!important;border-radius:20px!important;padding:14px 16px!important;box-shadow:0 1px 2px rgba(58,36,28,.04),0 6px 18px rgba(58,36,28,.05)!important;font-family:Outfit,system-ui,sans-serif}",
    "html:not(#nv) main#list.nvmy .mc-kpi.k1{background:linear-gradient(135deg,#F4FAF4,#E3EFE4)!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi.k2{background:linear-gradient(135deg,#FFFAF0,#F8EBD3)!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi.k3{background:linear-gradient(135deg,#FFF6F4,#F8E3DE)!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi.k4{background:linear-gradient(135deg,#4A2E20,#3B2418)!important;color:#fff!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi.k4 small,html:not(#nv) main#list.nvmy .mc-kpi.k4 span,html:not(#nv) main#list.nvmy .mc-kpi.k4 b{color:#fff!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi small{letter-spacing:.1em!important;font-size:10.5px!important;color:#7A5E50!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi b{font-weight:500!important;font-size:30px!important}",
    "html:not(#nv) main#list.nvmy .mc-kpi span{font-size:12px!important;color:#8A7062!important}",
    /* bloques y filas */
    "html:not(#nv) main#list.nvmy .mc-sec{background:#fff!important;border:0!important;border-radius:22px!important;padding:16px 16px 8px!important;box-shadow:0 1px 2px rgba(58,36,28,.04),0 8px 24px rgba(58,36,28,.05)!important;margin-bottom:14px!important}",
    "html:not(#nv) main#list.nvmy .mc-sec h3{font-family:Outfit,system-ui,sans-serif!important;font-weight:500!important;font-size:16px!important;color:#3B2418!important;display:flex;align-items:center;gap:8px;margin:0 2px 2px!important}",
    "html:not(#nv) main#list.nvmy .mc-c{background:#3B2418!important;color:#fff!important;border-radius:999px!important;font-size:11.5px!important;padding:2px 9px!important;font-weight:500}",
    "html:not(#nv) main#list.nvmy .mc-why{font-size:12.5px!important;color:#9A8274!important;margin:0 2px 8px!important;font-weight:300}",
    "html:not(#nv) main#list.nvmy .mc-row{display:grid!important;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:12px!important;padding:10px 6px!important;border:0!important;border-top:1px solid #F4EEE9!important;border-radius:0!important;background:transparent!important}",
    "html:not(#nv) main#list.nvmy .mc-row:hover{background:#FCF9F7!important}",
    "html:not(#nv) main#list.nvmy .mc-row>.mc-tag{display:none!important}",
    "html:not(#nv) main#list.nvmy .nvmy-av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-family:Outfit,system-ui,sans-serif;font-size:14px;font-weight:500;color:#3B2418;background:#F3EAE3;position:relative}",
    "html:not(#nv) main#list.nvmy .nvmy-av.late{background:#F8E0DB;color:#8E3F36}",
    "html:not(#nv) main#list.nvmy .nvmy-av.today{background:#FFF0D9;color:#8A5A1E}",
    "html:not(#nv) main#list.nvmy .mc-who{text-align:left;background:none!important;border:0!important;padding:0!important;min-width:0;cursor:pointer;font-family:Outfit,system-ui,sans-serif!important}",
    "html:not(#nv) main#list.nvmy .mc-who b{display:block;font-weight:500!important;font-size:15px!important;color:#3B2418!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "html:not(#nv) main#list.nvmy .mc-who small{display:flex!important;flex-wrap:wrap;gap:4px 8px;align-items:center;margin-top:3px;font-size:12px!important;color:#9A8274!important}",
    "html:not(#nv) main#list.nvmy .nvmy-paso{background:#F5EFEA;color:#5A3A2A;border-radius:999px;padding:2px 9px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
    "html:not(#nv) main#list.nvmy .nvmy-cuando{border-radius:999px;padding:2px 9px;font-size:11.5px;font-weight:500;white-space:nowrap}",
    "html:not(#nv) main#list.nvmy .nvmy-cuando.late{background:#F8E0DB;color:#A2564C}",
    "html:not(#nv) main#list.nvmy .nvmy-cuando.today{background:#FFF0D9;color:#8A5A1E}",
    "html:not(#nv) main#list.nvmy .mc-acts{display:flex!important;gap:6px!important;align-items:center;flex-wrap:nowrap}",
    "html:not(#nv) main#list.nvmy .mc-acts .btn{border-radius:999px!important;font-family:Outfit,system-ui,sans-serif!important;font-weight:400!important;font-size:13px!important;padding:8px 14px!important;min-height:0!important;box-shadow:none!important;border:0!important;text-transform:none!important;letter-spacing:0!important}",
    "html:not(#nv) main#list.nvmy .mc-acts .btn.primary{background:#F5EFEA!important;color:#3B2418!important}",
    "html:not(#nv) main#list.nvmy .mc-acts .btn.ghost{background:transparent!important;color:#7A5E50!important}",
    "html:not(#nv) .nvmy-wa{display:inline-flex;align-items:center;gap:6px;background:#3E6B47;color:#fff!important;border-radius:999px;padding:8px 14px;font-family:Outfit,system-ui,sans-serif;font-size:13px;text-decoration:none!important;white-space:nowrap;border:0;cursor:pointer}",
    "html:not(#nv) .nvmy-wa:hover{background:#335A3B}",
    "html:not(#nv) .nvmy-wa.off{background:#EFE8E2;color:#9A8274!important;cursor:default}",
    "html:not(#nv) .nvmy-wa svg{width:15px;height:15px}",
    "html:not(#nv) .nvmy-wa.mini{padding:5px 10px;font-size:12px}",
    /* embudo */
    "html:not(#nv) main#list.nvmy .mc-board{gap:12px!important}",
    "html:not(#nv) main#list.nvmy .mc-col{border:0!important;border-radius:22px!important;padding:12px!important;box-shadow:none!important}",
    "html:not(#nv) main#list.nvmy .mc-col:nth-child(1){background:#F3EEEA!important}",
    "html:not(#nv) main#list.nvmy .mc-col:nth-child(2){background:#FFF6E6!important}",
    "html:not(#nv) main#list.nvmy .mc-col:nth-child(3){background:#EAF2F7!important}",
    "html:not(#nv) main#list.nvmy .mc-col:nth-child(4){background:#E8F2E9!important}",
    "html:not(#nv) main#list.nvmy .mc-col:nth-child(5){background:#F7E9E6!important}",
    "html:not(#nv) main#list.nvmy .mc-card{background:#fff!important;border:0!important;border-radius:16px!important;box-shadow:0 1px 2px rgba(58,36,28,.05),0 4px 12px rgba(58,36,28,.04)!important;padding:12px!important}",
    "html:not(#nv) main#list.nvmy .mc-step{border-radius:12px!important;border:0!important}",
    "html:not(#nv) main#list.nvmy .nvmy-cardwa{margin-top:8px}",
    /* clientes */
    "html:not(#nv) main#list.nvmy .mc-tbl{background:#fff!important;border-radius:22px!important;box-shadow:0 1px 2px rgba(58,36,28,.04),0 8px 24px rgba(58,36,28,.05)!important;overflow:hidden;border:0!important}",
    "html:not(#nv) main#list.nvmy .mc-tr{border-color:#F4EEE9!important}",
    "html:not(#nv) main#list.nvmy .mc-tr:hover{background:#FCF9F7!important}",
    "html:not(#nv) main#list.nvmy .mc-abc{border-radius:7px!important;font-weight:500!important;border:0!important}",
    "html:not(#nv) main#list.nvmy .mc-filters input,html:not(#nv) main#list.nvmy .mc-filters select{border-radius:12px!important}",
    /* celu */
    "@media (max-width:760px){",
    "  html:not(#nv) main#list.nvmy .my-top .pz-sw{display:flex!important;overflow-x:auto;scrollbar-width:none;max-width:100%}",
    "  html:not(#nv) main#list.nvmy .my-top .pz-sw::-webkit-scrollbar{display:none}",
    "  html:not(#nv) main#list.nvmy .mc-kpis{display:grid!important;grid-template-columns:1fr 1fr!important}",
    "  html:not(#nv) main#list.nvmy .mc-kpi b{font-size:24px!important}",
    "  html:not(#nv) main#list.nvmy .mc-row{grid-template-columns:36px minmax(0,1fr)!important;grid-template-areas:'av who' 'acts acts';row-gap:8px!important}",
    "  html:not(#nv) main#list.nvmy .nvmy-av{grid-area:av;width:36px;height:36px;font-size:13px}",
    "  html:not(#nv) main#list.nvmy .mc-who{grid-area:who}",
    "  html:not(#nv) main#list.nvmy .mc-acts{grid-area:acts;justify-content:flex-start}",
    "  html:not(#nv) main#list.nvmy .mc-acts>*{flex:1;justify-content:center}",
    "  html:not(#nv) main#list.nvmy .mc-sec{padding:14px 12px 6px!important;border-radius:20px!important}",
    "}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "nvmy-css"; st.textContent = CSS; document.head.appendChild(st);

  var WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9 8.6c.2 2.9 2.6 5.5 5.6 6l1.2-1.3-1.7-1-1 .7a4.3 4.3 0 0 1-2.4-2.4l.7-1-1-1.7z"/></svg>';
  function norm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function cliente(nombre){ var L = (window.__nv && window.__nv.S && window.__nv.S.mayclientes) || [], n = norm(nombre); return L.find(function(c){ return norm(c.nombre) === n; }) || null; }
  function tel(c){
    var d = String((c && c.tel) || "").replace(/\D/g, ""); if (!d) return "";
    if (/^0/.test(d)) d = d.slice(1);
    if (/^54/.test(d)) { if (!/^549/.test(d)) d = "549" + d.slice(2); return d; }
    if (d.length === 10) return "549" + d;
    if (d.length >= 11) return d;
    return "";
  }
  function quien(c, nombre){
    var k = (c && (c.cont || "")).trim();
    if (!k){ var m = String(nombre || "").match(/\(([^)]+)\)/); k = m ? m[1] : ""; }
    return k ? k.split(/\s+/)[0] : "";
  }
  function mensaje(paso, c, nombre){
    var n = quien(c, nombre), hola = "Hola" + (n ? " " + n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : "") + "! Cómo estás? ";
    var p = norm(paso);
    if (/reposic/.test(p)) return hola + "Te escribo porque ya podés reponer sin mínimo 🤎 Te paso el catálogo actualizado? nervomayorista.com";
    if (/reactiv|descuento/.test(p)) return hola + "Hace un tiempito no hablamos 🤎 Tenemos novedades y un descuento especial para que vuelvas a reponer. Te paso el catálogo? nervomayorista.com";
    if (/catalogo/.test(p)) return hola + "Pudiste ver el catálogo? Cualquier duda o si querés armar el pedido, te ayudo 🤎";
    if (/post|ventas/.test(p)) return hola + "Cómo te fue con las ventas de lo último que llevaste? 🤎";
    if (/combo|arrancar/.test(p)) return hola + "Te armé un combo para arrancar con lo que más se vende 🤎 Te lo paso?";
    if (/novedad/.test(p)) return hola + "Te cuento que sumamos novedades al catálogo 🤎 nervomayorista.com";
    if (/cyber|preventa/.test(p)) return hola + "Se viene la preventa Cyber para mayoristas 🤎 Querés que te reserve stock?";
    return hola + "🤎";
  }
  function botonWa(c, nombre, paso, mini){
    var t = tel(c), a = document.createElement(t ? "a" : "span");
    a.className = "nvmy-wa" + (mini ? " mini" : "") + (t ? "" : " off");
    a.innerHTML = WA + "<span>" + (t ? "Escribir" : "Sin celu") + "</span>";
    if (t){ a.href = "https://wa.me/" + t + "?text=" + encodeURIComponent(mensaje(paso, c, nombre)); a.target = "_blank"; a.rel = "noopener"; a.title = "Abre WhatsApp con el mensaje listo"; }
    else a.title = "Cargá el celular en la ficha del cliente";
    return a;
  }
  function iniciales(n){ var p = String(n || "").replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean); return ((p[0] || "")[0] || "").toUpperCase() + ((p[1] || "")[0] || "").toUpperCase(); }

  function decorar(){
    var m = document.querySelector("main#list"); if (!m) return;
    var top = m.querySelector(".my-top");
    if (!top){ m.classList.remove("nvmy", "nvmy-hoy"); return; }
    m.classList.add("nvmy");
    var act = top.querySelector(".pz-sw button[aria-pressed=true], .pz-sw button.on, .pz-sw button.active, .pz-sw button.sel");
    m.classList.toggle("nvmy-hoy", !!act && /^hoy$/i.test(act.textContent.trim()));
    /* filas (Hoy, Reactivar) */
    m.querySelectorAll(".mc-row:not([data-nvmy])").forEach(function(r){
      r.setAttribute("data-nvmy", "1");
      var who = r.querySelector(".mc-who"), b = who && who.querySelector("b"), sm = who && who.querySelector("small"), tag = r.querySelector(".mc-tag");
      var nombre = b ? b.textContent.trim() : "", c = cliente(nombre);
      var av = document.createElement("span"); av.className = "nvmy-av" + (tag && tag.classList.contains("late") ? " late" : tag && tag.classList.contains("today") ? " today" : ""); av.textContent = iniciales(nombre) || "·";
      r.insertBefore(av, r.firstChild);
      var paso = "";
      if (sm){
        var partes = sm.textContent.split(" · "); paso = partes[0] || "";
        sm.innerHTML = "";
        if (tag && tag.textContent.trim()){ var cu = document.createElement("span"); cu.className = "nvmy-cuando " + (tag.classList.contains("late") ? "late" : "today"); cu.textContent = tag.textContent.trim(); sm.append(cu); }
        if (paso && !/\$/.test(paso)){ var ps = document.createElement("span"); ps.className = "nvmy-paso"; ps.textContent = paso; sm.append(ps); } else if (paso) partes.unshift("");
        var rest = partes.slice(1).filter(Boolean).join(" · "); if (rest){ var rs = document.createElement("span"); rs.textContent = rest; sm.append(rs); }
      }
      var acts = r.querySelector(".mc-acts"); if (acts) acts.insertBefore(botonWa(c, nombre, paso), acts.firstChild);
    });
    /* tarjetas del embudo */
    m.querySelectorAll(".mc-card:not([data-nvmy])").forEach(function(k){
      k.setAttribute("data-nvmy", "1");
      var nm = k.querySelector(".mc-cnm"), nc = nm ? nm.cloneNode(true) : null; if (nc) nc.querySelectorAll(".mc-abc").forEach(function(x){ x.remove(); }); var nombre = nc ? nc.textContent.trim() : "", c = cliente(nombre);
      var step = k.querySelector(".mc-step"), paso = step ? step.textContent : "";
      var w = document.createElement("div"); w.className = "nvmy-cardwa"; w.append(botonWa(c, nombre, paso, true)); k.append(w);
    });
  }
  setInterval(function(){ try { decorar(); } catch(e){} }, 700);
})();
