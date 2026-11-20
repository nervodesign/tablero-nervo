/* Mayoristas · Mails: plataforma de email marketing (campañas, editor con vista previa, destinatarios con bajas, historial) */
(function(){
  if (window.__nvMails) return; window.__nvMails = 1;
  var LOGO = "https://nervomayorista.com/logo_nervo.png";
  var WEB = "https://nervomayorista.com", WA = "https://wa.me/5493518622392", TIENDA = "https://www.nervodesign.com";
  var BAJA = "mailto:nervodesigncordoba@gmail.com?subject=No%20quiero%20recibir%20m%C3%A1s%20mails";
  var CAT = null, ROWS = null, MODO = false, SOY = "", VISTA = "camp", VER_ARCH = false;
  var GR = { todos: "Todos", act: "Activos", con: "En contacto", dor: "Para activar", mano: "Elegidos a mano" };
  var MES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

  /* ---------- estilos de la app ---------- */
  var C = "#nvml";
  var CSS = [
    "main#list.nvml-on > :not(.my-top):not(#nvml){display:none!important}",
    "main#list.nvml-on .my-top .pz-sw button:not(.nvml-tab){background:transparent!important;box-shadow:none!important;color:#7A5E50!important}",
    "html:not(#nv) .my-top .pz-sw button.nvml-tab.on{background:#fff!important;color:#3B2418!important;box-shadow:0 1px 3px rgba(58,36,28,.08)!important}",
    C + "{font-family:Outfit,system-ui,sans-serif;color:#3B2418;margin-top:18px}",
    C + " button{font:inherit;cursor:pointer}",
    C + " .q-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}",
    C + " .q-seg{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:#ECE6DF;box-shadow:inset 2px 2px 5px rgba(120,100,85,.14),inset -2px -2px 5px rgba(255,255,255,.8)}",
    C + " .q-seg button{border:0;background:transparent;padding:7px 16px;border-radius:999px;font-size:13.5px;color:#7A5E50}",
    C + " .q-seg button.q-on{background:#fff;color:#3B2418;font-weight:600;box-shadow:0 1px 3px rgba(58,36,28,.1)}",
    C + " .q-pri{border:0;background:#3B2418;color:#fff;border-radius:999px;padding:10px 18px;font-size:13.5px;font-weight:500;box-shadow:0 4px 12px rgba(58,36,28,.18)}",
    C + " .q-sec{border:1px solid #DCCFC2;background:#fff;color:#3B2418;border-radius:999px;padding:7px 14px;font-size:13px}",
    C + " .q-kp{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:18px}",
    C + " .q-kp div{background:#F3EEE8;border-radius:16px;padding:14px 16px;box-shadow:4px 4px 10px rgba(120,100,85,.10),-4px -4px 10px rgba(255,255,255,.75)}",
    C + " .q-kp b{display:block;font-size:24px;font-weight:500}" + C + " .q-kp small{font-size:12px;color:#8C7D71}",
    C + " .q-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px}",
    C + " .q-cc{background:#fff;border:1px solid #EDE5DC;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .2s,transform .2s}",
    C + " .q-cc:hover{box-shadow:0 10px 26px rgba(58,36,28,.10);transform:translateY(-2px)}",
    C + " .q-th{height:230px;overflow:hidden;background:#F6F1EB;position:relative;cursor:pointer;border-bottom:1px solid #EFE7DE}",
    C + " .q-th iframe{width:600px;height:900px;border:0;transform:scale(.47);transform-origin:top left;position:absolute;left:50%;margin-left:-141px;pointer-events:none;background:#F6F1EB}",
    C + " .q-cb{padding:13px 15px 15px;display:flex;flex-direction:column;gap:7px;flex:1}",
    C + " .q-cb h4{margin:0;font-size:15.5px;font-weight:600}",
    C + " .q-cb .q-as{font-size:13px;color:#6B5A4E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    C + " .q-chips{display:flex;flex-wrap:wrap;gap:5px}",
    C + " .q-chip{font-size:11.5px;padding:3px 9px;border-radius:999px;background:#F1EAE2;color:#6B5A4E}",
    C + " .q-chip.q-ok{background:#E3EEDF;color:#3E6B3A}" + C + " .q-chip.q-no{background:#F3E2DC;color:#9A4B36}" + C + " .q-chip.q-am{background:#F6ECD5;color:#8A6420}",
    C + " .q-acts{display:flex;gap:6px;margin-top:auto;padding-top:6px}",
    C + " .q-acts button{flex:1;border:0;background:#F3EEE8;border-radius:10px;padding:8px 6px;font-size:12.5px;color:#3B2418}",
    C + " .q-acts button:hover{background:#EAE1D7}",
    C + " .q-new{border:2px dashed #DCCFC2;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:330px;color:#8C7D71;background:transparent}",
    C + " .q-new b{font-size:30px;font-weight:300;color:#9C7B62}",
    C + " .q-note{font-size:13px;color:#8C7D71;margin:14px 2px}",
    C + " .q-box{background:#fff;border:1px solid #EDE5DC;border-radius:18px;overflow:hidden}",
    C + " .q-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:12px 14px;border-bottom:1px solid #F0E9E1}",
    C + " .q-tools input{flex:1;min-width:200px;border:0;outline:0;background:#F3EEE8;border-radius:11px;padding:9px 12px;font:inherit;font-size:14px;color:#3B2418}",
    C + " .q-tools .q-seg button{padding:5px 11px;font-size:12.5px}",
    C + " .q-fr{display:grid;grid-template-columns:1.4fr 1.6fr 110px 150px;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid #F5EFE8;font-size:13.5px}",
    C + " .q-fr:last-child{border-bottom:0}" + C + " .q-fr .q-ml{color:#6B5A4E;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    C + " .q-fr input{border:1px solid #E4D9CE;border-radius:9px;padding:6px 9px;font:inherit;font-size:13px;width:100%;box-sizing:border-box}",
    C + " .q-sw{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:#6B5A4E;cursor:pointer;user-select:none}",
    C + " .q-sw i{width:34px;height:20px;border-radius:999px;background:#D9CDC1;position:relative;transition:background .2s;flex:none}",
    C + " .q-sw i:after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 2px rgba(0,0,0,.2)}",
    C + " .q-sw.q-on i{background:#7C9A6E}" + C + " .q-sw.q-on i:after{left:16px}",
    C + " .q-hi{display:grid;grid-template-columns:110px 1fr auto;gap:12px;padding:11px 14px;border-bottom:1px solid #F5EFE8;font-size:13.5px;align-items:center}",
    "@media(max-width:760px){" + C + " .q-kp{grid-template-columns:repeat(2,minmax(0,1fr))}" + C + " .q-fr{grid-template-columns:1fr auto;}" + C + " .q-fr .q-ml{grid-column:1/-1;order:3}" + C + " .q-fr .q-gq{display:none}" + C + " .q-hi{grid-template-columns:1fr auto}" + C + " .q-hi .q-hf{grid-column:1/-1;font-size:12px;color:#8C7D71}}",
    /* editor */
    ".nvme{position:fixed;inset:0;z-index:9000;background:#F6F1EB;display:flex;flex-direction:column;font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    ".nvme button{font:inherit;cursor:pointer}",
    ".nvme .q-eh{display:flex;align-items:center;gap:10px;padding:12px 18px;background:#fff;border-bottom:1px solid #EDE5DC}",
    ".nvme .q-eh .q-nm{flex:1;min-width:0;border:0;outline:0;font:inherit;font-size:18px;font-weight:600;color:#3B2418;background:transparent}",
    ".nvme .q-eh .q-st{font-size:12px;color:#8C7D71;white-space:nowrap}",
    ".nvme .q-x{border:0;background:#F3EEE8;width:36px;height:36px;border-radius:50%;font-size:20px;line-height:1;color:#3B2418;flex:none}",
    ".nvme .q-pri{border:0;background:#3B2418;color:#fff;border-radius:999px;padding:9px 16px;font-size:13.5px;white-space:nowrap}",
    ".nvme .q-sec{border:1px solid #DCCFC2;background:#fff;color:#3B2418;border-radius:999px;padding:8px 14px;font-size:13px;white-space:nowrap}",
    ".nvme .q-pri[disabled],.nvme .q-sec[disabled]{opacity:.45;cursor:default}",
    ".nvme .q-eb{flex:1;display:grid;grid-template-columns:minmax(360px,460px) 1fr;min-height:0}",
    ".nvme .q-ef{overflow:auto;padding:16px 18px 80px;border-right:1px solid #EDE5DC}",
    ".nvme .q-ep{overflow:auto;display:flex;flex-direction:column;align-items:center;padding:14px 16px 40px;background:#EFE8E0}",
    ".nvme .q-pv-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}",
    ".nvme .q-seg{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:#E4DBD1}",
    ".nvme .q-seg button{border:0;background:transparent;padding:6px 14px;border-radius:999px;font-size:13px;color:#6B5A4E}",
    ".nvme .q-seg button.q-on{background:#fff;color:#3B2418;font-weight:600}",
    ".nvme .q-pv{border:0;background:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(58,36,28,.12);transition:width .25s;height:calc(100vh - 150px);min-height:500px}",
    ".nvme .q-pv.q-celu{width:390px;border-radius:30px;border:10px solid #2E2520}",
    ".nvme .q-pv.q-compu{width:min(720px,100%)}",
    ".nvme .q-sc{background:#fff;border:1px solid #EDE5DC;border-radius:16px;padding:14px;margin-bottom:12px}",
    ".nvme .q-sc h5{margin:0 0 10px;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#9C7B62;font-weight:600;display:flex;justify-content:space-between;align-items:center}",
    ".nvme label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8C7D71;margin-bottom:9px}",
    ".nvme input[type=text],.nvme input[type=url],.nvme input[type=number],.nvme textarea,.nvme select{border:1px solid #E4D9CE;border-radius:10px;padding:8px 10px;font:inherit;font-size:14px;color:#3B2418;background:#FCFAF8;outline:0;width:100%;box-sizing:border-box}",
    ".nvme input:focus,.nvme textarea:focus{border-color:#B99A82;background:#fff}",
    ".nvme textarea{min-height:90px;resize:vertical}",
    ".nvme .q-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".nvme .q-hint{font-size:11.5px;color:#A08F82;margin:-4px 0 8px}",
    ".nvme .q-pc{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}",
    ".nvme .q-pc button{border:1px solid #E4D9CE;background:#fff;border-radius:999px;padding:6px 12px;font-size:13px;color:#6B5A4E}",
    ".nvme .q-pc button.q-on{background:#3B2418;border-color:#3B2418;color:#fff}",
    ".nvme .q-pc button small{opacity:.7;margin-left:4px}",
    ".nvme .q-drop{border:2px dashed #DCCFC2;border-radius:14px;padding:14px;text-align:center;color:#8C7D71;font-size:13px;cursor:pointer;background:#FCFAF8;position:relative;overflow:hidden}",
    ".nvme .q-drop.q-over{border-color:#9C7B62;background:#F6EEE6}",
    ".nvme .q-drop img{display:block;width:100%;border-radius:9px;margin-bottom:8px}",
    ".nvme .q-pl{display:flex;flex-direction:column;gap:8px}",
    ".nvme .q-pi{display:grid;grid-template-columns:52px 1fr auto;gap:8px;align-items:center;background:#FCFAF8;border:1px solid #EFE7DE;border-radius:12px;padding:6px}",
    ".nvme .q-pi img{width:52px;height:52px;object-fit:cover;border-radius:8px;background:#EEE}",
    ".nvme .q-pi input{padding:5px 8px;font-size:12.5px;margin-top:3px}",
    ".nvme .q-pi b{font-size:13px;font-weight:500}",
    ".nvme .q-rm{border:0;background:transparent;color:#B07A68;font-size:18px;padding:4px 8px}",
    ".nvme .q-lst{max-height:260px;overflow:auto;border:1px solid #EFE7DE;border-radius:12px}",
    ".nvme .q-lst label{flex-direction:row;align-items:center;gap:8px;padding:7px 10px;margin:0;border-bottom:1px solid #F5EFE8;color:#3B2418;font-size:13px}",
    ".nvme .q-mtabs{display:none}",
    ".nvmp{position:fixed;inset:0;z-index:9100;background:rgba(40,28,20,.45);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Outfit,system-ui,sans-serif}",
    ".nvmp .q-in{background:#F6F1EB;border-radius:20px;width:min(860px,100%);max-height:88vh;display:flex;flex-direction:column;overflow:hidden}",
    ".nvmp .q-ih{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#fff;border-bottom:1px solid #EDE5DC}",
    ".nvmp .q-ih input{flex:1;border:0;outline:0;background:#F3EEE8;border-radius:11px;padding:9px 12px;font:inherit;font-size:14px}",
    ".nvmp .q-ig{overflow:auto;padding:14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}",
    ".nvmp .q-ig button{border:2px solid transparent;background:#fff;border-radius:14px;padding:6px;text-align:left;font:inherit;font-size:12.5px;color:#3B2418;cursor:pointer}",
    ".nvmp .q-ig button.q-on{border-color:#3B2418}",
    ".nvmp .q-ig img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;display:block;margin-bottom:5px;background:#EEE}",
    ".nvmp .q-tp{padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;overflow:auto}",
    ".nvmp .q-tp button{border:1px solid #E4D9CE;background:#fff;border-radius:16px;padding:16px;text-align:left;font:inherit;cursor:pointer;color:#3B2418}",
    ".nvmp .q-tp button:hover{border-color:#9C7B62;box-shadow:0 6px 18px rgba(58,36,28,.1)}",
    ".nvmp .q-tp b{display:block;font-size:15px;margin:6px 0 4px}.nvmp .q-tp span{font-size:24px}.nvmp .q-tp small{font-size:12.5px;color:#8C7D71}",
    ".nvmp .q-x{border:0;background:#F3EEE8;width:34px;height:34px;border-radius:50%;font-size:19px;cursor:pointer}",
    "@media(max-width:900px){",
    "  .nvme .q-eb{grid-template-columns:1fr}",
    "  .nvme .q-ef,.nvme .q-ep{border:0}",
    "  .nvme.m-ed .q-ep{display:none}.nvme.m-pv .q-ef{display:none}",
    "  .nvme .q-mtabs{display:flex;justify-content:center;padding:8px;background:#fff;border-bottom:1px solid #EDE5DC}",
    "  .nvme .q-eh .q-st{display:none}",
    "  .nvme .q-eh{padding:10px 12px;gap:6px;flex-wrap:wrap}",
    "  .nvme .q-eh .q-nm{font-size:16px;flex-basis:calc(100% - 50px)}",
    "  .nvme .q-pv{height:calc(100vh - 220px)}",
    "  .nvme .q-pv.q-celu{width:100%;max-width:390px}",
    "}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "nvml-css"; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- ayudas ---------- */
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function N(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function J(s){ if (Array.isArray(s)) return s; try { var v = JSON.parse(s || "[]"); return Array.isArray(v) ? v : []; } catch(e){ return []; } }
  function SB(){ return window.__sb; }
  function S(){ return (window.__nv && window.__nv.S) || {}; }
  function hoy(){ return new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }
  function fc(s){ if (!s) return "—"; var p = String(s).slice(0, 10).split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0].slice(2) : s; }
  function toast(t){ var d = h("div", null, t); d.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#3B2418;color:#fff;padding:11px 18px;border-radius:999px;font:400 14px Outfit,system-ui,sans-serif;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.2)"; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 2800); }
  function btn(c, t, f){ var b = h("button", c, t); b.type = "button"; if (f) b.onclick = f; return b; }

  /* ---------- catálogo (fotos de nervomayorista.com) ---------- */
  function catalogo(){
    if (CAT) return Promise.resolve(CAT);
    return fetch(WEB + "/?n=" + Date.now()).then(function(r){ return r.text(); }).then(function(t){
      var fotos = {}, re = /'([a-z0-9-]+)':\s*\{([^}]*)\}/g, m;
      while ((m = re.exec(t))){ var f = /:'([^']+)'/.exec(m[2]); if (f && /^[a-z]+_/.test(f[1])) fotos[m[1]] = f[1]; }
      var out = [], seen = {}, re2 = /\{\s*id:'([^']+)',\s*nombre:'([^']+)'/g;
      while ((m = re2.exec(t))){ if (seen[m[1]]) continue; seen[m[1]] = 1; if (fotos[m[1]]) out.push({ id: m[1], nombre: m[2], foto: WEB + "/" + fotos[m[1]] + ".webp" }); }
      CAT = out; return out;
    }).catch(function(){ CAT = []; return CAT; });
  }

  /* ---------- clientes y grupos (los mismos de la solapa Clientes) ---------- */
  function fechaN(s){ var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? Date.UTC(+m[1], m[2] - 1, +m[3]) : 0; }
  function grupoDe(c){
    try { if (window.__nvCliInfo) return window.__nvCliInfo(c).grupo; } catch(e){}
    var V = ((S().bzData || {}).may) || [], k = N(c.nombre), u = 0;
    V.forEach(function(v){ if (N(v.cliente) === k){ var f = fechaN(v.fecha); if (f > u) u = f; } });
    return u && (Date.now() - u) / 864e5 <= 90 ? "act" : (c.paso ? "con" : "dor");
  }
  function conMail(c){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(c.email || "").trim()); }
  function todos(){ return (S().mayclientes || []).filter(function(c){ return c && c.id && !c.borrado; }); }
  function suscriptos(){ return todos().filter(function(c){ return conMail(c) && !c.mailbaja; }); }
  function destinatarios(d){
    var L = suscriptos();
    if (d.para === "mano"){ var E = d.elegidos || []; return L.filter(function(c){ return E.indexOf(c.id) >= 0; }); }
    if (!d.para || d.para === "todos") return L;
    return L.filter(function(c){ return grupoDe(c) === d.para; });
  }
  function primerNombre(c){ var k = String((c && c.cont) || "").trim(); if (!k){ var m = String((c && c.nombre) || "").match(/\(([^)]+)\)/); k = m ? m[1] : ""; } k = k.split(/\s+/)[0] || ""; return k ? k.charAt(0).toUpperCase() + k.slice(1).toLowerCase() : ""; }
  function guardarCli(c, campos){
    campos.id = c.id; campos.cambiado = String(Date.now()); campos.por = SOY || c.por;
    Object.keys(campos).forEach(function(k){ c[k] = campos[k]; });
    if (window.__nvLocal && window.__nvLocal.guardar) return window.__nvLocal.guardar(["mayclientes", campos]).catch(function(e){ toast("No se pudo guardar: " + (e && e.message || e)); });
  }
  function logCli(c, texto){ var L = J(c.log); L.unshift([hoy(), texto, "mail", SOY]); return guardarCli(c, { log: JSON.stringify(L.slice(0, 200)) }); }

  /* ---------- plantillas para empezar ---------- */
  var PLANT = {
    novedades: { ic: "✨", nombre: "Novedades", desc: "Cargan la foto del banner nuevo y listo", d: { tipo: "novedades", para: "todos", dia: 10, asunto: "Sumamos novedades al catálogo 🤎", preheader: "Lo nuevo de este mes en Nervo", etiqueta: "Nuevos ingresos", titulo: "Sumamos novedades 🤎", texto: "Hola {nombre}! Les contamos lo nuevo que sumamos al catálogo este mes. Ya pueden verlo y sumarlo a su próximo pedido.", boton1: "Ver novedades", link1: WEB, boton2: "Escribinos por WhatsApp", link2: WA } },
    catalogo: { ic: "📒", nombre: "Catálogo del mes", desc: "Principio de mes, con productos destacados", d: { tipo: "catalogo", para: "todos", dia: 1, asunto: "Catálogo de {mes} · Nervo Design", preheader: "Ya está el catálogo actualizado", etiqueta: "Catálogo de {mes}", titulo: "Ya está el catálogo de {mes}", texto: "Hola {nombre}! Les dejamos el catálogo actualizado con todo lo que tenemos para este mes.", boton1: "Ver catálogo", link1: WEB, boton2: "Hacer un pedido por WhatsApp", link2: WA, recordar: "Reposición sin mínimo\nEl envío lo coordinan ustedes con su transporte\nRetiro en Córdoba: martes y jueves de 9:30 a 14 h" } },
    reposicion: { ic: "🔁", nombre: "Reposición", desc: "Para los que compraron hace un tiempo", d: { tipo: "reposicion", para: "act", dia: 25, asunto: "Cómo vienen con el stock, {nombre}?", preheader: "La reposición no tiene mínimo", etiqueta: "Reposición", titulo: "Hora de reponer?", texto: "Hola {nombre}! Si ya se les están terminando los productos, les recordamos que la reposición no tiene mínimo. Les armamos el pedido?", boton1: "Armar mi pedido", link1: WA, boton2: "Ver catálogo", link2: WEB } },
    reactivar: { ic: "🤎", nombre: "Reactivar", desc: "Para los que hace meses que no compran", d: { tipo: "reactivar", para: "dor", dia: "", asunto: "Hace rato que no nos vemos, {nombre} 🤎", preheader: "Les dejamos lo nuevo y una propuesta", etiqueta: "Los extrañamos", titulo: "Volvamos a trabajar juntos", texto: "Hola {nombre}! Hace un tiempo que no nos hacen un pedido y queríamos contarles todo lo nuevo que sumamos. Si quieren, les armamos una propuesta para volver a tener Nervo en su local.", boton1: "Ver lo nuevo", link1: WEB, boton2: "Hablemos por WhatsApp", link2: WA } },
    blanco: { ic: "📝", nombre: "En blanco", desc: "Arrancar de cero", d: { tipo: "otro", para: "todos", dia: "", asunto: "", preheader: "", etiqueta: "", titulo: "", texto: "Hola {nombre}!", boton1: "Ver catálogo", link1: WEB, boton2: "", link2: "" } }
  };
  var TIPO = { novedades: "Novedades", catalogo: "Catálogo", reposicion: "Reposición", reactivar: "Reactivar", otro: "Otro" };
  function tipoDe(row){ var d = row.datos || {}; if (d.tipo) return d.tipo; var id = String(row.id); return /catalogo/.test(id) ? "catalogo" : /novedad/.test(id) ? "novedades" : /repos/.test(id) ? "reposicion" : "otro"; }

  /* ---------- el mail (HTML que se ve bien en Gmail, Outlook y celu) ---------- */
  function reemplazar(s, c){ var hoyD = new Date(); return String(s || "").replace(/\{nombre\}/g, primerNombre(c) || "").replace(/\{mes\}/g, MES[hoyD.getMonth()]).replace(/\s+([,!?.])/g, "$1").replace(/,([!?.])/g, "$1").replace(/^,\s*/, ""); }
  function banner(d){ if (d.banner) return d.banner; var B = (d.banners || []).filter(Boolean); if (!B.length) return ""; var f = new Date(); return B[(f.getFullYear() * 12 + f.getMonth()) % B.length]; }
  function mailHTML(d, c){
    var F = "font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;";
    var T = function(s){ return esc(reemplazar(s, c)); };
    var b = banner(d), o = [];
    o.push('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>' + T(d.asunto) + '</title>');
    o.push('<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">');
    o.push('<style>body{margin:0;padding:0;background:#F6F1EB}a{text-decoration:none}img{border:0;display:block}@media(max-width:620px){.w{width:100%!important}.px{padding-left:22px!important;padding-right:22px!important}.col{display:block!important;width:100%!important;padding:0 0 14px!important}.h1{font-size:26px!important}.bt{display:block!important}}</style></head>');
    o.push('<body style="margin:0;padding:0;background:#F6F1EB">');
    if (d.preheader) o.push('<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F6F1EB">' + T(d.preheader) + '&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>');
    o.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1EB"><tr><td align="center" style="padding:24px 12px">');
    o.push('<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px">');
    // logo
    o.push('<tr><td align="center" style="padding:6px 0 20px"><a href="' + esc(WEB) + '"><img src="' + LOGO + '" width="120" alt="Nervo Design" style="width:120px;height:auto;margin:0 auto"></a></td></tr>');
    o.push('<tr><td style="background:#FFFFFF;border-radius:22px;overflow:hidden">');
    o.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0">');
    if (b) o.push('<tr><td><a href="' + esc(d.bannerLink || d.link1 || WEB) + '"><img src="' + esc(b) + '" width="600" alt="' + T(d.titulo || "Nervo Design") + '" style="width:100%;max-width:600px;height:auto;border-radius:22px 22px 0 0"></a></td></tr>');
    o.push('<tr><td class="px" style="padding:34px 44px 8px;' + F + '">');
    if (d.etiqueta) o.push('<p style="margin:0 0 10px;' + F + 'font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9C7B62;font-weight:500">' + T(d.etiqueta) + '</p>');
    if (d.titulo) o.push('<h1 class="h1" style="margin:0 0 16px;' + F + 'font-size:30px;line-height:1.2;font-weight:500;color:#3B2418">' + T(d.titulo) + '</h1>');
    String(d.texto || "").split(/\n{2,}/).forEach(function(p){ if (p.trim()) o.push('<p style="margin:0 0 14px;' + F + 'font-size:16px;line-height:1.65;color:#5A4638;font-weight:300">' + T(p).replace(/\n/g, "<br>") + '</p>'); });
    o.push('</td></tr>');
    if (d.boton1) o.push('<tr><td class="px" align="left" style="padding:10px 44px 30px"><a class="bt" href="' + esc(d.link1 || WEB) + '" style="display:inline-block;background:#3B2418;color:#FFFFFF;' + F + 'font-size:15px;font-weight:500;padding:15px 30px;border-radius:999px;text-align:center">' + T(d.boton1) + ' &rarr;</a></td></tr>');
    // productos
    var P = (d.productos || []).filter(function(p){ return p && p.foto; });
    if (P.length){
      o.push('<tr><td class="px" style="padding:6px 32px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">');
      for (var i = 0; i < P.length; i += 2){
        o.push('<tr>');
        [P[i], P[i + 1]].forEach(function(p){
          if (!p){ o.push('<td class="col" width="50%" style="width:50%;padding:0 6px 16px"></td>'); return; }
          var l = esc(p.link || d.link1 || WEB);
          o.push('<td class="col" width="50%" valign="top" style="width:50%;padding:0 6px 16px"><a href="' + l + '"><img src="' + esc(p.foto) + '" width="256" alt="' + esc(p.nombre) + '" style="width:100%;height:auto;border-radius:16px;background:#F6F1EB"></a>' +
            '<p style="margin:10px 2px 2px;' + F + 'font-size:15px;color:#3B2418;font-weight:500">' + esc(p.nombre) + '</p>' +
            (p.precio ? '<p style="margin:0 2px 4px;' + F + 'font-size:14px;color:#9C7B62">' + esc(p.precio) + '</p>' : '') +
            '<a href="' + l + '" style="' + F + 'font-size:13.5px;color:#9C7B62;font-weight:500">Ver producto &rarr;</a></td>');
        });
        o.push('</tr>');
      }
      o.push('</table></td></tr>');
    }
    // datos útiles
    var R = String(d.recordar || "").split(/\n/).map(function(x){ return x.trim(); }).filter(Boolean);
    if (R.length){
      o.push('<tr><td class="px" style="padding:4px 44px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1EB;border-radius:16px"><tr><td style="padding:18px 22px;' + F + '">');
      R.forEach(function(x){ o.push('<p style="margin:4px 0;' + F + 'font-size:14px;line-height:1.5;color:#5A4638">🤎&nbsp; ' + T(x) + '</p>'); });
      o.push('</td></tr></table></td></tr>');
    }
    if (d.boton2) o.push('<tr><td class="px" align="center" style="padding:0 44px 34px"><a class="bt" href="' + esc(d.link2 || WA) + '" style="display:inline-block;border:1.5px solid #3B2418;color:#3B2418;' + F + 'font-size:14.5px;font-weight:500;padding:12px 26px;border-radius:999px;text-align:center">' + T(d.boton2) + '</a></td></tr>');
    o.push('</table></td></tr>');
    // pie
    o.push('<tr><td align="center" style="padding:26px 20px 8px;' + F + 'font-size:13px;line-height:1.7;color:#8C7D71">');
    o.push('<a href="' + WEB + '" style="color:#3B2418;font-weight:500">Catálogo mayorista</a> &nbsp;·&nbsp; <a href="' + WA + '" style="color:#3B2418;font-weight:500">WhatsApp</a> &nbsp;·&nbsp; <a href="' + TIENDA + '" style="color:#3B2418;font-weight:500">Tienda online</a><br>');
    o.push('Nervo Design · Tu casa, tu refugio · Córdoba, Argentina</td></tr>');
    o.push('<tr><td align="center" style="padding:6px 20px 30px;' + F + 'font-size:12px;color:#A99A8E">Te llega este mail porque sos cliente mayorista de Nervo. <a href="' + esc(d.bajaLink || BAJA) + '" style="color:#A99A8E;text-decoration:underline">No quiero recibir más mails</a></td></tr>');
    o.push('</table></td></tr></table></body></html>');
    return o.join("");
  }
  function mailTexto(d, c){ return [reemplazar(d.titulo, c), reemplazar(d.texto, c), (d.boton1 ? reemplazar(d.boton1, c) + ": " + (d.link1 || WEB) : ""), "No querés recibir más mails? Respondé este mail y te damos de baja."].filter(Boolean).join("\n\n"); }
  function ejemplo(d){ var L = destinatarios(d); return L[0] || { nombre: "Ejemplo (Lucía)", cont: "Lucía" }; }

  /* ---------- datos ---------- */
  function cargar(){
    return SB().from("mail_campanas").select("*").order("orden").then(function(r){ if (r.error){ toast("No se pudieron leer los mails"); ROWS = []; return; } ROWS = r.data || []; var M = { activos: "act", enfriando: "dor", dormidos: "dor", nuevos: "con" }; ROWS.forEach(function(x){ x.datos = x.datos || {}; if (M[x.datos.para]) x.datos.para = M[x.datos.para]; }); });
  }
  function guardar(row){
    row.cambiado = new Date().toISOString();
    return SB().from("mail_campanas").upsert({ id: row.id, orden: row.orden || 0, datos: row.datos, cambiado: row.cambiado, por: SOY }).then(function(r){ if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; } });
  }
  function historialTodo(){
    var H = []; (ROWS || []).forEach(function(r){ (r.datos.historial || []).forEach(function(x){ H.push({ f: x.f, n: x.n, prueba: x.prueba, por: x.por, para: x.para, camp: r.datos.nombre || r.id }); }); });
    return H.sort(function(a, b){ return a.f < b.f ? 1 : -1; });
  }

  /* ---------- pantalla principal ---------- */
  function pintar(){
    var box = document.getElementById("nvml"); if (!box) return;
    box.innerHTML = "";
    if (!ROWS){ box.append(h("p", "q-note", "Cargando…")); return; }
    var bar = h("div", "q-bar"), seg = h("div", "q-seg");
    [["camp", "Campañas"], ["dest", "Destinatarios"], ["hist", "Historial"]].forEach(function(x){ seg.append(btn(VISTA === x[0] ? "q-on" : "", x[1], function(){ VISTA = x[0]; pintar(); })); });
    bar.append(seg, btn("q-pri", "+ Nueva campaña", elegirPlantilla));
    box.append(bar);
    var T = todos(), sus = suscriptos().length, bajas = T.filter(function(c){ return conMail(c) && c.mailbaja; }).length, sin = T.filter(function(c){ return !conMail(c); }).length;
    var act = ROWS.filter(function(r){ return r.datos.activo && !r.datos.archivado; }).length;
    var kp = h("div", "q-kp");
    [[sus, "reciben mails"], [bajas, "se dieron de baja"], [sin, "sin mail cargado"], [act, "campañas programadas"]].forEach(function(x){ var d = h("div"); d.append(h("b", null, String(x[0])), h("small", null, x[1])); kp.append(d); });
    box.append(kp);
    if (VISTA === "camp") pintarCamp(box); else if (VISTA === "dest") pintarDest(box); else pintarHist(box);
  }
  function pintarCamp(box){
    var g = h("div", "q-grid");
    var L = ROWS.filter(function(r){ return VER_ARCH ? r.datos.archivado : !r.datos.archivado; });
    L.forEach(function(r){
      var d = r.datos, cc = h("div", "q-cc"), th = h("div", "q-th"), fr = h("iframe");
      fr.setAttribute("loading", "lazy"); fr.setAttribute("tabindex", "-1"); fr.srcdoc = mailHTML(d, ejemplo(d)); th.append(fr); th.onclick = function(){ editar(r); };
      var cb = h("div", "q-cb"), chips = h("div", "q-chips");
      chips.append(h("span", "q-chip", TIPO[tipoDe(r)] || "Otro"));
      if (d.archivado) chips.append(h("span", "q-chip", "Archivada"));
      else if (d.activo && d.dia) chips.append(h("span", "q-chip q-ok", "Programada · día " + d.dia));
      else chips.append(h("span", "q-chip q-am", "Borrador"));
      chips.append(h("span", "q-chip", (GR[d.para] || "Todos") + " · " + destinatarios(d).length));
      var ult = (d.historial || []).filter(function(x){ return !x.prueba; })[0];
      cb.append(h("h4", null, d.nombre || "Sin nombre"), h("div", "q-as", reemplazar(d.asunto, ejemplo(d)) || "Sin asunto"), chips,
        h("div", "q-as", ult ? "Último envío: " + fc(ult.f) + " a " + ult.n : "Todavía no se mandó"));
      var a = h("div", "q-acts");
      a.append(btn("", "Editar", function(){ editar(r); }), btn("", "Duplicar", function(){ duplicar(r); }),
        btn("", d.archivado ? "Recuperar" : "Archivar", function(){ d.archivado = !d.archivado; if (d.archivado) d.activo = false; guardar(r).then(pintar); }));
      cb.append(a); cc.append(th, cb); g.append(cc);
    });
    if (!VER_ARCH){ var nw = btn("q-new", null, elegirPlantilla); nw.append(h("b", null, "+"), h("span", null, "Nueva campaña")); g.append(nw); }
    box.append(g);
    var arch = ROWS.filter(function(r){ return r.datos.archivado; }).length;
    if (arch || VER_ARCH){ var p = h("p", "q-note"); p.append(btn("q-sec", VER_ARCH ? "← Volver a las campañas" : "Ver archivadas (" + arch + ")", function(){ VER_ARCH = !VER_ARCH; pintar(); })); box.append(p); }
    box.append(h("p", "q-note", "Las campañas programadas se van a mandar solas el día elegido cuando conectemos el envío. Mientras tanto podés armarlas y mandarte pruebas a tu mail."));
  }
  var FIL = "todos", BUS = "";
  function pintarDest(box){
    var b = h("div", "q-box"), tl = h("div", "q-tools"), inp = h("input"); inp.placeholder = "Buscar por nombre o mail…"; inp.value = BUS;
    var sg = h("div", "q-seg");
    [["todos", "Todos"], ["act", "Activos"], ["con", "En contacto"], ["dor", "Para activar"], ["baja", "Bajas"], ["sin", "Sin mail"]].forEach(function(x){ sg.append(btn(FIL === x[0] ? "q-on" : "", x[1], function(){ FIL = x[0]; pintar(); })); });
    tl.append(inp, sg); b.append(tl);
    var lista = h("div"); b.append(lista); box.append(b);
    function fila(c){
      var r = h("div", "q-fr"), g = grupoDe(c);
      r.append(h("b", null, c.nombre || "Sin nombre"));
      if (conMail(c)) r.append(h("span", "q-ml", c.email));
      else { var m = h("input"); m.type = "email"; m.placeholder = "Cargar mail…"; m.onchange = function(){ var v = m.value.trim(); if (!v) return; if (!conMail({ email: v })){ toast("Ese mail no parece válido"); return; } guardarCli(c, { email: v }); toast("Mail guardado"); pintar(); }; var w = h("span", "q-ml"); w.append(m); r.append(w); }
      r.append(h("span", "q-chip q-gq " + (g === "act" ? "q-ok" : g === "con" ? "q-am" : ""), GR[g]));
      if (conMail(c)){
        var s = h("span", "q-sw" + (c.mailbaja ? "" : " q-on")); s.append(h("i"), h("span", null, c.mailbaja ? "Dado de baja" : "Recibe mails"));
        s.onclick = function(){
          var baja = !c.mailbaja;
          if (baja && !confirm(c.nombre + " no va a recibir más mails de campañas. ¿Seguimos?")) return;
          guardarCli(c, { mailbaja: baja ? hoy() : "" }); logCli(c, baja ? "Se dio de baja de los mails" : "Volvió a recibir mails"); pintar();
        };
        r.append(s);
      } else r.append(h("span", "q-chip q-no", "Falta el mail"));
      return r;
    }
    function lleno(){
      lista.innerHTML = "";
      var q = N(BUS), L = todos().filter(function(c){
        if (q && N(c.nombre + " " + (c.email || "")).indexOf(q) < 0) return false;
        if (FIL === "sin") return !conMail(c);
        if (FIL === "baja") return conMail(c) && c.mailbaja;
        if (FIL === "todos") return true;
        return grupoDe(c) === FIL;
      }).sort(function(a, b){ return conMail(b) - conMail(a) || String(a.nombre).localeCompare(String(b.nombre)); });
      if (!L.length) lista.append(h("p", "q-note", "No hay clientes con ese filtro.")); else L.forEach(function(c){ lista.append(fila(c)); });
    }
    inp.oninput = function(){ BUS = inp.value; lleno(); };
    lleno();
    box.append(h("p", "q-note", "Si alguien pide no recibir más mails, apagalo acá y no le llega nada más. Cada mail que se manda queda anotado en la ficha del cliente."));
  }
  function pintarHist(box){
    var b = h("div", "q-box"), H = historialTodo();
    if (!H.length) b.append(h("p", "q-note", "Todavía no se mandó ningún mail. Las pruebas y los envíos van a aparecer acá."));
    H.forEach(function(x){ var r = h("div", "q-hi"); r.append(h("b", null, x.camp), h("span", "q-chip " + (x.prueba ? "" : "q-ok"), x.prueba ? "Prueba" : "Enviado a " + x.n), h("span", "q-hf", fc(x.f) + (x.para ? " · " + x.para : "") + (x.por ? " · " + String(x.por).split("@")[0] : ""))); b.append(r); });
    box.append(b);
  }

  /* ---------- nueva / duplicar ---------- */
  function popup(titulo){
    var p = h("div", "nvmp"), i = h("div", "q-in"), hd = h("div", "q-ih");
    hd.append(h("b", null, titulo)); hd.style.justifyContent = "space-between";
    var x = btn("q-x", "×", function(){ p.remove(); }); hd.append(x);
    i.append(hd); p.append(i); p.onclick = function(e){ if (e.target === p) p.remove(); };
    document.body.append(p); return { p: p, i: i, hd: hd };
  }
  function elegirPlantilla(){
    var P = popup("¿Qué mail querés armar?"), g = h("div", "q-tp");
    Object.keys(PLANT).forEach(function(k){ var t = PLANT[k], b = btn("", null, function(){ P.p.remove(); crear(k); }); b.append(h("span", null, t.ic), h("b", null, t.nombre), h("small", null, t.desc)); g.append(b); });
    P.i.append(g);
  }
  function crear(k){
    var t = PLANT[k], d = JSON.parse(JSON.stringify(t.d)); d.nombre = t.nombre; d.activo = false; d.productos = []; d.banner = ""; d.historial = [];
    var row = { id: "mc_" + Date.now().toString(36), orden: (ROWS.length + 1) * 10, datos: d };
    ROWS.push(row); guardar(row).then(function(){ pintar(); editar(row); });
  }
  function duplicar(r){
    var d = JSON.parse(JSON.stringify(r.datos)); d.nombre = (d.nombre || "Campaña") + " (copia)"; d.activo = false; d.archivado = false; d.historial = [];
    var row = { id: "mc_" + Date.now().toString(36), orden: (ROWS.length + 1) * 10, datos: d };
    ROWS.push(row); guardar(row).then(pintar);
  }

  /* ---------- subir fotos (se achican antes de subir) ---------- */
  function subirFoto(file){
    return new Promise(function(ok, mal){
      if (!/^image\//.test(file.type)) return mal(new Error("Tiene que ser una imagen"));
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function(){
        var W = Math.min(1200, img.naturalWidth), H = Math.round(img.naturalHeight * W / img.naturalWidth);
        var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, W, H); cx.drawImage(img, 0, 0, W, H);
        URL.revokeObjectURL(url);
        cv.toBlob(function(bl){
          var path = hoy().slice(0, 7) + "/" + Date.now().toString(36) + "-" + N(file.name.replace(/\.[^.]+$/, "")).replace(/[^a-z0-9]+/g, "-").slice(0, 40) + ".jpg";
          SB().storage.from("mails").upload(path, bl, { contentType: "image/jpeg", upsert: false }).then(function(r){
            if (r.error) return mal(r.error);
            ok(SB().storage.from("mails").getPublicUrl(path).data.publicUrl);
          }, mal);
        }, "image/jpeg", 0.86);
      };
      img.onerror = function(){ mal(new Error("No pude leer la imagen")); };
      img.src = url;
    });
  }

  /* ---------- editor ---------- */
  function editar(row){
    var d = row.datos; d.productos = d.productos || []; d.historial = d.historial || [];
    var E = h("div", "nvme m-ed"), eh = h("div", "q-eh");
    var nm = h("input", "q-nm"); nm.value = d.nombre || ""; nm.placeholder = "Nombre de la campaña";
    var est = h("span", "q-st", "Todo guardado");
    var pru = btn("q-sec", "✉ Mandarme una prueba"), env = btn("q-pri", "Enviar ahora"); env.disabled = true; env.title = "Se activa cuando conectemos el envío";
    var cerrar = btn("q-x", "×", function(){ guardarYa(); E.remove(); document.body.style.overflow = ""; pintar(); });
    eh.append(nm, est, pru, env, cerrar);
    var mt = h("div", "q-mtabs"), ms = h("div", "q-seg");
    var bE = btn("q-on", "Editar", function(){ E.className = "nvme m-ed"; bE.className = "q-on"; bV.className = ""; }), bV = btn("", "Ver cómo queda", function(){ E.className = "nvme m-pv"; bV.className = "q-on"; bE.className = ""; refrescar(true); });
    ms.append(bE, bV); mt.append(ms);
    var eb = h("div", "q-eb"), ef = h("div", "q-ef"), ep = h("div", "q-ep");
    eb.append(ef, ep); E.append(eh, mt, eb); document.body.append(E); document.body.style.overflow = "hidden";

    // vista previa
    var pvt = h("div", "q-pv-top"), ps = h("div", "q-seg"), MODOPV = "q-compu", pv = h("iframe", "q-pv q-compu");
    var bC = btn("q-on", "💻 Compu", function(){ MODOPV = "q-compu"; pv.className = "q-pv q-compu"; bC.className = "q-on"; bM.className = ""; }), bM = btn("", "📱 Celu", function(){ MODOPV = "q-celu"; pv.className = "q-pv q-celu"; bM.className = "q-on"; bC.className = ""; });
    ps.append(bC, bM); var quien = h("span", "q-st"); pvt.append(ps, quien); ep.append(pvt, pv);
    if (innerWidth < 900){ MODOPV = "q-celu"; pv.className = "q-pv q-celu"; bM.className = "q-on"; bC.className = ""; }

    var tR = null, tG = null;
    function refrescar(ya){ clearTimeout(tR); tR = setTimeout(function(){ var y = pv.contentWindow ? pv.contentWindow.scrollY : 0; var c = ejemplo(d); pv.srcdoc = mailHTML(d, c); pv.onload = function(){ try { pv.contentWindow.scrollTo(0, y); } catch(e){} }; quien.textContent = "Ejemplo con: " + (c.nombre || ""); }, ya ? 0 : 250); }
    function cambio(){ est.textContent = "Guardando…"; refrescar(); clearTimeout(tG); tG = setTimeout(guardarYa, 900); }
    function guardarYa(){ clearTimeout(tG); return guardar(row).then(function(){ est.textContent = "Todo guardado ✓"; }, function(){ est.textContent = "No se pudo guardar"; }); }
    nm.oninput = function(){ d.nombre = nm.value; cambio(); };

    function sec(t, extra){ var s = h("div", "q-sc"), hh = h("h5", null, t); if (extra) hh.append(extra); s.append(hh); ef.append(s); return s; }
    function campo(s, t, k, tipo, ph, hint){
      var l = h("label", null, t), i = tipo === "area" ? h("textarea") : h("input"); if (tipo !== "area") i.type = tipo || "text";
      i.value = d[k] == null ? "" : d[k]; if (ph) i.placeholder = ph; i.oninput = function(){ d[k] = tipo === "number" ? (i.value ? +i.value : "") : i.value; cambio(); };
      l.append(i); s.append(l); if (hint) s.append(h("p", "q-hint", hint)); return i;
    }

    // 1. a quién y cuándo
    var s1 = sec("1 · A quién y cuándo");
    var pc = h("div", "q-pc"), cuenta = h("p", "q-hint");
    function pintarPara(){
      pc.innerHTML = "";
      ["todos", "act", "con", "dor", "mano"].forEach(function(k){ var b = btn(d.para === k || (!d.para && k === "todos") ? "q-on" : "", GR[k], function(){ d.para = k; pintarPara(); cambio(); }); if (k !== "mano") b.append(h("small", null, destinatarios({ para: k }).length)); pc.append(b); });
      var n = destinatarios(d).length; cuenta.textContent = "Le llega a " + n + " cliente" + (n === 1 ? "" : "s") + " (los que tienen mail y no se dieron de baja).";
      lst.style.display = d.para === "mano" ? "" : "none"; if (d.para === "mano") pintarLista();
    }
    var lst = h("div", "q-lst");
    function pintarLista(){
      lst.innerHTML = ""; d.elegidos = d.elegidos || [];
      suscriptos().sort(function(a, b){ return String(a.nombre).localeCompare(String(b.nombre)); }).forEach(function(c){
        var l = h("label"), ch = h("input"); ch.type = "checkbox"; ch.checked = d.elegidos.indexOf(c.id) >= 0;
        ch.onchange = function(){ var i = d.elegidos.indexOf(c.id); if (ch.checked && i < 0) d.elegidos.push(c.id); if (!ch.checked && i >= 0) d.elegidos.splice(i, 1); var n = destinatarios(d).length; cuenta.textContent = "Le llega a " + n + " cliente" + (n === 1 ? "" : "s") + "."; cambio(); };
        l.append(ch, h("span", null, c.nombre + " · " + c.email)); lst.append(l);
      });
    }
    s1.append(pc, cuenta, lst); pintarPara();
    var dos = h("div", "q-two"); s1.append(dos);
    var ld = h("label", null, "Se manda el día"), sd = h("select");
    var o0 = h("option", null, "Lo mando yo a mano"); o0.value = ""; sd.append(o0);
    for (var i = 1; i <= 28; i++){ var o = h("option", null, i + " de cada mes"); o.value = i; sd.append(o); }
    sd.value = d.dia || ""; sd.onchange = function(){ d.dia = sd.value ? +sd.value : ""; if (!d.dia) d.activo = false; act.className = "q-sw" + (d.activo ? " q-on" : ""); actT.textContent = d.activo ? "Programada" : "Pausada"; cambio(); };
    ld.append(sd); dos.append(ld);
    var la = h("label", null, "Estado"), act = h("span", "q-sw" + (d.activo ? " q-on" : "")), actT = h("span", null, d.activo ? "Programada" : "Pausada");
    act.append(h("i"), actT); act.style.marginTop = "6px";
    act.onclick = function(){ if (!d.dia){ toast("Primero elegí qué día se manda"); return; } d.activo = !d.activo; act.className = "q-sw" + (d.activo ? " q-on" : ""); actT.textContent = d.activo ? "Programada" : "Pausada"; cambio(); };
    la.append(act); dos.append(la);

    // 2. asunto
    var s2 = sec("2 · Asunto");
    campo(s2, "Asunto (lo primero que ven en la bandeja)", "asunto", "text", "Ej: Sumamos novedades al catálogo 🤎", "Podés usar {nombre} y {mes}. Cortito: menos de 50 letras se lee entero en el celu.");
    campo(s2, "Texto de vista previa", "preheader", "text", "Aparece al lado del asunto en Gmail");

    // 3. banner
    var s3 = sec("3 · Foto del banner");
    var dr = h("div", "q-drop"), fi = h("input"); fi.type = "file"; fi.accept = "image/*"; fi.style.display = "none";
    function pintarBanner(){ dr.innerHTML = ""; var b = banner(d); if (b){ var im = h("img"); im.src = b; dr.append(im, h("span", null, "Tocá o arrastrá otra foto para cambiarla")); } else dr.append(h("span", null, "📷 Tocá acá o arrastrá la foto del banner (ideal horizontal, 1200 × 600)")); }
    function usar(file){ if (!file) return; dr.innerHTML = ""; dr.append(h("span", null, "Subiendo foto…")); subirFoto(file).then(function(u){ d.banner = u; pintarBanner(); cambio(); toast("Foto cargada"); }, function(e){ toast("No se pudo subir: " + (e && e.message || e)); pintarBanner(); }); }
    dr.onclick = function(){ fi.click(); }; fi.onchange = function(){ usar(fi.files[0]); fi.value = ""; };
    dr.ondragover = function(e){ e.preventDefault(); dr.classList.add("q-over"); }; dr.ondragleave = function(){ dr.classList.remove("q-over"); };
    dr.ondrop = function(e){ e.preventDefault(); dr.classList.remove("q-over"); usar(e.dataTransfer.files[0]); };
    s3.append(dr, fi); pintarBanner();
    var qb = btn("q-sec", "Sacar foto", function(){ d.banner = ""; d.banners = []; pintarBanner(); cambio(); }); qb.style.marginTop = "8px"; s3.append(qb);
    var lbl = h("label", null, "Al tocar el banner va a…"); lbl.style.marginTop = "10px"; s3.append(lbl);
    var bl = h("input"); bl.type = "url"; bl.value = d.bannerLink || ""; bl.placeholder = WEB; bl.oninput = function(){ d.bannerLink = bl.value.trim(); cambio(); }; lbl.append(bl);

    // 4. texto
    var s4 = sec("4 · Texto");
    campo(s4, "Etiqueta chiquita (arriba del título)", "etiqueta", "text", "Ej: Nuevos ingresos");
    campo(s4, "Título", "titulo", "text", "Ej: Sumamos novedades 🤎");
    campo(s4, "Texto", "texto", "area", "Hola {nombre}! …", "{nombre} se cambia solo por el nombre de cada cliente. Dejá una línea en blanco para separar párrafos.");

    // 5. botones
    var s5 = sec("5 · Botones");
    var b1 = h("div", "q-two"); s5.append(b1);
    var t1 = h("label", null, "Botón principal"), i1 = h("input"); i1.type = "text"; i1.value = d.boton1 || ""; i1.oninput = function(){ d.boton1 = i1.value; cambio(); }; t1.append(i1);
    var l1 = h("label", null, "Lleva a"), j1 = h("input"); j1.type = "url"; j1.value = d.link1 || ""; j1.placeholder = WEB; j1.oninput = function(){ d.link1 = j1.value.trim(); cambio(); }; l1.append(j1); b1.append(t1, l1);
    var b2 = h("div", "q-two"); s5.append(b2);
    var t2 = h("label", null, "Botón de abajo (opcional)"), i2 = h("input"); i2.type = "text"; i2.value = d.boton2 || ""; i2.oninput = function(){ d.boton2 = i2.value; cambio(); }; t2.append(i2);
    var l2 = h("label", null, "Lleva a"), j2 = h("input"); j2.type = "url"; j2.value = d.link2 || ""; j2.placeholder = WA; j2.oninput = function(){ d.link2 = j2.value.trim(); cambio(); }; l2.append(j2); b2.append(t2, l2);
    var atj = h("div", "q-pc"); atj.append(h("span", "q-hint", "Links rápidos:"));
    [["Catálogo", WEB], ["WhatsApp", WA], ["Tienda", TIENDA]].forEach(function(x){ atj.append(btn("", x[0] + " → 1", function(){ j1.value = x[1]; d.link1 = x[1]; cambio(); })); });
    s5.append(atj);

    // 6. productos
    var s6 = sec("6 · Productos destacados", btn("q-sec", "+ Elegir", elegirProd));
    var pl = h("div", "q-pl"); s6.append(pl);
    function pintarProd(){
      pl.innerHTML = "";
      if (!d.productos.length) pl.append(h("p", "q-hint", "Opcional. Elegí productos del catálogo mayorista: salen con su foto y cada uno lleva al link que pongas."));
      d.productos.forEach(function(p, ix){
        var r = h("div", "q-pi"), im = h("img"); im.src = p.foto;
        var mid = h("div"); mid.append(h("b", null, p.nombre));
        var pr = h("input"); pr.type = "text"; pr.placeholder = "Precio (opcional)"; pr.value = p.precio || ""; pr.oninput = function(){ p.precio = pr.value; cambio(); };
        var lk = h("input"); lk.type = "url"; lk.placeholder = "Link (si lo dejás vacío, va al catálogo)"; lk.value = p.link || ""; lk.oninput = function(){ p.link = lk.value.trim(); cambio(); };
        mid.append(pr, lk);
        r.append(im, mid, btn("q-rm", "×", function(){ d.productos.splice(ix, 1); pintarProd(); cambio(); })); pl.append(r);
      });
    }
    function elegirProd(){
      var P = popup("Elegí productos"), q = h("input"); q.placeholder = "Buscar producto…"; P.hd.insertBefore(q, P.hd.children[1]);
      var g = h("div", "q-ig"); P.i.append(g); g.append(h("p", "q-hint", "Cargando catálogo…"));
      var listo = btn("q-pri", "Listo", function(){ P.p.remove(); pintarProd(); cambio(); }); listo.style.cssText = "border:0;background:#3B2418;color:#fff;border-radius:999px;padding:8px 16px;font:inherit;cursor:pointer"; P.hd.insertBefore(listo, P.hd.lastChild);
      catalogo().then(function(L){
        function lleno(){
          g.innerHTML = ""; var qq = N(q.value);
          if (!L.length){ g.append(h("p", "q-hint", "No pude leer el catálogo mayorista.")); return; }
          L.filter(function(p){ return !qq || N(p.nombre).indexOf(qq) >= 0; }).forEach(function(p){
            var ya = d.productos.some(function(x){ return x.id === p.id; }), b = btn(ya ? "q-on" : "", null), im = h("img"); im.src = p.foto; im.loading = "lazy";
            b.append(im, h("span", null, p.nombre));
            b.onclick = function(){ var i = -1; d.productos.forEach(function(x, k){ if (x.id === p.id) i = k; }); if (i >= 0) d.productos.splice(i, 1); else d.productos.push({ id: p.id, nombre: p.nombre, foto: p.foto, link: "" }); b.classList.toggle("q-on", i < 0); };
            g.append(b);
          });
        }
        q.oninput = lleno; lleno();
      });
    }
    pintarProd();

    // 7. datos útiles
    var s7 = sec("7 · Recuadro de datos útiles");
    campo(s7, "Uno por renglón (opcional)", "recordar", "area", "Reposición sin mínimo\nRetiro en Córdoba: martes y jueves");

    // 8. pie
    var s8 = sec("8 · Pie del mail");
    s8.append(h("p", "q-hint", "Va solo: links al catálogo, WhatsApp y tienda, y el link para darse de baja (así no es spam). Si alguien se da de baja, apagalo en Destinatarios."));

    // prueba
    pru.onclick = function(){
      if (!/@/.test(SOY)){ toast("No encontré tu mail"); return; }
      guardarYa(); pru.disabled = true; pru.textContent = "Mandando…";
      var ej = ejemplo(d);
      function fin(ok){ pru.disabled = false; pru.textContent = "✉ Mandarme una prueba"; toast(ok ? "Prueba enviada a " + SOY : "No se pudo mandar la prueba"); if (ok){ d.historial.unshift({ f: hoy(), n: 1, prueba: true, por: SOY, para: SOY }); guardar(row); } }
      try {
        google.script.run.withSuccessHandler(function(r){ fin(r && (r.ok || []).length); }).withFailureHandler(function(){ fin(false); })
          .mandarMails(JSON.stringify({ asunto: "[Prueba] " + reemplazar(d.asunto, ej), fotos: [], para: [{ id: "prueba-" + row.id, email: SOY, html: mailHTML(d, ej), texto: mailTexto(d, ej) }] }));
      } catch(e){ fin(false); }
    };
    E.tabIndex = -1; E.addEventListener("keydown", function(e){ if (e.key === "Escape" && !document.querySelector(".nvmp")) cerrar.click(); });
    refrescar(true);
  }

  /* ---------- montar en Mayoristas ---------- */
  function montar(){
    var main = document.querySelector("main#list"); if (!main) return;
    var top = main.querySelector(".my-top"), sw = top && top.querySelector(".pz-sw");
    if (!sw){ main.classList.remove("nvml-on"); MODO = false; var bx = document.getElementById("nvml"); if (bx) bx.remove(); return; }
    var b = sw.querySelector(".nvml-tab");
    if (!b){ b = document.createElement("button"); b.type = "button"; b.className = "nvml-tab"; b.textContent = "Mails"; sw.appendChild(b); }
    b.classList.toggle("on", MODO);
    main.classList.toggle("nvml-on", MODO);
    var box = document.getElementById("nvml");
    if (MODO){
      if (!box || box.parentNode !== main){ if (box) box.remove(); box = document.createElement("div"); box.id = "nvml"; top.after(box); pintar(); if (!ROWS) cargar().then(pintar); }
    } else if (box) box.remove();
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("main#list .my-top .pz-sw button"); if (!b) return;
    var era = MODO; MODO = b.classList.contains("nvml-tab");
    if (MODO && !era && ROWS) cargar().then(pintar);
    setTimeout(montar, 0); setTimeout(montar, 200);
  }, true);
  function quienSoy(){ try { SB().auth.getUser().then(function(r){ SOY = (r && r.data && r.data.user && r.data.user.email) || ""; }); } catch(e){} }
  quienSoy();
  setInterval(function(){ try { if (!SOY && SB()) quienSoy(); montar(); } catch(e){} }, 600);
  window.__nvMailHTML = mailHTML;
})();
