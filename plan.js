/* ================= Tareas → Plan y SOPs (etapas, pasos, tareas, comentarios, SOPs) ================= */
(function(){
  if (window.__nvPlan) return; window.__nvPlan = 1;
  var TABLA = "plan", LSV = "nvPlanVista";
  var PEOPLE = { euge: "Euge", pau: "Pau", dos: "Las dos" };

  /* ---------- datos iniciales (del doc de 13 pasos) ---------- */
  var SEED = {
    etapas: [["e1","Antes de la venta"],["e2","Durante la venta"],["e3","Después de la venta"]],
    pasos: [
      ["p01","e1","Proveedores y compras","Comprar a tiempo, al precio correcto y sin perseguir a nadie por WhatsApp.","Vigila Grass (precios, semáforo, pedidos) y avisa en el chat.",[
        "Una ficha por proveedor: contacto, web, cómo se paga, días de retiro (Licari, Aurora, Texkabel, Tikka y Entrance retiran en Bicentenario)",
        "Pedidos con estado claro: pedido → pagado → retirado → recibido",
        "Comprobante de pago enviado al proveedor desde el tablero, sin buscarlo en el chat",
        "Revisar precios y stock de los proveedores con web, no solo Grass"]],
      ["p02","e1","Recepción y control","Que lo que entra al depósito esté sano, contado y cargado el mismo día.","Descuenta stock cuando entra una venta y avisa cuando algo está en 0.",[
        "Al recibir: revisar cada pieza (roturas, color, medida) y anotar si falta algo",
        "Cargar el stock en el tablero en el momento, no después",
        "Producción propia: armazones y tejidos con su estado (para llevar, en curso, retirado)",
        "Lo que viene fallado: foto y reclamo al proveedor ese mismo día"]],
      ["p02b","e1","Depósito y stock","Saber siempre qué hay, qué viene en camino y qué ya está vendido, sin contar todo a mano.","Se puede sumar una solapa Stock con los 5 casilleros por producto.",[
        "Dividir por familia: colgantes, apliques, veladores, pantallas, repuestos, packaging",
        "Numerar estantes (A1, A2, B1…) y anotar en cada producto dónde vive",
        "Etiqueta visible en cada estante con nombre y foto chica del producto",
        "Un lugar fijo y separado para Reservado (lo vendido que espera despacho)",
        "Otro lugar para Revisar (fallado, devuelto, sin identificar)",
        "Lo que entra primero, sale primero",
        "Cada vez que llega algo: anotarlo el mismo día, antes de guardarlo",
        "Cada semana (10 min): contar 5–10 productos al azar y comparar con lo anotado",
        "Cada mes: conteo completo de lo que más se vende"],
        {pasos:"Cada producto está en un solo casillero: En camino, En producción, En depósito, Reservado o Salió\nLo que se puede vender es solo lo que está En depósito\nCada vez que algo se mueve, se anota una línea: qué, cuántos, de qué casillero a cuál y quién"}],
      ["p03","e1","Costos y precios","Saber cuánto se gana en cada producto, minorista y mayorista, y no vender a pérdida cuando un proveedor aumenta.","Calcula la ganancia de cada venta.",[
        "Costo al día de cada producto (producción propia y externa), con envío de Bicentenario y kit eléctrico",
        "Margen mínimo acordado por tipo de producto",
        "Cuando un proveedor aumenta: revisar qué precios de la web y del catálogo mayorista hay que mover",
        "Formas de cobro con su costo real (Pago Nube, cuotas, transferencia)"]],
      ["p04","e1","Fotos y ficha de producto","Que cada producto se vea igual de lindo y tenga la misma información, en la web y en el catálogo mayorista.","",[
        "Fotos reales con el mismo estilo: una de producto solo, una de ambiente y una con medida",
        "Descripción con la plantilla común (medidas, materiales, ubicación, cuidados)",
        "Guía de medidas y ubicación (estilo \"Aplique Pisa\") en los más vendidos",
        "Mismo nombre del producto en todos lados: web, catálogo, tablero y facturas"]],
      ["p05","e2","Web: optimización de la tienda","Que quien entra encuentre rápido lo que busca, confíe y compre sin escribirnos.","Carga cada venta web y detecta las canceladas.",[
        "Categorías por ambiente (living, dormitorio, cocina, baño) y por tipo (colgantes, apliques, veladores)",
        "Títulos y descripciones pensados para Google (SEO), con la plantilla común",
        "Envío gratis desde $200.000 bien visible, y cómo se retira en el depósito",
        "Cuotas y descuento por transferencia claros en cada producto",
        "Reseñas y fotos de clientes en la ficha",
        "Revisar la web en el celular y en la compu"]],
      ["p06","e2","Canales: Instagram, WhatsApp y mayoristas","Que cada canal lleve a una venta y que los mayoristas vuelvan a comprar.","",[
        "Instagram: misma estética que la web, con link directo al producto",
        "WhatsApp: respuestas guardadas para las preguntas de siempre (medidas, envío, cuotas, retiro)",
        "Mayoristas: catálogo al día en nervomayorista.com, con y sin marca",
        "Mail mensual a mayoristas (elegir una de las 4 versiones)",
        "Seguimiento de cada mayorista: cuándo compró por última vez y cuándo escribirle"]],
      ["p07","e2","Atención y cierre de la venta","Que nadie que preguntó o dejó un carrito se pierda por falta de respuesta.","Muestra los carritos abandonados.",[
        "Tiempo de respuesta acordado entre Pau y Euge (quién contesta y en qué horario)",
        "Carritos abandonados: mensaje firmado \"Soy Pau de Nervo Design\", cálido, sin ¡ ni ¿",
        "Ventas por WhatsApp cargadas con la plantilla de /nueva venta",
        "Presupuestos a mayoristas con un diseño prolijo y con vencimiento"]],
      ["p08","e2","Cobro y facturación","Que cada peso esté registrado en la cuenta correcta y que la facturación no se pase del tope.","Lee los movimientos del chat y de los mails, y avisa cuánto le queda a cada una para el tope.",[
        "Cada cobro con su comprobante en #movimientos, aprobado por Pau o Euge",
        "Facturar desde el tablero, siempre revisando antes de emitir",
        "Conectar a Pau con ARCA, como ya está Euge",
        "Mirar el tope de facturación de cada una a mitad de mes"]],
      ["p09","e2","Preparación del pedido","Que martes y jueves salga todo completo, bien protegido y sin olvidos.","Arma la lista de pedidos, las etiquetas y los datos para Vía Cargo.",[
        "Lista de pedidos \"Para embalar\" impresa o en el celu, con lo que lleva cada uno",
        "Control antes de cerrar la caja: producto, cantidad, color y medida correctos",
        "Protección según el producto (pantallas tejidas, vidrio, piezas largas)",
        "Etiqueta de envío y etiqueta de frágil puestas",
        "Foto del pedido armado, por si después hay un reclamo"]],
      ["p10","e3","Envío y seguimiento","Que el cliente sepa dónde está su pedido sin tener que preguntar.","Lee las guías de Vía Cargo del mail, las une a cada venta y arma el mensaje listo para copiar.",[
        "Avisar a Lucas (Vía Cargo) para el retiro cada martes y jueves",
        "Mandar el seguimiento el mismo día que llega la guía, con el mensaje de siempre",
        "Marcar el pedido como enviado",
        "Si un envío se demora: avisarle al cliente antes de que pregunte"]],
      ["p11","e3","Postventa: llegada, cambios y reseñas","Que la compra termine bien y deje una reseña o una foto.","",[
        "Cuando el pedido figura entregado: mensaje corto preguntando si llegó bien",
        "Tener escrita la respuesta para cambios y devoluciones (plazos, quién paga el envío, cómo se embala)",
        "Si algo llegó roto: pedir foto, resolver rápido y anotar qué falló en el embalaje",
        "Pasados los 10 días de la entrega: pedir reseña con un cupón de 5–10 % para la próxima compra",
        "Pedir que nos etiqueten si suben foto del producto en casa"]],
      ["p12","e3","Recompra y fidelización","Que el que compró una vez vuelva.","",[
        "Mail post-compra a los 30–60 días con productos que combinan con lo que compró",
        "Lista de clientes que compraron más de una vez, con un trato especial",
        "Mayoristas: mail mensual con el catálogo nuevo",
        "Mayoristas inactivos: si hace 2–3 meses no piden, escribirles a mano"]],
      ["p13","e3","Packaging y etiquetas","Que la caja llegue sana y que abrirla sea lindo. Es lo primero que el cliente toca de Nervo.","",[
        "Etiquetas propias con dibujito de línea: \"Frágil\", \"No aplastar\", \"Este lado arriba\"",
        "Una etiqueta en cada cara grande de la caja, no solo arriba",
        "Cinta o sticker con la \"n.\" para cerrar",
        "Pantallas y vidrios envueltos aparte, con relleno en las 6 caras",
        "Probar una caja armada: sacudirla y apoyarle peso arriba antes de cerrarla",
        "Papel de seda o kraft encima, todo prolijo y en el mismo orden siempre",
        "Tarjeta con \"Tu casa, tu refugio.\", un gracias de Pau y Euge y cómo cuidar el producto",
        "Un QR a Instagram o a la reseña",
        "Checklist pegado en la mesa de armado, para que todas las cajas salgan iguales"]]
    ]
  };

  /* ---------- estado ---------- */
  var DB = {}, LOADED = false, BUSY = false;
  var V = { vista: "", paso: null, tarea: null, sub: "plan", ordenar: false, sopEdit: false, menu: null };
  try { V.vista = localStorage.getItem(LSV) || ""; } catch(e){}

  function N(){ return window.__nv || {}; }
  function ST(){ return N().S || {}; }
  function soy(){ return (ST().soy || "").toLowerCase(); }
  function sb(){ return window.__sb; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function uid(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
  function toast(m){ try { if (window.toast) return window.toast(m); } catch(e){} var t = document.createElement("div"); t.className = "npl-toast"; t.textContent = m; document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2200); }
  function list(t){ return Object.keys(DB).map(function(k){ return DB[k]; }).filter(function(o){ return o.t === t && !o._b; }); }
  function byOrden(a, b){ return (a.orden || 0) - (b.orden || 0); }
  function etapas(){ return list("etapa").sort(byOrden); }
  function pasosDe(e){ return list("paso").filter(function(p){ return p.etapa === e; }).sort(byOrden); }
  function tareasDe(p){ return list("tarea").filter(function(t){ return t.paso === p; }).sort(byOrden); }

  /* ---------- guardar / leer ---------- */
  function guardar(o, quiet){
    o.mod = Date.now(); o.modPor = soy();
    DB[o.id] = o;
    var row = { tabla: TABLA, id: o.id, data: o, borrado: false, actualizado: new Date().toISOString(), por: soy() || "nervo" };
    return sb().from("registros").upsert(row, { onConflict: "tabla,id" }).then(function(r){
      if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; }
      if (!quiet) toast("Guardado");
    });
  }
  function guardarVarios(arr){
    var rows = arr.map(function(o){ o.mod = Date.now(); o.modPor = soy(); DB[o.id] = o; return { tabla: TABLA, id: o.id, data: o, borrado: false, actualizado: new Date().toISOString(), por: soy() || "nervo" }; });
    return sb().from("registros").upsert(rows, { onConflict: "tabla,id" }).then(function(r){ if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; } });
  }
  function borrar(o){
    o._b = 1;
    return sb().from("registros").update({ borrado: true, actualizado: new Date().toISOString(), por: soy() || "nervo" }).eq("tabla", TABLA).eq("id", o.id)
      .then(function(r){ if (r.error){ o._b = 0; toast("No se pudo borrar: " + r.error.message); } else toast("Eliminado"); pintar(); });
  }
  function leer(){
    if (!sb() || BUSY) return Promise.resolve();
    BUSY = true;
    return sb().from("registros").select("id,data,borrado").eq("tabla", TABLA).limit(5000).then(function(r){
      BUSY = false;
      if (r.error){ return; }
      var nuevo = {};
      (r.data || []).forEach(function(x){ var o = x.data || {}; o.id = x.id; if (x.borrado) o._b = 1; nuevo[x.id] = o; });
      DB = nuevo; var prim = !LOADED; LOADED = true;
      if (!(r.data || []).length) return sembrar();
      if (prim || !enfocado()) pintar();
    }, function(){ BUSY = false; });
  }
  function sembrar(){
    var arr = [];
    SEED.etapas.forEach(function(e, i){ arr.push({ t: "etapa", id: e[0], nombre: e[1], orden: i + 1 }); });
    SEED.pasos.forEach(function(p, i){
      var o = { t: "paso", id: p[0], etapa: p[1], nombre: p[2], obj: p[3], tablero: p[4], orden: i + 1, resp: "", sop: p[6] || {} };
      arr.push(o);
      p[5].forEach(function(tx, j){ arr.push({ t: "tarea", id: p[0] + "t" + (j + 1), paso: p[0], texto: tx, orden: j + 1, hecha: false, resp: "", fecha: "", coms: [], link: (p[0] === "p01" && j === 0) ? "fichas" : "" }); });
    });
    return guardarVarios(arr).then(function(){ pintar(); });
  }
  function enfocado(){ var a = document.activeElement; return a && ROOT && ROOT.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName); }

  /* ---------- avisos (asignación y @menciones) ---------- */
  function avisar(para, titulo, id){
    para = String(para || "").toLowerCase(); if (!/^(euge|pau)$/.test(para) || para === soy()) return;
    try { sb().functions.invoke("avisos", { body: { accion: "tarea", para: para, titulo: titulo, id: id } }).catch(function(){}); } catch(e){}
  }

  /* ---------- estilos ---------- */
  var CSS = [
    "body.npl-on #summary,body.npl-on #filters,body.npl-on #stockTools,body.npl-on #list,body.npl-on #status,body.npl-on .fab,body.npl-on #fab{display:none!important}",
    "#nplSeg{display:flex;gap:6px;margin:4px 0 12px;font-family:Outfit,system-ui,sans-serif}",
    "#nplSeg button{border:0;font:inherit;font-size:14px;padding:8px 15px;border-radius:999px;background:#F4F1EE;color:#7A6D64;cursor:pointer}",
    "#nplSeg button.on{background:#2B211B;color:#fff}",
    "#nplRoot{font-family:Outfit,system-ui,sans-serif;color:#2B211B;max-width:760px;padding-bottom:120px}",
    "#nplRoot *{box-sizing:border-box}",
    ".npl-card{background:#fff;border:1px solid #EFEBE7;border-radius:16px}",
    ".npl-prog{display:flex;align-items:center;gap:14px;padding:14px 16px;margin-bottom:6px}",
    ".npl-ring{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none}",
    ".npl-ring i{width:42px;height:42px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:12.5px;font-weight:600}",
    ".npl-prog b{font-weight:500;font-size:15px;display:block}.npl-prog small{color:#7A6D64;font-size:12.5px}",
    ".npl-tools{margin-left:auto;display:flex;gap:6px}",
    ".npl-btn{border:1px solid #EFEBE7;background:#fff;color:#2B211B;font:inherit;font-size:13px;padding:7px 12px;border-radius:999px;cursor:pointer}",
    ".npl-btn.on{background:#2B211B;color:#fff;border-color:#2B211B}",
    ".npl-btn.dark{background:#5A4334;color:#fff;border-color:#5A4334}",
    ".npl-eh{display:flex;align-items:center;gap:8px;margin:20px 2px 8px}",
    ".npl-eh b{font-size:13px;font-weight:600;letter-spacing:.02em;flex:1}",
    ".npl-eh small{color:#A79B92;font-size:12px}",
    ".npl-ic{border:0;background:transparent;color:#A79B92;font:inherit;font-size:15px;padding:4px 6px;cursor:pointer;border-radius:8px;line-height:1}",
    ".npl-ic:hover{background:#F4F1EE;color:#2B211B}.npl-ic.del:hover{color:#B4533F}",
    ".npl-paso{display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:7px;cursor:pointer;transition:border-color .15s}",
    ".npl-paso:hover{border-color:#DCD4CC}",
    ".npl-paso .bd{flex:1;min-width:0}",
    ".npl-paso .n{font-size:15px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".npl-paso .m{font-size:12.5px;color:#7A6D64;margin-top:3px;display:flex;align-items:center;gap:6px}",
    ".npl-bar{height:4px;background:#F1ECE7;border-radius:3px;overflow:hidden;margin-top:7px}.npl-bar i{display:block;height:100%;background:#5A4334;border-radius:3px}",
    ".npl-dot{width:8px;height:8px;border-radius:50%;flex:none}.d-ok{background:#7FA36B}.d-arm{background:#D9957F}.d-no{background:#D8D1CB}",
    ".npl-av{width:24px;height:24px;border-radius:50%;font-size:10.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;flex:none}",
    ".av-euge{background:#EBF1E6;color:#4C6A3E}.av-pau{background:#FBEDE8;color:#9A5A47}.av-dos{background:#ECF1F8;color:#46618A}",
    ".npl-add{display:block;width:100%;border:1.5px dashed #E2DCD6;background:transparent;border-radius:14px;padding:11px;text-align:center;font:inherit;font-size:14px;color:#7A6D64;cursor:pointer;margin-top:4px}",
    ".npl-add:hover{border-color:#B9ADA3;color:#2B211B}",
    ".npl-back{border:0;background:transparent;font:inherit;font-size:14px;color:#7A6D64;padding:4px 0;cursor:pointer;margin-bottom:6px}",
    ".npl-title{font-size:22px;font-weight:600;letter-spacing:-.01em;margin:2px 0 6px;display:flex;align-items:flex-start;gap:6px}",
    ".npl-obj{font-size:14px;color:#7A6D64;line-height:1.5;margin:0 0 10px}",
    ".npl-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}",
    ".npl-sel{border:1px solid #EFEBE7;background:#fff;border-radius:999px;font:inherit;font-size:13px;padding:6px 10px;color:#2B211B}",
    ".npl-tabs{display:flex;border-bottom:1px solid #EFEBE7;margin:6px 0 4px}",
    ".npl-tabs button{border:0;background:transparent;font:inherit;padding:10px 2px;margin-right:20px;font-size:14.5px;color:#7A6D64;cursor:pointer;border-bottom:2px solid transparent}",
    ".npl-tabs button.on{color:#2B211B;font-weight:500;border-bottom-color:#2B211B}",
    ".npl-t{display:flex;gap:10px;align-items:flex-start;padding:12px 2px;border-bottom:1px solid #EFEBE7}",
    ".npl-ck{width:22px;height:22px;border:1.5px solid #CFC6BE;border-radius:50%;flex:none;margin-top:0;display:flex;align-items:center;justify-content:center;background:#fff;cursor:pointer;padding:0}",
    ".npl-ck.on{background:#5A4334;border-color:#5A4334}",
    ".npl-ck.on:after{content:'';width:9px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px)}",
    ".npl-t .tx{flex:1;min-width:0;cursor:pointer}",
    ".npl-t .tx>span{font-size:14.5px;line-height:1.4}",
    ".npl-t.done .tx>span{color:#A79B92;text-decoration:line-through}",
    ".npl-tm{display:flex;gap:8px;margin-top:5px;align-items:center;font-size:12.5px;color:#7A6D64;flex-wrap:wrap}",
    ".npl-tm .late{color:#B4533F}",
    ".npl-quick{display:flex;gap:8px;margin-top:12px}",
    ".npl-in{flex:1;border:1px solid #EFEBE7;border-radius:12px;padding:11px 12px;font:inherit;font-size:15px;color:#2B211B;background:#fff;min-width:0}",
    ".npl-in:focus{outline:none;border-color:#B9ADA3}",
    ".npl-ta{width:100%;border:1px solid #EFEBE7;border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;line-height:1.5;min-height:90px;resize:vertical;color:#2B211B}",
    ".npl-h4{font-size:12px;letter-spacing:.08em;color:#7A6D64;font-weight:500;margin:18px 0 8px;text-transform:uppercase}",
    ".npl-kv{display:grid;grid-template-columns:90px 1fr;gap:8px 12px;font-size:14.5px;background:#F7F5F3;border-radius:14px;padding:14px}",
    ".npl-kv span:nth-child(odd){color:#7A6D64;font-size:13px}",
    ".npl-ol{margin:0;padding-left:22px;font-size:14.5px;line-height:1.55}.npl-ol li{margin-bottom:6px}",
    ".npl-empty{color:#A79B92;font-size:14px;padding:10px 0}",
    ".npl-foot{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:12px;border-top:1px solid #EFEBE7;font-size:12.5px;color:#7A6D64;gap:10px}",
    ".npl-note{font-size:13px;color:#46618A;background:#ECF1F8;border-radius:12px;padding:10px 12px;margin:14px 0 0;line-height:1.45}",
    ".npl-fld{display:grid;grid-template-columns:100px 1fr;gap:10px;align-items:center;font-size:14.5px;padding:10px 0;border-bottom:1px solid #EFEBE7}",
    ".npl-fld>span:first-child{color:#7A6D64;font-size:13px}",
    ".npl-c{display:flex;gap:10px;margin-top:14px}",
    ".npl-c .b{background:#F7F5F3;border-radius:14px;padding:9px 12px;font-size:14px;line-height:1.45;flex:1;white-space:pre-wrap;word-break:break-word}",
    ".npl-c .b small{display:block;color:#A79B92;font-size:11.5px;margin-bottom:2px}",
    ".npl-mn{color:#46618A;background:#ECF1F8;border-radius:6px;padding:0 4px;font-weight:500}",
    ".npl-sug{display:flex;gap:6px;margin-top:6px}",
    ".npl-sug button{border:1px solid #EFEBE7;background:#fff;border-radius:999px;padding:5px 10px 5px 5px;font:inherit;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}",
    ".npl-shade{position:fixed;inset:0;background:rgba(30,22,18,.22);z-index:9600}",
    ".npl-sheet{position:fixed;left:0;right:0;bottom:0;z-index:9601;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.12);padding:10px 18px calc(18px + env(safe-area-inset-bottom));max-width:520px;margin:0 auto;font-family:Outfit,system-ui,sans-serif;max-height:80vh;overflow:auto}",
    ".npl-sheet .hd{width:38px;height:4px;border-radius:3px;background:#E2DCD6;margin:0 auto 10px}",
    ".npl-sheet h5{margin:4px 0 8px;font-size:14px;color:#7A6D64;font-weight:500}",
    ".npl-sheet button.it{display:flex;width:100%;align-items:center;gap:12px;padding:13px 2px;font:inherit;font-size:15.5px;border:0;border-bottom:1px solid #EFEBE7;background:transparent;color:#2B211B;cursor:pointer;text-align:left}",
    ".npl-sheet button.it:last-child{border:none}.npl-sheet button.it.del{color:#B4533F}",
    ".npl-sheet button.it i{width:22px;text-align:center;font-style:normal;color:#7A6D64}",
    ".npl-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#2B211B;color:#fff;padding:9px 16px;border-radius:999px;font:14px Outfit,sans-serif;z-index:9700}",
    "@media (max-width:640px){.npl-title{font-size:20px}.npl-kv{grid-template-columns:80px 1fr}}"
  ].join("");
  var st = document.createElement("style"); st.id = "npl-css"; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- helpers de vista ---------- */
  function av(p){ p = p || ""; if (!PEOPLE[p]) return ""; return '<span class="npl-av av-' + p + '" title="' + PEOPLE[p] + '">' + (p === "dos" ? "P+E" : PEOPLE[p][0]) + '</span>'; }
  function estado(p){
    var ts = tareasDe(p.id), h = ts.filter(function(t){ return t.hecha; }).length;
    if (ts.length && h === ts.length) return { c: "d-ok", t: "SOP listo", h: h, n: ts.length };
    if (h || (p.sop && (p.sop.pasos || p.sop.quien))) return { c: "d-arm", t: "En armado", h: h, n: ts.length };
    return { c: "d-no", t: "Sin empezar", h: h, n: ts.length };
  }
  function fechaTxt(f){ if (!f) return ""; var p = f.split("-"); return p.length === 3 ? (+p[2]) + "/" + (+p[1]) : f; }
  function vencida(f){ if (!f) return false; var h = new Date(); h.setHours(0,0,0,0); return new Date(f + "T00:00:00") < h; }
  function personaSel(cls, val, attr){
    return '<select class="npl-sel ' + cls + '" ' + (attr || "") + '><option value="">Sin asignar</option>' +
      ["euge","pau","dos"].map(function(k){ return '<option value="' + k + '"' + (val === k ? " selected" : "") + '>' + PEOPLE[k] + '</option>'; }).join("") + '</select>';
  }
  function conMenciones(s){ return esc(s).replace(/@(Pau|Euge|todas)/gi, function(m){ return '<span class="npl-mn">' + m + '</span>'; }); }
  function cuando(ts){ if (!ts) return ""; var d = new Date(ts); var h = new Date(); var hoy = d.toDateString() === h.toDateString();
    return (hoy ? "hoy" : d.getDate() + "/" + (d.getMonth() + 1)) + " " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"); }

  /* ---------- pantallas ---------- */
  function vGeneral(){
    var todas = list("tarea").filter(function(t){ var p = DB[t.paso]; return p && !p._b; });
    var hechas = todas.filter(function(t){ return t.hecha; }).length;
    var pct = todas.length ? Math.round(hechas * 100 / todas.length) : 0;
    var h = '<div class="npl-card npl-prog"><div class="npl-ring" style="background:conic-gradient(#5A4334 0 ' + pct + '%,#EFEBE7 0)"><i>' + pct + '%</i></div>' +
      '<div><b>' + hechas + ' de ' + todas.length + ' tareas listas</b><small>Meta: 31 de diciembre</small></div>' +
      '<div class="npl-tools"><button class="npl-btn' + (V.ordenar ? " on" : "") + '" data-a="ordenar">' + (V.ordenar ? "Listo" : "Ordenar") + '</button></div></div>';
    var es = etapas();
    es.forEach(function(e, i){
      var ps = pasosDe(e.id);
      h += '<div class="npl-eh"><b>' + esc(e.nombre) + '</b><small>' + ps.length + ' pasos</small>' +
        (V.ordenar ? '<button class="npl-ic" data-a="e-up" data-id="' + e.id + '"' + (i ? "" : " disabled") + '>↑</button><button class="npl-ic" data-a="e-down" data-id="' + e.id + '">↓</button><button class="npl-ic del" data-a="e-del" data-id="' + e.id + '">🗑</button>' : "") +
        '<button class="npl-ic" data-a="e-ren" data-id="' + e.id + '" title="Cambiar nombre">✎</button></div>';
      ps.forEach(function(p, j){
        var s = estado(p), pct2 = s.n ? Math.round(s.h * 100 / s.n) : 0;
        h += '<div class="npl-card npl-paso" data-a="' + (V.ordenar ? "" : "abrir") + '" data-id="' + p.id + '"><div class="bd"><div class="n">' + esc(p.nombre) + '</div>' +
          '<div class="m"><span class="npl-dot ' + s.c + '"></span>' + s.t + ' · ' + s.h + '/' + s.n + '</div><div class="npl-bar"><i style="width:' + pct2 + '%"></i></div></div>' +
          (V.ordenar ? '<button class="npl-ic" data-a="p-up" data-id="' + p.id + '">↑</button><button class="npl-ic" data-a="p-down" data-id="' + p.id + '">↓</button><button class="npl-ic" data-a="p-mover" data-id="' + p.id + '" title="Mover de etapa">⇄</button><button class="npl-ic del" data-a="p-del" data-id="' + p.id + '">🗑</button>' : av(p.resp)) + '</div>';
      });
      h += '<button class="npl-add" data-a="p-new" data-id="' + e.id + '">+ Paso en ' + esc(e.nombre) + '</button>';
    });
    h += '<button class="npl-add" style="margin-top:22px" data-a="e-new">+ Nueva etapa</button>';
    return h;
  }

  function vPaso(){
    var p = DB[V.paso]; if (!p || p._b){ V.paso = null; return vGeneral(); }
    var ts = tareasDe(p.id), s = estado(p);
    var h = '<button class="npl-back" data-a="volver">‹ Plan</button>' +
      '<div class="npl-title"><span style="flex:1">' + esc(p.nombre) + '</span><button class="npl-ic" data-a="p-ren" data-id="' + p.id + '">✎</button></div>' +
      '<p class="npl-obj" data-a="p-obj" data-id="' + p.id + '" style="cursor:pointer">' + (p.obj ? esc(p.obj) : '<span style="color:#A79B92">+ Agregar objetivo</span>') + '</p>' +
      '<div class="npl-row"><span class="npl-dot ' + s.c + '"></span><span style="font-size:13px;color:#7A6D64">' + s.t + '</span><span style="flex:1"></span>' +
      '<span style="font-size:13px;color:#7A6D64">Responsable</span>' + personaSel("npl-presp", p.resp || "", 'data-id="' + p.id + '"') + '</div>' +
      '<div class="npl-tabs"><button data-a="sub" data-v="plan" class="' + (V.sub === "plan" ? "on" : "") + '">Plan · ' + s.h + '/' + s.n + '</button><button data-a="sub" data-v="sop" class="' + (V.sub === "sop" ? "on" : "") + '">Cómo lo hacemos</button></div>';
    if (V.sub === "plan"){
      if (!ts.length) h += '<div class="npl-empty">Todavía no hay tareas. Escribí la primera abajo.</div>';
      ts.forEach(function(t){
        var nc = (t.coms || []).length;
        h += '<div class="npl-t' + (t.hecha ? " done" : "") + '"><button class="npl-ck' + (t.hecha ? " on" : "") + '" data-a="t-ck" data-id="' + t.id + '" aria-label="Lista"></button>' +
          '<div class="tx" data-a="t-abrir" data-id="' + t.id + '"><span>' + esc(t.texto) + '</span>' +
          (t.link === "fichas" ? '<div class="npl-tm"><a href="#" data-a="ir-fichas" style="color:#46618A;text-decoration:none;font-weight:500">Abrir fichas de proveedores →</a></div>' : "") +
          ((t.resp || t.fecha || nc) ? '<div class="npl-tm">' + av(t.resp) + (t.fecha ? '<span class="' + (!t.hecha && vencida(t.fecha) ? "late" : "") + '">' + (t.hecha ? "" : "vence ") + fechaTxt(t.fecha) + '</span>' : "") + (nc ? '<span>💬 ' + nc + '</span>' : "") + '</div>' : "") +
          '</div><button class="npl-ic" data-a="t-menu" data-id="' + t.id + '">⋯</button></div>';
      });
      h += '<div class="npl-quick"><input class="npl-in" id="nplNew" placeholder="+ Escribí una tarea nueva…" enterkeyhint="done"><button class="npl-btn dark" data-a="t-new">Agregar</button></div>';
      if (p.tablero) h += '<div class="npl-note"><b>Lo que hace el tablero:</b> ' + esc(p.tablero) + '</div>';
    } else {
      var so = p.sop || {};
      if (V.sopEdit){
        h += '<div class="npl-h4">Quién</div><input class="npl-in" id="sopQuien" value="' + esc(so.quien || "") + '" placeholder="Ej: Pau (Euge de respaldo)">' +
          '<div class="npl-h4">Cuándo</div><input class="npl-in" id="sopCuando" value="' + esc(so.cuando || "") + '" placeholder="Ej: martes y jueves a la mañana">' +
          '<div class="npl-h4">Con qué</div><input class="npl-in" id="sopConque" value="' + esc(so.conque || "") + '" placeholder="Ej: Tablero → Envíos, etiquetas">' +
          '<div class="npl-h4">Paso a paso (uno por renglón)</div><textarea class="npl-ta" id="sopPasos" rows="6">' + esc(so.pasos || "") + '</textarea>' +
          '<div class="npl-h4">Checklist del día (uno por renglón)</div><textarea class="npl-ta" id="sopCheck" rows="4">' + esc(so.check || "") + '</textarea>' +
          '<div class="npl-h4">Notas</div><textarea class="npl-ta" id="sopNotas" rows="3">' + esc(so.notas || "") + '</textarea>' +
          '<div class="npl-foot"><button class="npl-btn" data-a="sop-cancel">Cancelar</button><button class="npl-btn dark" data-a="sop-save">Guardar</button></div>';
      } else {
        var vacio = !(so.quien || so.cuando || so.conque || so.pasos || so.check || so.notas);
        if (vacio) h += '<div class="npl-empty">Acá queda escrito cómo se hace este paso, para que cualquiera lo pueda seguir. Tocá Editar para escribirlo.</div>';
        else {
          if (so.quien || so.cuando || so.conque) h += '<div class="npl-kv"><span>Quién</span><span>' + esc(so.quien || "—") + '</span><span>Cuándo</span><span>' + esc(so.cuando || "—") + '</span><span>Con qué</span><span>' + esc(so.conque || "—") + '</span></div>';
          var lines = function(s){ return String(s || "").split("\n").map(function(x){ return x.trim(); }).filter(Boolean); };
          if (so.pasos) h += '<div class="npl-h4">Paso a paso</div><ol class="npl-ol">' + lines(so.pasos).map(function(x){ return "<li>" + esc(x) + "</li>"; }).join("") + '</ol>';
          if (so.check){
            var hoyK = "nvPlanChk:" + p.id + ":" + new Date().toDateString(), marc = {};
            try { marc = JSON.parse(localStorage.getItem(hoyK) || "{}"); } catch(e){}
            h += '<div class="npl-h4">Checklist del día</div>' + lines(so.check).map(function(x, i){ return '<div class="npl-t' + (marc[i] ? " done" : "") + '"><button class="npl-ck' + (marc[i] ? " on" : "") + '" data-a="chk" data-id="' + p.id + '" data-i="' + i + '"></button><div class="tx"><span>' + esc(x) + '</span></div></div>'; }).join("");
          }
          if (so.notas) h += '<div class="npl-h4">Notas</div><div style="font-size:14.5px;line-height:1.5;white-space:pre-wrap">' + esc(so.notas) + '</div>';
        }
        var hist = (p.hist || []).slice(-4).reverse().map(function(x){ return cuando(x.at) + " " + (PEOPLE[x.por] || x.por || ""); }).join(" · ");
        h += '<div class="npl-foot"><span>' + (p.sopAt ? "Editado por " + esc(PEOPLE[p.sopPor] || p.sopPor || "") + " · " + cuando(p.sopAt) : "Sin editar todavía") + (hist ? '<br>Historial: ' + hist : "") + '</span><button class="npl-btn dark" data-a="sop-edit">Editar</button></div>';
      }
    }
    return h;
  }

  function vTarea(){
    var t = DB[V.tarea]; if (!t || t._b){ V.tarea = null; return vPaso(); }
    var p = DB[t.paso] || {};
    var h = '<button class="npl-back" data-a="t-volver">‹ ' + esc(p.nombre || "Volver") + '</button>' +
      '<div class="npl-title"><span style="flex:1">' + esc(t.texto) + '</span><button class="npl-ic" data-a="t-ren" data-id="' + t.id + '">✎</button></div>' +
      (t.link === "fichas" ? '<div class="npl-note" style="margin:0 0 6px"><a href="#" data-a="ir-fichas" style="color:#46618A;font-weight:500">Abrir fichas de proveedores →</a></div>' : "") +
      '<div class="npl-fld"><span>Responsable</span><span>' + personaSel("npl-tresp", t.resp || "", 'data-id="' + t.id + '"') + '</span></div>' +
      '<div class="npl-fld"><span>Fecha</span><span><input type="date" class="npl-sel npl-tfecha" data-id="' + t.id + '" value="' + esc(t.fecha || "") + '"></span></div>' +
      '<div class="npl-fld"><span>Estado</span><span><button class="npl-btn' + (t.hecha ? " on" : "") + '" data-a="t-ck" data-id="' + t.id + '">' + (t.hecha ? "✓ Lista" : "Pendiente · marcar lista") + '</button></span></div>' +
      '<div class="npl-h4">Comentarios</div>';
    var cs = t.coms || [];
    if (!cs.length) h += '<div class="npl-empty">Sin comentarios. Escribí @ para mencionar a Pau o a Euge.</div>';
    cs.forEach(function(c, i){
      h += '<div class="npl-c">' + av(c.por) + '<div class="b"><small>' + esc(PEOPLE[c.por] || c.por || "") + ' · ' + cuando(c.at) +
        (c.por === soy() ? ' · <a href="#" data-a="c-del" data-id="' + t.id + '" data-i="' + i + '" style="color:#A79B92">borrar</a>' : "") + '</small>' + conMenciones(c.txt) + '</div></div>';
    });
    h += '<div class="npl-quick"><input class="npl-in" id="nplCom" placeholder="Escribí un comentario… (@ para mencionar)" enterkeyhint="send"><button class="npl-btn dark" data-a="c-new" data-id="' + t.id + '">↑</button></div>' +
      '<div class="npl-sug" id="nplSug" style="display:none"><button data-a="men" data-v="Euge">' + av("euge") + 'Euge</button><button data-a="men" data-v="Pau">' + av("pau") + 'Pau</button></div>' +
      '<div class="npl-foot"><span>' + (t.mod ? "Último cambio: " + esc(PEOPLE[t.modPor] || t.modPor || "") + " · " + cuando(t.mod) : "") + '</span><button class="npl-btn" style="color:#B4533F" data-a="t-del" data-id="' + t.id + '">Eliminar tarea</button></div>';
    return h;
  }

  /* ---------- montaje ---------- */
  var ROOT = null, SEG = null;
  function montar(){
    var nv = N(), s = ST(), list0 = document.getElementById("list"), filt = document.getElementById("filters");
    var enTareas = s.tab === "tareas" && list0 && filt;
    if (!enTareas){
      document.body.classList.remove("npl-on");
      if (SEG && SEG.parentNode) SEG.remove();
      if (ROOT && ROOT.parentNode) ROOT.remove();
      return;
    }
    if (!SEG || !SEG.isConnected){
      SEG = document.createElement("div"); SEG.id = "nplSeg";
      SEG.innerHTML = '<button data-v="">Pendientes</button><button data-v="plan">Plan y SOPs</button>';
      SEG.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; V.vista = b.dataset.v; try { localStorage.setItem(LSV, V.vista); } catch(x){} montar(); if (V.vista) { pintar(); window.scrollTo(0,0); } });
      var sum = document.getElementById("summary");
      (sum || filt).parentNode.insertBefore(SEG, sum || filt);
    }
    [].forEach.call(SEG.children, function(b){ b.classList.toggle("on", (b.dataset.v || "") === (V.vista || "")); });
    if (V.vista === "plan"){
      document.body.classList.add("npl-on");
      if (!ROOT || !ROOT.isConnected){
        ROOT = document.createElement("div"); ROOT.id = "nplRoot";
        list0.parentNode.insertBefore(ROOT, list0.nextSibling);
        ROOT.addEventListener("click", onClick);
        ROOT.addEventListener("change", onChange);
        ROOT.addEventListener("keydown", onKey);
        ROOT.addEventListener("input", onInput);
        pintar();
      }
      if (!LOADED) leer();
    } else {
      document.body.classList.remove("npl-on");
      if (ROOT && ROOT.parentNode) ROOT.remove();
    }
  }
  function pintar(){
    if (!ROOT || !ROOT.isConnected) return;
    if (!LOADED){ ROOT.innerHTML = '<div class="npl-empty">Cargando el plan…</div>'; return; }
    ROOT.innerHTML = V.tarea ? vTarea() : V.paso ? vPaso() : vGeneral();
  }

  /* ---------- acciones ---------- */
  function pedir(msg, val){ var r = window.prompt(msg, val || ""); return r == null ? null : r.trim(); }
  function mover(arr, id, dir){
    var i = arr.findIndex(function(x){ return x.id === id; }), j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return;
    var a = arr[i]; arr[i] = arr[j]; arr[j] = a;
    arr.forEach(function(x, k){ x.orden = k + 1; });
    guardarVarios(arr).then(pintar); pintar();
  }
  function hoja(titulo, items){
    cerrarHoja();
    var sh = document.createElement("div"); sh.className = "npl-shade"; sh.id = "nplShade";
    var hj = document.createElement("div"); hj.className = "npl-sheet"; hj.id = "nplSheet";
    hj.innerHTML = '<div class="hd"></div>' + (titulo ? "<h5>" + esc(titulo) + "</h5>" : "") + items.map(function(it, i){ return '<button class="it' + (it.del ? " del" : "") + '" data-i="' + i + '"><i>' + (it.ic || "") + "</i>" + esc(it.t) + "</button>"; }).join("");
    sh.onclick = cerrarHoja;
    hj.onclick = function(e){ var b = e.target.closest("button.it"); if (!b) return; var it = items[+b.dataset.i]; cerrarHoja(); it.fn(); };
    document.body.appendChild(sh); document.body.appendChild(hj);
  }
  function cerrarHoja(){ ["nplShade","nplSheet"].forEach(function(id){ var x = document.getElementById(id); if (x) x.remove(); }); }

  function nuevaTarea(){
    var inp = document.getElementById("nplNew"); var tx = inp && inp.value.trim(); if (!tx) { inp && inp.focus(); return; }
    var ts = tareasDe(V.paso);
    var t = { t: "tarea", id: uid("t"), paso: V.paso, texto: tx, orden: (ts.length ? ts[ts.length - 1].orden : 0) + 1, hecha: false, resp: "", fecha: "", coms: [] };
    guardar(t, true).then(function(){ pintar(); var n = document.getElementById("nplNew"); if (n) n.focus(); }); pintar();
    var n2 = document.getElementById("nplNew"); if (n2) n2.focus();
  }
  function nuevoCom(id){
    var inp = document.getElementById("nplCom"); var tx = inp && inp.value.trim(); if (!tx) return;
    var t = DB[id]; t.coms = (t.coms || []).concat([{ por: soy(), at: Date.now(), txt: tx }]);
    guardar(t, true).then(pintar); pintar();
    var men = tx.match(/@(pau|euge|todas)/gi) || [];
    men.forEach(function(m){ var k = m.slice(1).toLowerCase(); (k === "todas" ? ["pau","euge"] : [k]).forEach(function(pp){ avisar(pp, "💬 Te mencionaron en Plan: " + t.texto, t.id); }); });
  }

  function onClick(e){
    var el = e.target.closest("[data-a]"); if (!el || !ROOT.contains(el)) return;
    var a = el.dataset.a, id = el.dataset.id, o = id ? DB[id] : null;
    if (!a) return;
    if (el.tagName === "A") e.preventDefault();
    switch (a){
      case "ordenar": V.ordenar = !V.ordenar; pintar(); break;
      case "abrir": V.paso = id; V.sub = "plan"; V.sopEdit = false; pintar(); window.scrollTo(0,0); break;
      case "volver": V.paso = null; pintar(); window.scrollTo(0,0); break;
      case "t-volver": V.tarea = null; pintar(); break;
      case "sub": V.sub = el.dataset.v; V.sopEdit = false; pintar(); break;
      case "e-new": { var n = pedir("Nombre de la nueva etapa"); if (!n) return; var es = etapas(); guardar({ t: "etapa", id: uid("e"), nombre: n, orden: (es.length ? es[es.length - 1].orden : 0) + 1 }).then(pintar); pintar(); break; }
      case "e-ren": { var n2 = pedir("Nuevo nombre de la etapa", o.nombre); if (!n2) return; o.nombre = n2; guardar(o).then(pintar); pintar(); break; }
      case "e-up": mover(etapas(), id, -1); break;
      case "e-down": mover(etapas(), id, 1); break;
      case "e-del": if (pasosDe(id).length){ toast("Primero mové o eliminá los pasos de esta etapa"); return; } if (confirm("¿Eliminar la etapa “" + o.nombre + "”?")) borrar(o); break;
      case "p-new": { var n3 = pedir("Nombre del nuevo paso"); if (!n3) return; var ps = pasosDe(id); var np = { t: "paso", id: uid("p"), etapa: id, nombre: n3, obj: "", orden: (ps.length ? ps[ps.length - 1].orden : 0) + 1, resp: "", sop: {} }; guardar(np).then(pintar); V.paso = np.id; V.sub = "plan"; pintar(); break; }
      case "p-ren": { var n4 = pedir("Nuevo nombre del paso", o.nombre); if (!n4) return; o.nombre = n4; guardar(o).then(pintar); pintar(); break; }
      case "p-obj": { var n5 = pedir("Objetivo de este paso", o.obj); if (n5 == null) return; o.obj = n5; guardar(o).then(pintar); pintar(); break; }
      case "p-up": mover(pasosDe(o.etapa), id, -1); break;
      case "p-down": mover(pasosDe(o.etapa), id, 1); break;
      case "p-mover": hoja("Mover “" + o.nombre + "” a…", etapas().filter(function(x){ return x.id !== o.etapa; }).map(function(x){ return { ic: "→", t: x.nombre, fn: function(){ var ps = pasosDe(x.id); o.etapa = x.id; o.orden = (ps.length ? ps[ps.length - 1].orden : 0) + 1; guardar(o).then(pintar); pintar(); } }; })); break;
      case "p-del": if (confirm("¿Eliminar el paso “" + o.nombre + "” y sus tareas?")){ tareasDe(id).forEach(function(t){ borrar(t); }); borrar(o); } break;
      case "t-ck": o.hecha = !o.hecha; o.hechaAt = o.hecha ? Date.now() : 0; o.hechaPor = o.hecha ? soy() : ""; guardar(o, true).then(pintar); pintar(); break;
      case "t-abrir": V.tarea = id; pintar(); window.scrollTo(0,0); break;
      case "t-new": nuevaTarea(); break;
      case "t-ren": { var n6 = pedir("Cambiar texto de la tarea", o.texto); if (!n6) return; o.texto = n6; guardar(o).then(pintar); pintar(); break; }
      case "t-del": if (confirm("¿Eliminar la tarea “" + o.texto + "”?")){ V.tarea = null; borrar(o); } break;
      case "t-menu": {
        var t = o, ts = tareasDe(t.paso);
        hoja(t.texto, [
          { ic: "👤", t: "Asignar a…", fn: function(){ hoja("Asignar a", ["euge","pau","dos",""].map(function(k){ return { ic: k ? "" : "–", t: k ? PEOPLE[k] : "Sin asignar", fn: function(){ t.resp = k; guardar(t).then(pintar); pintar(); if (k === "dos") { avisar("pau", "📋 Plan: " + t.texto, t.id); avisar("euge", "📋 Plan: " + t.texto, t.id); } else avisar(k, "📋 Plan: " + t.texto, t.id); } }; })); } },
          { ic: "📅", t: "Poner fecha / comentar", fn: function(){ V.tarea = t.id; pintar(); } },
          { ic: "↑", t: "Subir", fn: function(){ mover(ts, t.id, -1); } },
          { ic: "↓", t: "Bajar", fn: function(){ mover(ts, t.id, 1); } },
          { ic: "⇄", t: "Mover a otro paso", fn: function(){ hoja("Mover a…", list("paso").sort(function(a,b){ var ea = (DB[a.etapa]||{}).orden||0, eb = (DB[b.etapa]||{}).orden||0; return ea - eb || a.orden - b.orden; }).filter(function(x){ return x.id !== t.paso; }).map(function(x){ return { ic: "→", t: x.nombre, fn: function(){ var d = tareasDe(x.id); t.paso = x.id; t.orden = (d.length ? d[d.length - 1].orden : 0) + 1; guardar(t).then(pintar); pintar(); } }; })); } },
          { ic: "✎", t: "Cambiar texto", fn: function(){ var n7 = pedir("Cambiar texto de la tarea", t.texto); if (!n7) return; t.texto = n7; guardar(t).then(pintar); pintar(); } },
          { ic: "🗑", t: "Eliminar tarea", del: true, fn: function(){ if (confirm("¿Eliminar la tarea “" + t.texto + "”?")) borrar(t); } }
        ]); break;
      }
      case "ir-fichas": if (window.__nvFichasAbrir) window.__nvFichasAbrir(); break;
      case "c-new": nuevoCom(id); break;
      case "c-del": { var i = +el.dataset.i; if (!confirm("¿Borrar este comentario?")) return; o.coms.splice(i, 1); guardar(o, true).then(pintar); pintar(); break; }
      case "men": { var inp = document.getElementById("nplCom"); if (!inp) return; inp.value = inp.value.replace(/@\w*$/, "") + "@" + el.dataset.v + " "; inp.focus(); document.getElementById("nplSug").style.display = "none"; break; }
      case "sop-edit": V.sopEdit = true; pintar(); break;
      case "sop-cancel": V.sopEdit = false; pintar(); break;
      case "sop-save": {
        var p = DB[V.paso], g = function(x){ var n = document.getElementById(x); return n ? n.value.trim() : ""; };
        p.sop = { quien: g("sopQuien"), cuando: g("sopCuando"), conque: g("sopConque"), pasos: g("sopPasos"), check: g("sopCheck"), notas: g("sopNotas") };
        if (p.sopAt) p.hist = (p.hist || []).concat([{ at: p.sopAt, por: p.sopPor }]).slice(-10);
        p.sopAt = Date.now(); p.sopPor = soy(); V.sopEdit = false;
        guardar(p).then(pintar); pintar(); break;
      }
      case "chk": {
        var k = "nvPlanChk:" + id + ":" + new Date().toDateString(), m = {};
        try { m = JSON.parse(localStorage.getItem(k) || "{}"); } catch(x){}
        m[el.dataset.i] = !m[el.dataset.i]; try { localStorage.setItem(k, JSON.stringify(m)); } catch(x){}
        pintar(); break;
      }
    }
  }
  function onChange(e){
    var el = e.target, id = el.dataset.id, o = id && DB[id]; if (!o) return;
    if (el.classList.contains("npl-presp")){ o.resp = el.value; guardar(o).then(pintar); }
    if (el.classList.contains("npl-tresp")){ o.resp = el.value; guardar(o).then(pintar); if (o.resp === "dos"){ avisar("pau", "📋 Plan: " + o.texto, o.id); avisar("euge", "📋 Plan: " + o.texto, o.id); } else avisar(o.resp, "📋 Plan: " + o.texto, o.id); }
    if (el.classList.contains("npl-tfecha")){ o.fecha = el.value; guardar(o).then(pintar); }
  }
  function onKey(e){
    if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
    if (e.target.id === "nplNew"){ e.preventDefault(); nuevaTarea(); }
    if (e.target.id === "nplCom"){ e.preventDefault(); nuevoCom(V.tarea); }
  }
  function onInput(e){
    if (e.target.id !== "nplCom") return;
    var sg = document.getElementById("nplSug"); if (sg) sg.style.display = /@\w*$/.test(e.target.value) ? "flex" : "none";
  }

  /* ---------- ciclo ---------- */
  setInterval(montar, 600); setTimeout(montar, 200);
  setInterval(function(){ if (V.vista === "plan" && ROOT && ROOT.isConnected && !document.hidden && !document.getElementById("nplSheet")) leer(); }, 20000);
  document.addEventListener("visibilitychange", function(){ if (!document.hidden && V.vista === "plan" && ROOT && ROOT.isConnected) leer(); });
})();

/* ================= Proveedores → Fichas de proveedores (diseño Agenda) ================= */
(function(){
  if (window.__nvFichas) return; window.__nvFichas = 1;
  var TABLA = "fichas", LSV = "nvProvVista";
  var DB = {}, LOADED = false, BUSY = false, ROOT = null, SEG = null;
  var V = { vista: "fichas", id: null, q: "" };
  try { var lv = localStorage.getItem(LSV); if (lv !== null) V.vista = lv; } catch(e){}
  var CAMPOS = [
    ["contacto","Contacto","user"],["tel","Teléfono","tel"],["direccion","Dirección","map"],["ciudad","Ciudad / zona","pin"],["horario","Horario","clock"],
    ["transporte","Transporte para el retiro","truck"],["web","Web","globe"],["pago","Forma de pago","card"]
  ];
  var IC = {
    wa: '<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19.2z"/><path d="M9 9.5c.3 1.8 1.7 3.6 3.6 4.3l1.2-1 1.7.8"/>',
    tel: '<path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    map: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    pin: '<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    note: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 17h5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>'
  };
  function ic(n, cls){ return '<svg class="nfi-ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24">' + (IC[n] || IC.tag) + '</svg>'; }
  var PAL = [["#F4E7DF","#8A5440"],["#E8EFE4","#4C6A3E"],["#E6EDF6","#46618A"],["#F6EEDC","#8A6A2A"],["#EEE7F4","#6A4E86"],["#E3F0EE","#3C6E66"]];
  function col(n){ var h = 0; String(n || "").split("").forEach(function(c){ h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return PAL[h % PAL.length]; }

  function N(){ return window.__nv || {}; }
  function ST(){ return N().S || {}; }
  function soy(){ return (ST().soy || "").toLowerCase(); }
  function sb(){ return window.__sb; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function uid(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
  function toast(m){ var t = document.createElement("div"); t.className = "npl-toast"; t.textContent = m; document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2000); }
  function fichas(){ return Object.keys(DB).map(function(k){ return DB[k]; }).filter(function(o){ return !o._b; }).sort(function(a,b){ return String(a.nombre).localeCompare(String(b.nombre)); }); }
  function pedir(msg, val){ var r = window.prompt(msg, val || ""); return r == null ? null : r.trim(); }

  function guardar(o, quiet){
    o.mod = Date.now(); o.modPor = soy(); DB[o.id] = o;
    return sb().from("registros").upsert({ tabla: TABLA, id: o.id, data: o, borrado: false, actualizado: new Date().toISOString(), por: soy() || "nervo" }, { onConflict: "tabla,id" })
      .then(function(r){ if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; } if (!quiet) toast("Guardado"); });
  }
  function leer(){
    if (!sb() || BUSY) return Promise.resolve(); BUSY = true;
    return sb().from("registros").select("id,data,borrado").eq("tabla", TABLA).limit(2000).then(function(r){
      BUSY = false; if (r.error) return;
      var n = {}; (r.data || []).forEach(function(x){ var o = x.data || {}; o.id = x.id; if (x.borrado) o._b = 1; n[x.id] = o; });
      DB = n; var prim = !LOADED; LOADED = true;
      var a = document.activeElement; if (prim || !(a && ROOT && ROOT.contains(a) && /INPUT|TEXTAREA/.test(a.tagName))) pintar();
    }, function(){ BUSY = false; });
  }

  /* ---------- abierto / cerrado según el horario ---------- */
  var DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  function diaIdx(w){ w = w.toLowerCase().replace("miercoles","miércoles").replace("sabado","sábado"); for (var i = 0; i < 7; i++) if (w.indexOf(DIAS[i].slice(0,3)) === 0) return i; return -1; }
  function horario(h){
    h = String(h || "").toLowerCase(); if (!h) return null;
    var m = h.match(/(\d{1,2})(?:[:.](\d{2}))?\s*(?:hs|h)?\s*(?:a|-|–|al)\s*(\d{1,2})(?:[:.](\d{2}))?/); if (!m) return null;
    var ab = +m[1] + (+m[2] || 0) / 60, ci = +m[3] + (+m[4] || 0) / 60; if (ci <= ab) return null;
    var dias = [1,2,3,4,5];
    var r = h.match(/(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)[a-záé]*\s*(?:a|-|–|al)\s*(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)[a-záé]*/);
    if (r){ var a = diaIdx(r[1]), b = diaIdx(r[2]); if (a >= 0 && b >= 0){ dias = []; for (var i = a; ; i = (i + 1) % 7){ dias.push(i); if (i === b) break; } } }
    return { dias: dias, ab: ab, ci: ci };
  }
  function hh(x){ var H = Math.floor(x), M = Math.round((x - H) * 60); return H + (M ? ":" + String(M).padStart(2,"0") : "") + " h"; }
  function estadoAbierto(f){
    var H = horario(f.horario); if (!H) return null;
    var now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
    if (H.dias.indexOf(d) >= 0 && t >= H.ab && t < H.ci) return { on: true, t: "Abierto · cierra " + hh(H.ci) };
    for (var k = 0; k < 8; k++){
      var dd = (d + k) % 7; if (H.dias.indexOf(dd) < 0) continue;
      if (k === 0 && t >= H.ab) continue;
      return { on: false, t: "Abre " + (k === 0 ? "hoy" : k === 1 ? "mañana" : "el " + DIAS[dd]) + " " + hh(H.ab) };
    }
    return null;
  }
  function badge(f){ var e = estadoAbierto(f); return e ? '<span class="nfi-open ' + (e.on ? "on" : "") + '"><i></i>' + e.t + '</span>' : ""; }

  /* ---------- helpers ---------- */
  function telLimpio(t){ return String(t || "").replace(/\D/g, ""); }
  function extraDe(f, re){ var x = (f.extras || []).find(function(e){ return re.test(e.k || ""); }); return x ? x.v : ""; }
  function aliasDe(f){
    var a = extraDe(f, /alias/i); if (a) return a;
    var pv = ST().proveedores || [], n = String(f.nombre || "").toLowerCase().split(/\s+/)[0];
    var m = pv.find(function(p){ return n && String(p.proveedor || "").toLowerCase().indexOf(n) === 0; });
    return m && m.alias ? m.alias : "";
  }
  function copiar(t, msg){
    function viejo(){ var ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch(e){} ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(viejo); else viejo();
    toast(msg || "Copiado ✓");
  }
  function hoja(html, onReady){
    var sh = document.createElement("div"); sh.className = "npl-shade";
    var hj = document.createElement("div"); hj.className = "npl-sheet"; hj.innerHTML = '<div class="hd"></div>' + html;
    function cerrar(){ sh.remove(); hj.remove(); }
    sh.onclick = cerrar; document.body.appendChild(sh); document.body.appendChild(hj);
    if (onReady) onReady(hj, cerrar);
  }

  /* ---------- pedir retiro ---------- */
  var DEST = ["Datos del destinatario:", "Nervo Design", "Dirección: La Pampa 1895, Córdoba Capital, CP 5000.", "Teléfono: 3512124025", "Email: nervodesigncba@gmail.com"];
  function punto(s){ s = String(s || "").trim(); return s && !/[.!?]$/.test(s) ? s + "." : s; }
  function diaTxt(v){ if (!v) return ""; var d = new Date(v + "T12:00:00"); return DIAS[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1); }
  function textoRetiro(f, dia, bultos){
    var cu = extraDe(f, /cuit/i), ml = extraDe(f, /^mail/i), L = [];
    L.push("Solicito el retiro el día " + diaTxt(dia) + " en:", "");
    L.push(f.nombre + (cu ? " / CUIT/CUIL: " + cu : ""));
    if (f.direccion) L.push("Dirección: " + punto(f.direccion));
    if (f.horario) L.push("Horario: " + punto(f.horario));
    var ct = [f.contacto, f.tel].filter(Boolean).join(" · "); if (ct) L.push("Contacto: " + ct);
    if (ml) L.push("Email: " + ml);
    L.push("Cantidad de bultos: " + (bultos || ""), "");
    return L.concat(DEST).join("\n");
  }
  function retiro(f){
    var d = new Date(); d.setDate(d.getDate() + 1); while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    var dia = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    hoja('<h5 class="nfi-sh-t">Pedir retiro · ' + esc(f.nombre) + '</h5>' +
      '<div class="nfi-sh-row"><label>Día del retiro<input type="date" id="nfiDia" class="npl-in" value="' + dia + '"></label>' +
      '<label style="width:110px;flex:none">Bultos<input type="number" min="1" inputmode="numeric" id="nfiBul" class="npl-in" placeholder="—"></label></div>' +
      '<pre id="nfiTxt" class="nfi-pre"></pre>' +
      '<div class="nfi-sh-btns"><button class="npl-btn dark" id="nfiCop">Copiar</button><button class="npl-btn" id="nfiWa">Mandar por WhatsApp</button></div>',
      function(hj, cerrar){
        function txt(){ return textoRetiro(f, hj.querySelector("#nfiDia").value, hj.querySelector("#nfiBul").value.trim()); }
        function upd(){ hj.querySelector("#nfiTxt").textContent = txt(); }
        hj.addEventListener("input", upd); upd();
        hj.querySelector("#nfiCop").onclick = function(){ copiar(txt()); cerrar(); };
        hj.querySelector("#nfiWa").onclick = function(){ window.open("https://wa.me/?text=" + encodeURIComponent(txt()), "_blank"); cerrar(); };
      });
  }

  /* ---------- estilos ---------- */
  var CSS = [
    "body.nfi-on #list{display:none!important}",
    "#nfiSeg{display:flex;gap:6px;margin:4px 0 12px;font-family:Outfit,system-ui,sans-serif}",
    "#nfiSeg button{border:0;font:inherit;font-size:14px;padding:8px 15px;border-radius:999px;background:#F4F1EE;color:#7A6D64;cursor:pointer}",
    "#nfiSeg button.on{background:#2B211B;color:#fff}",
    "#nfiRoot{font-family:Outfit,system-ui,sans-serif;color:#241C17;max-width:640px;padding-bottom:120px}",
    "#nfiRoot *{box-sizing:border-box}",
    ".nfi-ic{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none;display:block}",
    ".nfi-top{display:flex;gap:10px;align-items:center;margin-bottom:6px}",
    ".nfi-q{flex:1;display:flex;align-items:center;gap:8px;background:#F7F5F3;border-radius:14px;padding:0 12px;color:#ABA097}",
    ".nfi-q input{flex:1;border:0;background:transparent;font:inherit;font-size:15px;padding:12px 0;color:#241C17;outline:none;min-width:0}",
    ".nfi-plus{width:44px;height:44px;border-radius:14px;background:#241C17;color:#fff;border:0;font-size:22px;cursor:pointer;flex:none}",
    ".nfi-it{display:flex;gap:13px;padding:14px 4px;border-bottom:1px solid #EFEBE7;align-items:center;cursor:pointer}",
    ".nfi-it:hover{background:#FCFBFA}",
    ".nfi-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:18px;flex:none}",
    ".nfi-it .bd{flex:1;min-width:0}",
    ".nfi-it b{font-weight:500;font-size:16px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nfi-it small{display:block;color:#7A6D64;font-size:13px;margin:2px 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nfi-open{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:3px 9px;border-radius:20px;background:#F3EFEB;color:#7A6D64}",
    ".nfi-open i{width:6px;height:6px;border-radius:50%;background:currentColor}",
    ".nfi-open.on{background:#E9F3EA;color:#3F7A4A}",
    ".nfi-wa{width:40px;height:40px;border-radius:50%;background:#E9F3EA;color:#3F7A4A;display:flex;align-items:center;justify-content:center;flex:none;text-decoration:none}",
    ".nfi-hero{background:linear-gradient(160deg,#5A4334,#3B2C23);color:#fff;padding:18px 20px 40px;border-radius:24px;position:relative}",
    ".nfi-hero .tp{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}",
    ".nfi-hero .tp button{border:0;background:rgba(255,255,255,.12);color:#fff;font:inherit;font-size:13.5px;padding:7px 12px;border-radius:999px;cursor:pointer}",
    ".nfi-hero .av{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;margin-bottom:12px}",
    ".nfi-hero h2{font-size:24px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em}",
    ".nfi-hero p{margin:0 0 10px;opacity:.78;font-size:14px}",
    ".nfi-hero .nfi-open{background:rgba(255,255,255,.14);color:#fff}.nfi-hero .nfi-open.on{background:#DDEFD9;color:#2F6A3A}",
    ".nfi-acts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:-26px 10px 0;position:relative}",
    ".nfi-acts a{background:#fff;border-radius:16px;box-shadow:0 6px 18px rgba(36,28,23,.10);padding:12px 4px 10px;text-align:center;font-size:12px;color:#7A6D64;display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;cursor:pointer}",
    ".nfi-acts a .nfi-ic{width:21px;height:21px;color:#5A4334}",
    ".nfi-acts a.wa .nfi-ic{color:#3F7A4A}",
    ".nfi-acts a.off{opacity:.4;pointer-events:none}",
    ".nfi-retiro{display:flex;align-items:center;gap:12px;margin:16px 0 0;padding:14px 16px;border-radius:18px;background:#F7F2EC;cursor:pointer;border:1px solid #EFE4D8}",
    ".nfi-retiro b{font-size:15px;font-weight:600;display:block}.nfi-retiro small{font-size:12.5px;color:#7A6D64}",
    ".nfi-retiro .go{margin-left:auto;background:#241C17;color:#fff;border-radius:999px;padding:8px 14px;font-size:13px}",
    ".nfi-retiro .nfi-ic{width:22px;height:22px;color:#5A4334}",
    ".nfi-lbl{margin:22px 4px 8px;font-size:12px;letter-spacing:.08em;color:#7A6D64;font-weight:500;text-transform:uppercase;display:flex;align-items:center}",
    ".nfi-lbl span{flex:1}",
    ".nfi-sec{border:1px solid #EFEBE7;border-radius:18px;padding:2px 16px;background:#fff}",
    ".nfi-f{display:flex;gap:13px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #F2EEEA;font-size:14.5px;cursor:pointer}",
    ".nfi-f:last-child{border-bottom:0}",
    ".nfi-f .nfi-ic{color:#ABA097;margin-top:1px}",
    ".nfi-f .bd{flex:1;min-width:0;word-break:break-word;line-height:1.4}",
    ".nfi-f small{display:block;color:#ABA097;font-size:11.5px;margin-bottom:1px}",
    ".nfi-f .vacio{color:#C9BFB6}",
    ".nfi-f .cp{border:1px solid #EFEBE7;background:#fff;border-radius:8px;font:inherit;font-size:12px;padding:4px 9px;color:#5A4334;cursor:pointer;flex:none}",
    ".nfi-tags{display:flex;flex-wrap:wrap;gap:7px}",
    ".nfi-tag{border:1px solid #EFEBE7;background:#fff;border-radius:999px;font:inherit;font-size:13.5px;padding:7px 13px;color:#241C17;cursor:pointer;text-align:left}",
    ".nfi-tag small{color:#7A6D64;font-size:11.5px;margin-left:4px}",
    ".nfi-tag.add{border-style:dashed;color:#7A6D64}",
    ".nfi-sh-t{font-size:17px!important;color:#241C17!important;font-weight:600!important;margin:4px 0 12px!important}",
    ".nfi-sh-row{display:flex;gap:10px;margin:0 0 12px}.nfi-sh-row label{flex:1;font-size:12.5px;color:#7A6D64}.nfi-sh-row .npl-in{width:100%;margin-top:4px}",
    ".nfi-pre{white-space:pre-wrap;background:#F7F5F3;border-radius:14px;padding:12px 14px;font:13.5px/1.5 Outfit,system-ui,sans-serif;margin:0 0 12px;color:#241C17}",
    ".nfi-sh-btns{display:flex;gap:8px}.nfi-sh-btns .npl-btn{flex:1;padding:12px;font-size:15px}",
    "@media (min-width:700px){.nfi-acts{margin:-26px 24px 0}}"
  ].join("");
  var st = document.createElement("style"); st.id = "nfi-css"; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- pantallas ---------- */
  function vLista(){
    var fs = fichas(), q = V.q.toLowerCase();
    if (q) fs = fs.filter(function(f){ return JSON.stringify(f).toLowerCase().indexOf(q) >= 0; });
    var h = '<div class="nfi-top"><label class="nfi-q">' + ic("search") + '<input id="nfiQ" placeholder="Buscar proveedor o producto…" value="' + esc(V.q) + '"></label><button class="nfi-plus" data-a="nuevo" title="Nuevo proveedor">+</button></div>';
    if (!LOADED) return h + '<div class="npl-empty">Cargando…</div>';
    if (!fs.length) h += '<div class="npl-empty">' + (q ? "No hay resultados." : "Todavía no hay fichas.") + '</div>';
    fs.forEach(function(f){
      var c = col(f.nombre), tel = telLimpio(f.tel);
      var sub = [f.contacto, (f.productos || []).slice(0,2).map(function(p){ return p.n; }).join(", ") || f.ciudad].filter(Boolean).join(" · ");
      h += '<div class="nfi-it" data-a="abrir" data-id="' + f.id + '"><div class="nfi-av" style="background:' + c[0] + ';color:' + c[1] + '">' + esc(String(f.nombre || "?").charAt(0).toUpperCase()) + '</div>' +
        '<div class="bd"><b>' + esc(f.nombre) + '</b><small>' + esc(sub) + '</small>' + badge(f) + '</div>' +
        (tel ? '<a class="nfi-wa" href="https://wa.me/' + tel + '" target="_blank" rel="noopener" title="WhatsApp" data-a="ext">' + ic("wa") + '</a>' : "") + '</div>';
    });
    return h;
  }
  function vFicha(){
    var f = DB[V.id]; if (!f || f._b){ V.id = null; return vLista(); }
    var tel = telLimpio(f.tel), al = aliasDe(f), c = col(f.nombre);
    var sub = [f.contacto, f.ciudad].filter(Boolean).join(" · ");
    var h = '<div class="nfi-hero"><div class="tp"><button data-a="volver">‹ Proveedores</button><button data-a="ren">Editar nombre</button></div>' +
      '<div class="av" style="background:' + c[0] + ';color:' + c[1] + '">' + esc(String(f.nombre || "?").charAt(0).toUpperCase()) + '</div>' +
      '<h2>' + esc(f.nombre) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : "") + badge(f) + '</div>' +
      '<div class="nfi-acts">' +
      '<a class="wa' + (tel ? "" : " off") + '" href="' + (tel ? "https://wa.me/" + tel : "#") + '" target="_blank" rel="noopener" data-a="ext">' + ic("wa") + 'WhatsApp</a>' +
      '<a class="' + (tel ? "" : "off") + '" href="' + (tel ? "tel:+" + tel : "#") + '" data-a="ext">' + ic("tel") + 'Llamar</a>' +
      '<a class="' + (f.direccion ? "" : "off") + '" href="' + (f.direccion ? "https://www.google.com/maps/search/" + encodeURIComponent(f.direccion) : "#") + '" target="_blank" rel="noopener" data-a="ext">' + ic("map") + 'Mapa</a>' +
      '<a class="' + (al ? "" : "off") + '" href="#" data-a="alias">' + ic("copy") + (al ? "Alias" : "Sin alias") + '</a></div>' +
      '<div class="nfi-retiro" data-a="retiro">' + ic("truck") + '<div><b>Pedir retiro</b><small>' + esc(f.transporte ? "Arma el mensaje para " + f.transporte : "Arma el mensaje para el transporte") + '</small></div><span class="go">Armar</span></div>';
    h += '<div class="nfi-lbl"><span>Datos</span></div><div class="nfi-sec">';
    CAMPOS.forEach(function(k){
      var v = f[k[0]] || "";
      h += '<div class="nfi-f" data-a="campo" data-k="' + k[0] + '">' + ic(k[2]) + '<div class="bd"><small>' + k[1] + '</small>' + (v ? esc(v) : '<span class="vacio">Agregar</span>') + '</div></div>';
    });
    (f.extras || []).forEach(function(x, i){
      var ico = /mail/i.test(x.k) ? "mail" : /alias|cuenta|cbu|mp/i.test(x.k) ? "card" : /tel/i.test(x.k) ? "tel" : "tag";
      h += '<div class="nfi-f" data-a="extra" data-i="' + i + '">' + ic(ico) + '<div class="bd"><small>' + esc(x.k) + '</small>' + esc(x.v) + '</div><button class="cp" data-a="cp" data-i="' + i + '">Copiar</button></div>';
    });
    h += '<div class="nfi-f" data-a="extra-new">' + ic("tag") + '<div class="bd vacio">+ Agregar otro dato (CUIT, mail, mínimo de compra…)</div></div></div>';
    var ps = f.productos || [];
    h += '<div class="nfi-lbl"><span>Productos que le compramos · ' + ps.length + '</span></div><div class="nfi-tags">' +
      ps.map(function(p, i){ return '<button class="nfi-tag" data-a="prod" data-i="' + i + '">' + esc(p.n) + (p.nota ? '<small>' + esc(p.nota.length > 30 ? p.nota.slice(0, 30) + "…" : p.nota) + '</small>' : "") + '</button>'; }).join("") +
      '<button class="nfi-tag add" data-a="prod-new">+ Producto</button></div>';
    h += '<div class="nfi-lbl"><span>Notas</span></div><textarea class="npl-ta" id="nfiNotas" placeholder="Lo que haya que recordar de este proveedor…">' + esc(f.notas || "") + '</textarea>' +
      '<div class="npl-foot"><span>' + (f.mod ? "Último cambio: " + esc(f.modPor === "pau" ? "Pau" : f.modPor === "euge" ? "Euge" : (f.modPor || "")) : "") + '</span><button class="npl-btn" style="color:#B4533F" data-a="del">Eliminar ficha</button></div>';
    return h;
  }
  function pintar(){
    if (!ROOT || !ROOT.isConnected) return;
    ROOT.innerHTML = V.id ? vFicha() : vLista();
  }

  /* ---------- acciones ---------- */
  function onClick(e){
    var el = e.target.closest("[data-a]"); if (!el || !ROOT.contains(el)) return;
    var a = el.dataset.a, f = V.id ? DB[V.id] : null, i = +el.dataset.i;
    if (a === "ext"){ e.stopPropagation(); return; }
    if (el.tagName === "A") e.preventDefault();
    switch (a){
      case "abrir": V.id = el.dataset.id; pintar(); window.scrollTo(0,0); break;
      case "volver": V.id = null; pintar(); window.scrollTo(0,0); break;
      case "retiro": retiro(f); break;
      case "alias": { var al = aliasDe(f); if (al) copiar(al, "Alias copiado: " + al); break; }
      case "cp": e.stopPropagation(); copiar(f.extras[i].v); break;
      case "nuevo": { var n = pedir("Nombre del proveedor"); if (!n) return; var o = { id: uid("f"), nombre: n, productos: [], extras: [], notas: "" }; guardar(o).then(pintar); V.id = o.id; pintar(); window.scrollTo(0,0); break; }
      case "ren": { var n2 = pedir("Nombre del proveedor", f.nombre); if (!n2) return; f.nombre = n2; guardar(f).then(pintar); pintar(); break; }
      case "campo": { var k = el.dataset.k, lab = (CAMPOS.find(function(c){ return c[0] === k; }) || [k, k])[1]; var v = pedir(lab, f[k]); if (v == null) return; f[k] = v; guardar(f).then(pintar); pintar(); break; }
      case "extra": { var x = f.extras[i]; var v2 = pedir(x.k + " (dejalo vacío para sacarlo)", x.v); if (v2 == null) return; if (!v2){ if (!confirm("¿Sacar el dato “" + x.k + "”?")) return; f.extras.splice(i, 1); } else x.v = v2; guardar(f).then(pintar); pintar(); break; }
      case "extra-new": { var k2 = pedir("Nombre del dato (ej: CUIT, Mail, Alias, Mínimo de compra)"); if (!k2) return; var v3 = pedir(k2); if (v3 == null) return; f.extras = (f.extras || []).concat([{ k: k2, v: v3 }]); guardar(f).then(pintar); pintar(); break; }
      case "prod-new": { var t = pedir("Producto que le compramos"); if (!t) return; f.productos = (f.productos || []).concat([{ n: t }]); guardar(f).then(pintar); pintar(); break; }
      case "prod": {
        var p = f.productos[i];
        hoja('<h5 class="nfi-sh-t">' + esc(p.n) + '</h5>' + (p.nota ? '<p style="margin:-6px 0 10px;color:#7A6D64;font-size:13.5px">' + esc(p.nota) + '</p>' : "") +
          '<button class="it" data-x="ed"><i>✎</i>Editar nombre o nota</button><button class="it del" data-x="del"><i>🗑</i>Sacar de la lista</button>',
          function(hj, cerrar){ hj.onclick = function(ev){ var b = ev.target.closest("button.it"); if (!b) return; cerrar();
            if (b.dataset.x === "ed"){ var t2 = pedir("Producto", p.n); if (!t2) return; var nt = pedir("Nota (precio, medida, color… opcional)", p.nota || ""); p.n = t2; if (nt != null) p.nota = nt; guardar(f).then(pintar); pintar(); }
            else { if (!confirm("¿Sacar “" + p.n + "” de la lista?")) return; f.productos.splice(i, 1); guardar(f).then(pintar); pintar(); } }; });
        break;
      }
      case "del": { if (!confirm("¿Eliminar la ficha de " + f.nombre + "?")) return; f._b = 1; V.id = null;
        sb().from("registros").update({ borrado: true, actualizado: new Date().toISOString(), por: soy() || "nervo" }).eq("tabla", TABLA).eq("id", f.id).then(function(){ toast("Eliminada"); pintar(); }); pintar(); break; }
    }
  }
  function onInput(e){ if (e.target.id === "nfiQ"){ V.q = e.target.value; var pos = e.target.selectionStart; pintar(); var q = document.getElementById("nfiQ"); if (q){ q.focus(); try { q.setSelectionRange(pos, pos); } catch(x){} } } }
  function onBlur(e){ if (e.target.id === "nfiNotas" && V.id){ var f = DB[V.id]; if (f && (f.notas || "") !== e.target.value){ f.notas = e.target.value; guardar(f); } } }

  function montar(){
    var s = ST(), list0 = document.getElementById("list");
    if (s.tab !== "provcat" || !list0){
      document.body.classList.remove("nfi-on");
      if (SEG && SEG.parentNode) SEG.remove(); if (ROOT && ROOT.parentNode) ROOT.remove(); return;
    }
    if (!SEG || !SEG.isConnected){
      SEG = document.createElement("div"); SEG.id = "nfiSeg";
      SEG.innerHTML = '<button data-v="fichas">Fichas</button><button data-v="">Grass · precios y stock</button>';
      SEG.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; V.vista = b.dataset.v; try { localStorage.setItem(LSV, V.vista); } catch(x){} montar(); window.scrollTo(0,0); });
      list0.parentNode.insertBefore(SEG, list0);
    }
    [].forEach.call(SEG.children, function(b){ b.classList.toggle("on", (b.dataset.v || "") === (V.vista || "")); });
    if (V.vista === "fichas"){
      document.body.classList.add("nfi-on");
      if (!ROOT || !ROOT.isConnected){
        ROOT = document.createElement("div"); ROOT.id = "nfiRoot"; list0.parentNode.insertBefore(ROOT, list0.nextSibling);
        ROOT.addEventListener("click", onClick); ROOT.addEventListener("input", onInput); ROOT.addEventListener("focusout", onBlur);
        pintar();
      }
      if (!LOADED) leer();
    } else {
      document.body.classList.remove("nfi-on"); if (ROOT && ROOT.parentNode) ROOT.remove();
    }
  }
  window.__nvFichasAbrir = function(){ V.vista = "fichas"; V.id = null; try { localStorage.setItem(LSV, "fichas"); } catch(x){} if (N().setTab) N().setTab("provcat"); setTimeout(montar, 50); window.scrollTo(0,0); };
  setInterval(montar, 600); setTimeout(montar, 250);
  setInterval(function(){ if (V.vista === "fichas" && ROOT && ROOT.isConnected && !document.hidden){ if (!V.id) pintar(); leer(); } }, 60000);
})();
