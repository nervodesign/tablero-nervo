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
    ".npl-card{border-radius:8px}.npl-btn{border-radius:8px}#nplSeg button{border-radius:8px}#nplSeg button.on{background:#5A4334}.npl-add{border-radius:8px}",
    ".npl-ck.on{background:#7E9E6C;border-color:#7E9E6C}.npl-ck.pr{border-color:#C98AA0;background:linear-gradient(90deg,#C98AA0 50%,#fff 50%)}",
    ".npl-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:12px}",
    ".npl-sum>div{background:#fff;border:1px solid #ECE7E2;border-radius:8px;padding:12px 14px}.npl-sum b{font-size:22px;font-weight:600;display:block;line-height:1.2}.npl-sum small{font-size:12px;color:#7A6D64}",
    ".npl-topbar{display:flex;justify-content:flex-end;margin:0 0 10px}",
    ".npl-week{background:#fff;border:1px solid #ECE7E2;border-radius:8px;padding:12px 14px;margin-bottom:16px}",
    ".npl-wh{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}.npl-wh b{font-size:15px;font-weight:600}.npl-wh small{color:#7A6D64;font-size:12.5px}",
    ".npl-wr{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #F3EFEB;font-size:14px}",
    ".npl-wr .tx{flex:1;min-width:0;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".npl-wr .f{font-size:12px;color:#7A6D64;white-space:nowrap}.npl-wr .f.late{color:#B4533F}",
    ".npl-ptag{font-size:11px;padding:2px 7px;border-radius:4px;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;display:inline-block}",
    ".npl-st{font-size:11px;padding:2px 7px;border-radius:4px;white-space:nowrap}.st-hacer{background:#F1EDE9;color:#7A6D64}.st-proceso{background:#F3E4EA;color:#8A4F65}.st-lista{background:#E2EBDB;color:#3F5E31}",
    ".npl-cols{display:grid;grid-template-columns:1fr;gap:18px}",
    ".npl-colh{display:flex;align-items:center;gap:6px;padding:7px 10px;border-radius:6px;margin-bottom:10px}.npl-colh b{flex:1;font-size:13.5px;font-weight:600}.npl-colh span{font-size:12.5px;font-weight:600}.npl-colh .npl-ic{color:inherit;opacity:.65}",
    ".npl-line{position:relative;padding-left:28px}.npl-line:before{content:'';position:absolute;left:10px;top:10px;bottom:10px;width:2px;background:#ECE7E2}",
    ".npl-node{position:relative;background:#fff;border:1px solid #ECE7E2;border-radius:8px;padding:10px 12px;margin-bottom:8px;cursor:pointer}.npl-node:hover{border-color:#D9D1C9}",
    ".npl-node .d{position:absolute;left:-27px;top:11px;width:20px;height:20px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1.5px #ECE7E2;font-size:9.5px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}",
    ".npl-node b{font-size:14px;font-weight:500;display:block;margin-bottom:7px}",
    ".npl-node .m{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#7A6D64}.npl-node .pg{flex:1;height:5px;border-radius:3px;background:#EEE9E4;overflow:hidden}.npl-node .pg i{display:block;height:100%}",
    ".npl-node .ord{display:flex;gap:2px;margin-top:6px}",
    "@media (min-width:900px){#nplRoot{max-width:1200px}.npl-cols{grid-template-columns:repeat(3,minmax(0,1fr))}}",
    "@media (max-width:640px){.npl-sum{grid-template-columns:repeat(2,minmax(0,1fr))}.npl-wr .npl-ptag,.npl-wr .npl-st{display:none}}",
    "@media (max-width:640px){.npl-title{font-size:20px}.npl-kv{grid-template-columns:80px 1fr}}"
  ].join("");
  var st = document.createElement("style"); st.id = "npl-css"; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- helpers de vista ---------- */
  function av(p){ p = p || ""; if (!PEOPLE[p]) return ""; return '<span class="npl-av av-' + p + '" title="' + PEOPLE[p] + '">' + (p === "dos" ? "P+E" : PEOPLE[p][0]) + '</span>'; }
  var ESTN = { hacer: "Para hacer", proceso: "En proceso", lista: "Completa" };
  function tEst(t){ return t.estado || (t.hecha ? "lista" : "hacer"); }
  var ECOL = [["#E2EBDB","#3F5E31","#7E9E6C"],["#F3E4EA","#8A4F65","#C98AA0"],["#ECE4DB","#5A4334","#9C8371"],["#E4ECF5","#46618A","#7F9CC4"],["#ECE7F3","#6A4E86","#A48CC4"]];
  function etCol(eid){ var i = etapas().findIndex(function(e){ return e.id === eid; }); return ECOL[(i < 0 ? 0 : i) % ECOL.length]; }
  function estado(p){
    var ts = tareasDe(p.id), h = ts.filter(function(t){ return tEst(t) === "lista"; }).length, pr = ts.filter(function(t){ return tEst(t) === "proceso"; }).length;
    if (ts.length && h === ts.length) return { c: "d-ok", t: "SOP listo", h: h, n: ts.length };
    if (h || pr || (p.sop && (p.sop.pasos || p.sop.quien))) return { c: "d-arm", t: "En armado", h: h, n: ts.length };
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
    var hechas = todas.filter(function(t){ return tEst(t) === "lista"; }).length, proc = todas.filter(function(t){ return tEst(t) === "proceso"; }).length;
    var pct = todas.length ? Math.round(hechas * 100 / todas.length) : 0;
    var sops = list("paso").filter(function(p){ return estado(p).c === "d-ok"; }).length;
    var h0 = new Date(); h0.setHours(0,0,0,0); var fin = new Date(h0.getFullYear(), 11, 31), dias = Math.max(0, Math.round((fin - h0) / 864e5));
    var h = '<div class="npl-sum"><div><b>' + pct + '%</b><small>' + hechas + ' de ' + todas.length + ' tareas listas</small></div><div><b>' + dias + ' días</b><small>para el 31/12</small></div><div><b>' + sops + '</b><small>SOPs terminados</small></div><div><b>' + proc + '</b><small>tareas en proceso</small></div></div>';
    var lim = new Date(h0.getTime() + 7 * 864e5);
    var sem = todas.filter(function(t){ var e = tEst(t); return e !== "lista" && ((t.fecha && new Date(t.fecha + "T00:00:00") <= lim) || e === "proceso"); })
      .sort(function(a, b){ return String(a.fecha || "9999").localeCompare(String(b.fecha || "9999")); });
    h += '<div class="npl-week"><div class="npl-wh"><b>Esta semana</b><small>' + (sem.length ? sem.length + (sem.length === 1 ? " tarea" : " tareas") : "") + '</small></div>';
    if (!sem.length) h += '<div class="npl-empty" style="padding:6px 0 2px">No hay tareas para esta semana. Poneles fecha o pasalas a "En proceso" y aparecen acá.</div>';
    sem.slice(0, 10).forEach(function(t){
      var e = tEst(t), p = DB[t.paso] || {}, c = etCol(p.etapa), late = t.fecha && vencida(t.fecha);
      h += '<div class="npl-wr"><button class="npl-ck' + (e === "proceso" ? " pr" : "") + '" data-a="t-ck" data-id="' + t.id + '"></button><span class="tx" data-a="t-abrir" data-id="' + t.id + '">' + esc(t.texto) + '</span>' +
        '<span class="npl-ptag" style="background:' + c[0] + ';color:' + c[1] + '">' + esc(p.nombre || "") + '</span><span class="npl-st st-' + e + '">' + ESTN[e] + '</span>' + av(t.resp) +
        '<span class="f' + (late ? " late" : "") + '">' + (t.fecha ? fechaTxt(t.fecha) : "") + '</span></div>';
    });
    h += '</div><div class="npl-topbar"><button class="npl-btn' + (V.ordenar ? " on" : "") + '" data-a="ordenar">' + (V.ordenar ? "Listo" : "Ordenar etapas y pasos") + '</button></div><div class="npl-cols">';
    var num = 0;
    etapas().forEach(function(e, i){
      var ps = pasosDe(e.id), c = etCol(e.id), ok = ps.filter(function(p){ return estado(p).c === "d-ok"; }).length;
      h += '<div><div class="npl-colh" style="background:' + c[0] + ';color:' + c[1] + '"><b>' + esc(e.nombre) + '</b><span>' + ok + '/' + ps.length + '</span>' +
        (V.ordenar ? '<button class="npl-ic" data-a="e-up" data-id="' + e.id + '">←</button><button class="npl-ic" data-a="e-down" data-id="' + e.id + '">→</button><button class="npl-ic del" data-a="e-del" data-id="' + e.id + '">🗑</button>' : "") +
        '<button class="npl-ic" data-a="e-ren" data-id="' + e.id + '" title="Cambiar nombre">✎</button></div><div class="npl-line">';
      ps.forEach(function(p){
        num++; var s = estado(p), pc = s.n ? Math.round(s.h * 100 / s.n) : 0;
        var dc = s.c === "d-no" ? "#D8D1CB" : c[2];
        h += '<div class="npl-node" data-a="' + (V.ordenar ? "" : "abrir") + '" data-id="' + p.id + '"><span class="d" style="background:' + dc + '">' + (s.c === "d-ok" ? "✓" : num) + '</span><b>' + esc(p.nombre) + '</b>' +
          '<div class="m"><div class="pg"><i style="width:' + pc + '%;background:' + c[2] + '"></i></div>' + s.h + '/' + s.n + av(p.resp) + '</div>' +
          (V.ordenar ? '<div class="ord"><button class="npl-ic" data-a="p-up" data-id="' + p.id + '">↑</button><button class="npl-ic" data-a="p-down" data-id="' + p.id + '">↓</button><button class="npl-ic" data-a="p-mover" data-id="' + p.id + '" title="Mover de etapa">⇄</button><button class="npl-ic del" data-a="p-del" data-id="' + p.id + '">🗑</button></div>' : "") + '</div>';
      });
      h += '</div><button class="npl-add" data-a="p-new" data-id="' + e.id + '">+ Paso</button></div>';
    });
    h += '</div><button class="npl-add" style="margin-top:22px" data-a="e-new">+ Nueva etapa</button>';
    return h;
  }

  function vPaso(){
    var p = DB[V.paso]; if (!p || p._b){ V.paso = null; return vGeneral(); }
    var ts = tareasDe(p.id), s = estado(p);
    var ec = etCol(p.etapa), et = DB[p.etapa] || {};
    var h = '<button class="npl-back" data-a="volver">‹ Plan</button>' + (et.nombre ? '<div><span class="npl-ptag" style="background:' + ec[0] + ';color:' + ec[1] + '">' + esc(et.nombre) + '</span></div>' : "") +
      '<div class="npl-title"><span style="flex:1">' + esc(p.nombre) + '</span><button class="npl-ic" data-a="p-ren" data-id="' + p.id + '">✎</button></div>' +
      '<p class="npl-obj" data-a="p-obj" data-id="' + p.id + '" style="cursor:pointer">' + (p.obj ? esc(p.obj) : '<span style="color:#A79B92">+ Agregar objetivo</span>') + '</p>' +
      '<div class="npl-row"><span class="npl-dot ' + s.c + '"></span><span style="font-size:13px;color:#7A6D64">' + s.t + '</span><span style="flex:1"></span>' +
      '<span style="font-size:13px;color:#7A6D64">Responsable</span>' + personaSel("npl-presp", p.resp || "", 'data-id="' + p.id + '"') + '</div>' +
      '<div class="npl-tabs"><button data-a="sub" data-v="plan" class="' + (V.sub === "plan" ? "on" : "") + '">Plan · ' + s.h + '/' + s.n + '</button><button data-a="sub" data-v="sop" class="' + (V.sub === "sop" ? "on" : "") + '">Cómo lo hacemos</button></div>';
    if (V.sub === "plan"){
      if (!ts.length) h += '<div class="npl-empty">Todavía no hay tareas. Escribí la primera abajo.</div>';
      ts.forEach(function(t){
        var nc = (t.coms || []).length;
        var te = tEst(t);
        h += '<div class="npl-t' + (te === "lista" ? " done" : "") + '"><button class="npl-ck' + (te === "lista" ? " on" : te === "proceso" ? " pr" : "") + '" data-a="t-ck" data-id="' + t.id + '" aria-label="Estado"></button>' +
          '<div class="tx" data-a="t-abrir" data-id="' + t.id + '"><span>' + esc(t.texto) + '</span>' +
          (t.link === "fichas" ? '<div class="npl-tm"><a href="#" data-a="ir-fichas" style="color:#46618A;text-decoration:none;font-weight:500">Abrir fichas de proveedores →</a></div>' : "") +
          ((t.resp || t.fecha || nc || te === "proceso") ? '<div class="npl-tm">' + (te === "proceso" ? '<span class="npl-st st-proceso">En proceso</span>' : "") + av(t.resp) + (t.fecha ? '<span class="' + (!t.hecha && vencida(t.fecha) ? "late" : "") + '">' + (t.hecha ? "" : "vence ") + fechaTxt(t.fecha) + '</span>' : "") + (nc ? '<span>💬 ' + nc + '</span>' : "") + '</div>' : "") +
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
      '<div class="npl-fld"><span>Estado</span><span style="display:flex;gap:6px;flex-wrap:wrap">' + ["hacer","proceso","lista"].map(function(k){ return '<button class="npl-btn' + (tEst(t) === k ? " on" : "") + '" data-a="t-est" data-v="' + k + '" data-id="' + t.id + '">' + ESTN[k] + '</button>'; }).join("") + '</span></div>' +
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
      case "t-ck": { var te0 = tEst(o); setEst(o, te0 === "hacer" ? "proceso" : te0 === "proceso" ? "lista" : "hacer"); break; }
      case "t-est": setEst(o, el.dataset.v); break;
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
  function setEst(o, e){ o.estado = e; o.hecha = e === "lista"; o.hechaAt = o.hecha ? Date.now() : 0; o.hechaPor = o.hecha ? soy() : ""; guardar(o, true).then(pintar); pintar(); }
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
  var PAL = [["#F3E4EA","#8A4F65"],["#E2EBDB","#3F5E31"],["#E4ECF5","#46618A"],["#ECE4DB","#5A4334"],["#ECE7F3","#6A4E86"],["#E0EEEB","#3C6E66"]];
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
  function hoja(html, onReady, modal){
    var sh = document.createElement("div"); sh.className = "npl-shade";
    var hj = document.createElement("div"); hj.className = "npl-sheet nfi-modal"; hj.innerHTML = html;
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
    "#nfiSeg{display:flex;gap:6px;margin:4px 0 14px;font-family:Outfit,system-ui,sans-serif}",
    "#nfiSeg button{border:0;font:inherit;font-size:14px;padding:8px 15px;border-radius:999px;background:#F4F1EE;color:#7A6D64;cursor:pointer}",
    "#nfiSeg button.on{background:#2B211B;color:#fff}",
    "#nfiSeg{flex-wrap:wrap}",
    ".nlu-hero{display:flex;gap:14px;align-items:center;padding:18px 20px;background:#F3E4EA;border:1px solid #EAD6DE;border-radius:10px;margin-bottom:18px}",
    ".nlu-av{width:50px;height:50px;border-radius:12px;background:#fff;display:grid;place-items:center;font-weight:700;font-size:22px;color:#8A4F65;border:1px solid #EAD6DE;flex:none}",
    ".nlu-h{font-size:21px;font-weight:700}.nlu-hero p{margin:2px 0 0;color:#6E5560;font-size:14px}",
    ".nlu-sec{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#7A6D64;font-weight:600;margin:6px 0 10px}.nlu-sec span{text-transform:none;letter-spacing:0;font-weight:400;color:#ABA097;margin-left:6px}",
    ".nlu-empty{padding:14px;border:1px dashed #E3DCD5;border-radius:9px;color:#7A6D64;font-size:14px;margin-bottom:20px}",
    ".nlu-msgs{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;margin-bottom:22px}.nlu-msg{min-width:0}",
    ".nlu-msg{display:flex;gap:12px;align-items:center;padding:11px 13px;border:1px solid #EFEBE7;border-radius:9px;background:#fff}",
    ".nlu-dot{width:34px;height:34px;border-radius:8px;display:grid;place-items:center;font-size:16px;flex:none}",
    ".nlu-msg .t{flex:1;min-width:0;font-size:14.5px;line-height:1.35}.nlu-msg .t small{display:block;color:#7A6D64;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nlu-msg .bt{display:flex;gap:6px;flex:none}",
    ".nlu-btn{padding:8px 12px;border-radius:7px;font:inherit;font-size:13.5px;font-weight:500;border:1px solid #E3DCD5;background:#fff;color:#2A211C;white-space:nowrap;cursor:pointer}",
    ".nlu-btn.dk{background:#5A4334;color:#fff;border-color:#5A4334}.nlu-btn.pk{background:#8A4F65;color:#fff;border-color:#8A4F65}.nlu-btn.ghost{padding:8px 10px;color:#7A6D64}",
    ".nlu-cols{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}",
    ".nlu-col{border-radius:9px;padding:10px;min-width:0}.nlu-col.vac{opacity:.75}",
    ".nlu-ch{font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.nlu-ch em{font-style:normal;font-weight:500;font-size:12px;background:#fff;border-radius:20px;padding:1px 8px;color:#7A6D64}",
    ".nlu-card{background:#fff;border-radius:7px;padding:8px 10px;margin-bottom:6px;font-size:13px;cursor:pointer;min-width:0}.nlu-card.mas{color:#7A6D64;cursor:default}",
    ".nlu-card b{display:block;font-size:13.5px;font-weight:600}.nlu-card span,.nlu-card small{display:block;color:#7A6D64;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nlu-card small{font-size:11.5px;color:#8A4F65}",
    ".nlu-det{font-size:14.5px;line-height:1.5;background:#FAF8F6;border-radius:8px;padding:10px 12px;max-height:180px;overflow:auto}",
    ".nlu-mini{font-size:13px;color:#7A6D64;margin-top:8px}",
    ".nlu-steps{display:flex;flex-wrap:wrap;gap:6px}",
    ".nlu-step{display:flex;align-items:center;gap:6px;border:1px solid #E3DCD5;background:#fff;border-radius:8px;padding:9px 12px;font:inherit;font-size:14px;cursor:pointer;color:#2A211C}",
    ".nlu-step i{font-style:normal;font-size:11px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.06);display:grid;place-items:center}",
    ".nlu-tipo{margin-top:12px;font-size:12.5px;color:#7A6D64;display:flex;flex-wrap:wrap;gap:6px;align-items:center}",
    ".nlu-tipo button{border:1px solid #E3DCD5;background:#fff;border-radius:7px;padding:6px 10px;font:inherit;font-size:12.5px;color:#7A6D64;cursor:pointer}.nlu-tipo button.on{background:#F3E4EA;border-color:#EAD6DE;color:#8A4F65}",
    "@media (max-width:640px){.nlu-msg{flex-wrap:wrap}.nlu-msg .t{flex:1 1 calc(100% - 50px)}.nlu-msg .bt{width:100%;padding-left:0;box-sizing:border-box;flex-wrap:wrap}.nlu-msg .bt .nlu-btn:not(.ghost){flex:1}}",
    "@media (min-width:700px){.nlu-cols{grid-template-columns:repeat(3,minmax(0,1fr))}}",
    "@media (min-width:1150px){.nlu-cols{grid-template-columns:repeat(6,minmax(0,1fr))}}",
    ".nlu-av{overflow:hidden;border-radius:50%!important;border:3px solid #fff!important;box-shadow:0 4px 14px rgba(138,79,101,.18);width:58px!important;height:58px!important}",
    ".nlu-av img{width:100%;height:100%;object-fit:cover;display:block;animation:nluResp 4s ease-in-out infinite;transform-origin:50% 90%}",
    "@keyframes nluResp{0%,100%{transform:translateY(0) rotate(0) scale(1.04)}30%{transform:translateY(-3%) rotate(-2deg) scale(1.06)}60%{transform:translateY(1%) rotate(1.5deg) scale(1.04)}}",
    "@media (prefers-reduced-motion:reduce){.nlu-av img{animation:none}}",
    ".nlu-rut{border:1px solid #EFEBE7;border-radius:10px;background:#fff;padding:14px 16px;margin-bottom:22px}",
    ".nlu-sal{font-size:16px;font-weight:600;margin-bottom:6px}",
    ".nlu-rut ul{margin:0 0 4px;padding-left:20px;font-size:14.5px;line-height:1.55;color:#3A2E27}",
    ".nlu-tar{margin-top:10px;padding-top:10px;border-top:1px solid #F4F0EC}.nlu-tar b{display:block;font-size:13.5px;font-weight:600;color:#8A4F65;margin-bottom:6px}",
    ".nlu-tr{display:flex;align-items:center;gap:8px;font-size:14px;padding:5px 0;cursor:pointer;min-width:0}.nlu-tr em{font-style:normal;font-size:11.5px;color:#ABA097;white-space:nowrap}",
    ".nlu-tr .p{width:8px;height:8px;border-radius:50%;background:#DCD3CB;flex:none}.nlu-tr .p-alta{background:#8A4F65}.nlu-tr .p-media{background:#C98AA0}",
    "#nfiRoot{font-family:Outfit,system-ui,sans-serif;color:#241C17;max-width:980px;padding-bottom:120px}",
    "#nfiRoot *{box-sizing:border-box}",
    ".nfi-ic{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none;display:block}",
    ".nfi-top{display:flex;gap:10px;align-items:center;margin-bottom:14px;max-width:640px}",
    ".nfi-q{flex:1;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #EFEBE7;border-radius:14px;padding:0 12px;color:#ABA097}",
    ".nfi-q input{flex:1;border:0;background:transparent;font:inherit;font-size:15px;padding:12px 0;color:#241C17;outline:none;min-width:0}",
    ".nfi-plus{width:46px;height:46px;border-radius:14px;background:#241C17;color:#fff;border:0;font-size:22px;cursor:pointer;flex:none}",
    ".nfi-list{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;max-width:100%}.nfi-list>*{min-width:0;max-width:100%;box-sizing:border-box}",
    ".nfi-it{display:flex;gap:13px;padding:14px;border:1px solid #EFEBE7;border-radius:10px;background:#fff;align-items:center;cursor:pointer;transition:transform .15s,box-shadow .15s}",
    ".nfi-it:hover{box-shadow:0 8px 22px rgba(36,28,23,.07);transform:translateY(-1px)}",
    ".nfi-av{width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:19px;flex:none}",
    ".nfi-it .bd{flex:1;min-width:0}",
    ".nfi-pv{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.nfi-pv .nfi-open{margin:0}",
    ".nfi-pv .ch{display:inline-flex;align-items:center;font-size:12px;font-weight:500;padding:3px 9px;border-radius:6px;white-space:nowrap}",
    ".nfi-it b{font-weight:600;font-size:16px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nfi-it small{display:block;color:#7A6D64;font-size:13px;margin:2px 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nfi-open{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:3px 9px;border-radius:20px;background:#F3EFEB;color:#7A6D64}",
    ".nfi-open{white-space:nowrap}",
    ".nfi-open i{width:6px;height:6px;border-radius:50%;background:currentColor}",
    ".nfi-open.on{background:#E3F0DF;color:#3F7A4A}",
    ".nfi-wa{width:42px;height:42px;border-radius:50%;background:#E3F0DF;color:#3F7A4A;display:flex;align-items:center;justify-content:center;flex:none;text-decoration:none}",
    ".nfi-back{border:0;background:transparent;font:inherit;font-size:14px;color:#7A6D64;padding:2px 0 10px;cursor:pointer}",
    ".nfi-ficha{background:#fff;border-radius:14px;box-shadow:0 14px 40px rgba(36,28,23,.08);border:1px solid #F0EBE6;overflow:hidden}",
    ".nfi-hero{padding:22px 22px 18px}",
    ".nfi-hr{display:flex;gap:16px;align-items:center}",
    ".nfi-hr .av{width:68px;height:68px;border-radius:12px;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-size:27px;font-weight:700;flex:none}",
    ".nfi-hr .nm{flex:1;min-width:0}",
    ".nfi-name{font-size:25px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin:0 0 3px}",
    ".nfi-hr p{margin:0 0 8px;font-size:14px;opacity:.8}",
    ".nfi-hr .nfi-open{background:rgba(255,255,255,.7);color:inherit}.nfi-hr .nfi-open.on{background:#fff;color:#3F7A4A}",
    ".nfi-edit{align-self:flex-start;border:0;background:rgba(255,255,255,.6);color:inherit;font:inherit;font-size:13px;padding:7px 12px;border-radius:8px;cursor:pointer}",
    ".nfi-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}",
    ".nfi-act{display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:8px;padding:9px 15px 9px 12px;font-size:14px;font-weight:500;text-decoration:none;color:#241C17;box-shadow:0 2px 8px rgba(36,28,23,.06);cursor:pointer}",
    ".nfi-act.wa{background:#2F6A3A;color:#fff}",
    ".nfi-act.off{background:transparent;box-shadow:none;border:1.5px dashed rgba(36,28,23,.18);color:rgba(36,28,23,.4);pointer-events:none}",
    ".nfi-body{display:grid;grid-template-columns:1fr;gap:18px;padding:18px}",
    ".nfi-col{min-width:0;display:flex;flex-direction:column;gap:16px}",
    ".nfi-lbl{margin:0 2px 8px;font-size:12px;letter-spacing:.08em;font-weight:600;text-transform:uppercase}",
    ".nfi-sec{border:1px solid #EFEBE7;border-radius:10px;padding:4px 14px;background:#fff}",
    ".nfi-f{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #F4F0EC;font-size:14.5px;cursor:pointer}",
    ".nfi-f:last-child{border-bottom:0}",
    ".nfi-f .ib{width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex:none}",
    ".nfi-f .ib .nfi-ic{width:17px;height:17px}",
    ".nfi-f .bd{flex:1;min-width:0;word-break:break-word;line-height:1.35}",
    ".nfi-f small{display:block;color:#ABA097;font-size:11.5px;margin-bottom:1px}",
    ".nfi-f .vacio{color:#C9BFB6}",
    ".nfi-f .cp{border:1px solid #EFEBE7;background:#fff;border-radius:9px;font:inherit;font-size:12px;padding:5px 10px;color:#5A4334;cursor:pointer;flex:none}",
    ".nfi-retiro{display:flex;align-items:center;gap:12px;padding:16px;border-radius:10px;background:#F3E4EA;color:#8A4F65;cursor:pointer}",
    ".nfi-retiro .ib{width:42px;height:42px;border-radius:8px;background:rgba(255,255,255,.65);display:flex;align-items:center;justify-content:center;flex:none}",
    ".nfi-retiro b{font-size:15.5px;font-weight:600;display:block}.nfi-retiro small{font-size:12.5px;opacity:.85}",
    ".nfi-retiro .go{margin-left:auto;background:#8A4F65;color:#fff;border-radius:8px;padding:9px 15px;font-size:13.5px;font-weight:500;flex:none}",
    ".nfi-box{border-radius:10px;padding:14px}",
    ".nfi-prod{background:#EEF3E9;color:#3F5E31}",
    ".nfi-ped{background:#fff;border:1px solid #EFEBE7;color:#5A4334}",
    ".nfi-ped .hd{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}.nfi-ped .hd .nfi-lbl{margin:0;flex:1}",
    ".nfi-ped .debe{font-size:13px;font-weight:600;color:#8A4F65;background:#F3E4EA;padding:3px 9px;border-radius:6px}.nfi-ped .debe.ok{color:#3F5E31;background:#E2EBDB}",
    ".nfi-pd{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 0;border-top:1px solid #F2EEEA;cursor:pointer}",
    ".nfi-pd b{font-size:14px;font-weight:500;color:#241C17;line-height:1.4}",
    ".nfi-det{white-space:pre-wrap;background:#F7F5F3;border-radius:8px;padding:12px 14px;font-size:14.5px;line-height:1.55;margin:0 0 12px;max-height:45vh;overflow:auto;color:#241C17}",
    ".nfi-pd .mt{font-size:14px;font-weight:600;color:#241C17;text-align:right}",
    ".nfi-pd small{font-size:12px;color:#7A6D64}.nfi-pd small.r{text-align:right}",
    ".nfi-est{display:inline-block;font-size:11px;padding:1px 7px;border-radius:4px;margin-right:6px}",
    ".e-espera{background:#F1EDE9;color:#7A6D64}.e-curso{background:#F3E4EA;color:#8A4F65}.e-entregado{background:#E2EBDB;color:#3F5E31}",
    ".nfi-ped .acc{display:flex;gap:8px;margin-top:10px}.nfi-ped .acc button{flex:1;border:1px solid #EFEBE7;background:#fff;border-radius:8px;font:inherit;font-size:13.5px;padding:9px;cursor:pointer;color:#241C17}.nfi-ped .acc button.dk{background:#5A4334;border-color:#5A4334;color:#fff}",
    ".nfi-tags{display:flex;flex-wrap:wrap;gap:7px}",
    ".nfi-tag{border:0;background:#fff;border-radius:6px;font:inherit;font-size:13.5px;padding:8px 13px;color:#241C17;cursor:pointer;text-align:left;box-shadow:0 1px 3px rgba(0,0,0,.04)}",
    ".nfi-tag small{color:#7A6D64;font-size:11.5px;margin-left:4px}",
    ".nfi-tag.add{background:transparent;border:1.5px dashed #A9BE9B;border-radius:6px;color:#3F5E31;box-shadow:none}",
    ".nfi-notas{background:#F4EFEA;color:#5A4334}",
    ".nfi-notas textarea{width:100%;border:0;background:rgba(255,255,255,.75);border-radius:8px;padding:11px 12px;font:inherit;font-size:14.5px;line-height:1.5;min-height:96px;resize:vertical;color:#241C17;outline:none}",
    ".nfi-foot{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:#ABA097;gap:10px;padding:0 4px}",
    ".nfi-foot button{border:0;background:transparent;font:inherit;font-size:13px;color:#B4533F;cursor:pointer;padding:6px 0}",
    ".nfi-sh-t{font-size:17px!important;color:#241C17!important;font-weight:600!important;margin:4px 0 12px!important}",
    ".nfi-sh-row{display:flex;gap:10px;margin:0 0 12px}.nfi-sh-row label{flex:1;font-size:12.5px;color:#7A6D64}.nfi-sh-row .npl-in{width:100%;margin-top:4px}",
    ".nfi-pre{white-space:pre-wrap;background:#F7F5F3;border-radius:14px;padding:12px 14px;font:13.5px/1.5 Outfit,system-ui,sans-serif;margin:0 0 12px;color:#241C17}",
    ".nfi-fl{display:block;font-size:12.5px;color:#7A6D64;margin:0 0 12px}.nfi-fl .npl-ta{display:block;margin-top:4px;min-height:200px;font-size:15px}",
    ".npl-sheet.nfi-modal{top:50%;bottom:auto;left:50%;right:auto;transform:translate(-50%,-50%);width:min(680px,94vw);max-width:none;max-height:90vh;overflow:auto;border-radius:12px;padding:18px 20px calc(18px + env(safe-area-inset-bottom));margin:0}",
    ".nfi-modal *{box-sizing:border-box}.nfi-modal .npl-ta,.nfi-modal .npl-in{width:100%;max-width:100%}",
    ".nfi-mh{display:flex;align-items:center;gap:8px;margin-bottom:14px}",
    ".nfi-sh-row select.npl-in{width:100%;margin-top:4px;padding:10px}",
    ".nfi-pgs{border:1px solid #EFEBE7;border-radius:8px;padding:4px 12px;margin-bottom:10px}",
    ".nfi-pgr{display:grid;grid-template-columns:60px 1fr 60px 30px;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid #F4F0EC;font-size:14px}",
    ".nfi-pgt{font-size:13px;color:#7A6D64;padding:8px 0 4px}",
    ".nfi-pgadd label{min-width:0}",
    "@media (max-width:560px){.nfi-sh-row{flex-wrap:wrap}.nfi-sh-row label{flex:1 1 40%}}",
    ".nfi-sh-btns{display:flex;gap:8px}.nfi-sh-btns .npl-btn{flex:1;padding:12px;font-size:15px}",
    "@media (min-width:760px){.nfi-list{grid-template-columns:repeat(2,minmax(0,1fr))}.nfi-body{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);padding:22px;gap:22px}.nfi-hero{padding:26px 26px 22px}}",
    "@media (min-width:1300px){#nfiRoot{max-width:1060px}}"
  ].join("");
  var st = document.createElement("style"); st.id = "nfi-css"; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- pantallas ---------- */
  function vLista(){
    var fs = fichas(), q = V.q.toLowerCase();
    if (q) fs = fs.filter(function(f){ return JSON.stringify(f).toLowerCase().indexOf(q) >= 0; });
    var h = '<div class="nfi-top"><label class="nfi-q">' + ic("search") + '<input id="nfiQ" placeholder="Buscar proveedor o producto…" value="' + esc(V.q) + '"></label><button class="nfi-plus" data-a="nuevo" title="Nuevo proveedor">+</button></div>';
    if (!LOADED) return h + '<div class="npl-empty">Cargando…</div>';
    if (!fs.length) h += '<div class="npl-empty">' + (q ? "No hay resultados." : "Todavía no hay fichas.") + '</div>';
    h += '<div class="nfi-list">';
    fs.forEach(function(f){
      var c = col(f.nombre), tel = telLimpio(f.tel);
      var sub = [f.contacto, (f.productos || []).slice(0,2).map(function(p){ return p.n; }).join(", ") || f.ciudad].filter(Boolean).join(" · ");
      h += '<div class="nfi-it" data-a="abrir" data-id="' + f.id + '"><div class="nfi-av" style="background:' + c[0] + ';color:' + c[1] + '">' + esc(String(f.nombre || "?").charAt(0).toUpperCase()) + '</div>' +
        '<div class="bd"><b>' + esc(f.nombre) + '</b><small>' + esc(sub) + '</small><div class="nfi-pv">' + badge(f) + prevPed(f) + '</div></div>' +
        (tel ? '<a class="nfi-wa" href="https://wa.me/' + tel + '" target="_blank" rel="noopener" title="WhatsApp" data-a="ext">' + ic("wa") + '</a>' : "") + '</div>';
    });
    h += '</div>';
    return h;
  }
  function prevPed(f){
    var pv = provDe(f); if (!pv) return "";
    var ds = pedidosDe(pv), ab = ds.filter(function(d){ return etapaDe(pv, d) !== "deposito"; }), debe = ds.reduce(function(a, d){ return a + Math.max(0, (+d.total || 0) - pagado(d)); }, 0);
    if (!ds.length) return "";
    var h = "";
    if (ab.length){ var e = etapaDe(pv, ab[0]), c = ECO[e] || ECO.pedido; h += '<span class="ch" style="background:' + c[0] + ';color:' + c[1] + '">📦 ' + (ab.length === 1 ? "1 pedido · " + ETQ[e] : ab.length + " pedidos en curso") + '</span>'; }
    h += debe ? '<span class="ch" style="background:#F3E4EA;color:#8A4F65">Se debe ' + plata(debe) + '</span>' : '<span class="ch" style="background:#E2EBDB;color:#3F5E31">Al día ✓</span>';
    var v = ab.filter(function(d){ return d.vence && Math.max(0, (+d.total || 0) - pagado(d)); }).map(function(d){ return d.vence; }).sort()[0];
    if (v) h += '<span class="ch" style="background:#ECE4DB;color:#5A4334">Vence ' + fcorta(v) + '</span>';
    return h;
  }
  var TINT = { user:["#E3EDDC","#3F5E31"], tel:["#E3EDDC","#3F5E31"], map:["#F3E4EA","#8A4F65"], pin:["#F3E4EA","#8A4F65"], clock:["#ECE4DB","#5A4334"], truck:["#ECE4DB","#5A4334"], globe:["#E4ECF5","#46618A"], card:["#E4ECF5","#46618A"], mail:["#EEE7F4","#6A4E86"], tag:["#F3EFEB","#7A6D64"] };
  function ib(n){ var t = TINT[n] || TINT.tag; return '<span class="ib" style="background:' + t[0] + ';color:' + t[1] + '">' + ic(n) + '</span>'; }
  function vFicha(){
    var f = DB[V.id]; if (!f || f._b){ V.id = null; return vLista(); }
    var tel = telLimpio(f.tel), al = aliasDe(f), c = col(f.nombre);
    var sub = [f.contacto, f.ciudad].filter(Boolean).join(" · ");
    var h = '<button class="nfi-back" data-a="volver">‹ Todos los proveedores</button><div class="nfi-ficha">' +
      '<div class="nfi-hero" style="background:' + c[0] + ';color:' + c[1] + '"><div class="nfi-hr">' +
      '<div class="av">' + esc(String(f.nombre || "?").charAt(0).toUpperCase()) + '</div>' +
      '<div class="nm"><div class="nfi-name">' + esc(f.nombre) + '</div>' + (sub ? '<p>' + esc(sub) + '</p>' : "") + badge(f) + '</div>' +
      '<button class="nfi-edit" data-a="ren" title="Cambiar nombre">✎</button></div>' +
      '<div class="nfi-acts">' +
      '<a class="nfi-act wa' + (tel ? "" : " off") + '" href="' + (tel ? "https://wa.me/" + tel : "#") + '" target="_blank" rel="noopener" data-a="ext">' + ic("wa") + 'WhatsApp</a>' +
      '<a class="nfi-act' + (tel ? "" : " off") + '" href="' + (tel ? "tel:+" + tel : "#") + '" data-a="ext">' + ic("tel") + 'Llamar</a>' +
      '<a class="nfi-act' + (f.direccion ? "" : " off") + '" href="' + (f.direccion ? "https://www.google.com/maps/search/" + encodeURIComponent(f.direccion) : "#") + '" target="_blank" rel="noopener" data-a="ext">' + ic("map") + 'Mapa</a>' +
      '<a class="nfi-act' + (al ? "" : " off") + '" href="#" data-a="alias">' + ic("copy") + (al ? "Copiar alias" : "Sin alias") + '</a></div></div>';
    h += '<div class="nfi-body"><div class="nfi-col"><div><div class="nfi-lbl" style="color:#7A6D64">Datos</div><div class="nfi-sec">';
    CAMPOS.forEach(function(k){
      var v = f[k[0]] || "";
      h += '<div class="nfi-f" data-a="campo" data-k="' + k[0] + '">' + ib(k[2]) + '<div class="bd"><small>' + k[1] + '</small>' + (v ? esc(v) : '<span class="vacio">Agregar</span>') + '</div></div>';
    });
    (f.extras || []).forEach(function(x, i){
      var n = /mail/i.test(x.k) ? "mail" : /alias|cuenta|cbu|mp/i.test(x.k) ? "card" : /tel/i.test(x.k) ? "tel" : "tag";
      h += '<div class="nfi-f" data-a="extra" data-i="' + i + '">' + ib(n) + '<div class="bd"><small>' + esc(x.k) + '</small>' + esc(x.v) + '</div><button class="cp" data-a="cp" data-i="' + i + '">Copiar</button></div>';
    });
    h += '<div class="nfi-f" data-a="extra-new">' + ib("tag") + '<div class="bd vacio">+ Agregar otro dato (CUIT, mail, mínimo…)</div></div></div></div></div>';
    h += '<div class="nfi-col"><div class="nfi-retiro" data-a="retiro"><span class="ib">' + ic("truck") + '</span><div><b>Pedir retiro</b><small>' + esc(f.transporte ? "Mensaje listo para " + f.transporte : "Mensaje listo para el transporte") + '</small></div><span class="go">Armar</span></div>';
    h += vPedidos(f);
    var ps = f.productos || [];
    h += '<div class="nfi-box nfi-prod"><div class="nfi-lbl">Productos que le compramos · ' + ps.length + '</div><div class="nfi-tags">' +
      ps.map(function(p, i){ return '<button class="nfi-tag" data-a="prod" data-i="' + i + '">' + esc(p.n) + (p.nota ? '<small>' + esc(p.nota.length > 28 ? p.nota.slice(0, 28) + "…" : p.nota) + '</small>' : "") + '</button>'; }).join("") +
      '<button class="nfi-tag add" data-a="prod-new">+ Producto</button></div></div>';
    h += '<div class="nfi-box nfi-notas"><div class="nfi-lbl">Notas</div><textarea id="nfiNotas" placeholder="Lo que haya que recordar de este proveedor…">' + esc(f.notas || "") + '</textarea></div>' +
      '<div class="nfi-foot"><span>' + (f.mod ? "Último cambio: " + esc(f.modPor === "pau" ? "Pau" : f.modPor === "euge" ? "Euge" : (f.modPor || "")) : "") + '</span><button data-a="del">Eliminar ficha</button></div></div></div></div>';
    return h;
  }
  /* ---------- pedidos y pagos (los mismos de A pagar) ---------- */
  var EST = { espera: "En espera", curso: "En curso", entregado: "Entregado" };
  function provDe(f){
    var pv = ST().proveedores || [];
    if (f.pagarId){ var x = pv.find(function(p){ return p.id === f.pagarId; }); if (x) return x; }
    var n = String(f.nombre || "").toLowerCase().split(/[\s·]+/)[0];
    return pv.find(function(p){ return n && String(p.proveedor || "").toLowerCase().split(/\s+/)[0] === n; }) || null;
  }
  function pagado(d){ return (d.pagos || []).reduce(function(a, p){ return a + (Number(p.monto) || 0); }, 0); }
  function plata(n){ return "$ " + Math.round(Number(n) || 0).toLocaleString("es-AR"); }
  function hoyISO(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fcorta(v){ if (!v) return ""; var p = String(v).split("-"); return p.length === 3 ? (+p[2]) + "/" + (+p[1]) : v; }
  function vPedidos(f){
    var pv = provDe(f), ds = pv ? (pv.pedidos || []).slice().sort(function(a, b){ return String(b.fecha || "").localeCompare(String(a.fecha || "")); }) : [];
    var debe = ds.reduce(function(a, d){ return a + Math.max(0, (Number(d.total) || 0) - pagado(d)); }, 0);
    var h = '<div class="nfi-box nfi-ped"><div class="hd"><div class="nfi-lbl">Pedidos y pagos</div>' + (ds.length ? '<span class="debe' + (debe ? "" : " ok") + '">' + (debe ? "Debemos " + plata(debe) : "Todo pago ✓") + '</span>' : "") + '</div>';
    if (!ds.length) h += '<div class="npl-empty" style="padding:4px 0">Todavía no hay pedidos cargados.</div>';
    ds.slice(0, V.todos ? 99 : 4).forEach(function(d){
      var pg = pagado(d), sal = Math.max(0, (Number(d.total) || 0) - pg), lns = String(d.detalle || d.nota || "Pedido").split("\n").map(function(l){ return l.replace(/^[-•*\s]+/, "").trim(); }).filter(Boolean), det = lns.slice(0, 2).join(" · ") + (lns.length > 2 ? " · +" + (lns.length - 2) + " más" : "");
      h += '<div class="nfi-pd" data-a="ped" data-pid="' + d.id + '"><b><span class="nfi-est" style="background:' + (ECO[etapaDe(pv, d)] || ECO.pedido)[0] + ';color:' + (ECO[etapaDe(pv, d)] || ECO.pedido)[1] + '">' + ETQ[etapaDe(pv, d)] + '</span>' + esc(det) + '</b><span class="mt">' + (Number(d.total) ? plata(d.total) : "A confirmar") + '</span>' +
        '<small>' + (d.fecha ? "Pedido " + fcorta(d.fecha) : "") + (d.vence ? " · vence " + fcorta(d.vence) : "") + '</small><small class="r">' + (Number(d.total) ? (sal ? "Falta " + plata(sal) : "Pagado ✓") : (pg ? "Pagado " + plata(pg) : "")) + '</small></div>';
    });
    if (ds.length > 4) h += '<div class="nfi-pd" data-a="todos" style="display:block;text-align:center;color:#7A6D64;font-size:13px">' + (V.todos ? "Ver menos" : "Ver los " + ds.length + " pedidos") + '</div>';
    h += '<div class="acc"><button class="dk" data-a="ped-new">+ Pedido</button>' + (pv ? '<button data-a="ir-pagar">Abrir en A pagar</button>' : "") + '</div></div>';
    return h;
  }
  function guardarProv(pv){
    pv.cambiado = Date.now(); pv.por = soy();
    var L = window.__nvLocal;
    var fila = {}; Object.keys(pv).forEach(function(k){ var v = pv[k]; fila[k] = (v && typeof v === "object") ? JSON.stringify(v) : v; });
    var p = L && L.guardar ? L.guardar(["proveedores", fila]) : Promise.reject(new Error("sin conexión"));
    return Promise.resolve(p).then(function(){ toast("Guardado"); try { N().render && N().render(); } catch(e){} pintar(); }, function(e){ toast("No se pudo guardar: " + (e && e.message || e)); });
  }
  function pedidoNuevo(f){ formPedido(f, null); }
  function pedidoMenu(f, pid){
    var pv = provDe(f); if (!pv) return; var d = (pv.pedidos || []).find(function(x){ return x.id === pid; }); if (d) formPedido(f, d);
  }
  function formPedido(f, d){
    var nuevo = !d, pagos = d ? (d.pagos || []).map(function(p){ return Object.assign({}, p); }) : [];
    function nom(p){ return p === "pau" ? "Pau" : p === "euge" ? "Euge" : (p || ""); }
    function listaPagos(){
      var tot = Number(String((document.getElementById("pdTot") || {}).value || (d && d.total) || "").replace(/[^\d]/g, "")) || 0;
      var pg = pagos.reduce(function(a, p){ return a + (Number(p.monto) || 0); }, 0);
      return (pagos.length ? pagos.map(function(p, i){ return '<div class="nfi-pgr"><span>' + fcorta(p.fecha) + '</span><span>' + plata(p.monto) + '</span><span>' + esc(nom(p.por)) + '</span><button class="npl-ic del" data-pq="' + i + '" title="Sacar">🗑</button></div>'; }).join("") : '<div class="npl-empty" style="padding:4px 0">Sin pagos todavía.</div>') +
        '<div class="nfi-pgt">Pagado ' + plata(pg) + (tot ? ' · falta ' + plata(Math.max(0, tot - pg)) : "") + '</div>';
    }
    hoja('<div class="nfi-mh"><h5 class="nfi-sh-t" style="margin:0!important;flex:1">' + (nuevo ? "Pedido nuevo · " + esc(f.nombre) : "Pedido" + (d.fecha ? " del " + fcorta(d.fecha) : "") + " · " + esc(f.nombre)) + '</h5><button class="npl-ic" id="pdX" title="Cerrar">✕</button></div>' +
      '<label class="nfi-fl">Detalle del pedido<textarea id="pdDet" class="npl-ta" rows="10" placeholder="Un renglón por producto. Ej:&#10;- 8 Arezzo tostadas&#10;- 6 Poli arpillera natural">' + esc(d ? d.detalle || "" : "") + '</textarea></label>' +
      '<div class="nfi-sh-row"><label>Total a pagar<input id="pdTot" class="npl-in" inputmode="numeric" placeholder="Vacío si no lo sabés" value="' + (d && d.total ? d.total : "") + '"></label>' +
      '<label>Vence<input id="pdVen" type="date" class="npl-in" value="' + esc(d ? d.vence || "" : "") + '"></label>' +
      '<label>Estado<select id="pdEst" class="npl-in">' + (function(){ var pv0 = provDe(f), tt = tipoDe(pv0 ? pv0.proveedor : f.nombre, d), ee = d ? etapaDe(pv0, d) : FLU[tt][0][0]; return FLU[tt].map(function(x){ return '<option value="' + x[0] + '"' + (x[0] === ee ? " selected" : "") + '>' + x[1] + '</option>'; }).join(""); })() + '</select></label></div>' +
      '<div class="nfi-fl" style="margin-bottom:6px">Pagos</div><div id="pdPagos" class="nfi-pgs">' + listaPagos() + '</div>' +
      '<div class="nfi-sh-row nfi-pgadd"><label>Monto<input id="pgM" class="npl-in" inputmode="numeric" placeholder="$"></label><label>Quién pagó<select id="pgP" class="npl-in"><option value="euge"' + (soy() === "euge" ? " selected" : "") + '>Euge</option><option value="pau"' + (soy() === "pau" ? " selected" : "") + '>Pau</option></select></label><label>Fecha<input id="pgF" type="date" class="npl-in" value="' + hoyISO() + '"></label><button class="npl-btn" id="pgAdd" style="align-self:flex-end;padding:11px 14px">+ Pago</button></div>' +
      '<div class="nfi-sh-btns" style="margin-top:14px"><button class="npl-btn" id="pdNo">Cancelar</button><button class="npl-btn dark" id="pdOk">Guardar</button></div>',
      function(hj, cerrar){
        if (nuevo) setTimeout(function(){ var t = hj.querySelector("#pdDet"); if (t) t.focus(); }, 60);
        function rep(){ hj.querySelector("#pdPagos").innerHTML = listaPagos(); }
        hj.querySelector("#pdNo").onclick = cerrar; hj.querySelector("#pdX").onclick = cerrar;
        hj.querySelector("#pdTot").oninput = rep;
        hj.querySelector("#pdPagos").onclick = function(ev){ var b = ev.target.closest("[data-pq]"); if (!b) return; if (!confirm("¿Sacar este pago?")) return; pagos.splice(+b.dataset.pq, 1); rep(); };
        hj.querySelector("#pgAdd").onclick = function(){
          var m = Number(String(hj.querySelector("#pgM").value).replace(/[^\d]/g, "")) || 0; if (!m){ hj.querySelector("#pgM").focus(); return; }
          pagos.push({ monto: m, fecha: hj.querySelector("#pgF").value || hoyISO(), nota: "", por: hj.querySelector("#pgP").value }); hj.querySelector("#pgM").value = ""; rep();
        };
        hj.querySelector("#pdOk").onclick = function(){
          var det = hj.querySelector("#pdDet").value.trim(); if (!det){ hj.querySelector("#pdDet").focus(); return; }
          var pm = Number(String(hj.querySelector("#pgM").value).replace(/[^\d]/g, "")) || 0;
          if (pm) pagos.push({ monto: pm, fecha: hj.querySelector("#pgF").value || hoyISO(), nota: "", por: hj.querySelector("#pgP").value });
          var tot = Number(String(hj.querySelector("#pdTot").value).replace(/[^\d]/g, "")) || 0, ven = hj.querySelector("#pdVen").value, est = hj.querySelector("#pdEst").value;
          var pv = provDe(f);
          if (!pv){ pv = { id: uid("pv"), proveedor: String(f.nombre || "").split(/\s+[·|-]\s+/)[0], alias: aliasDe(f), moneda: "ARS", nota: "", pedidos: [], creado: Date.now() }; (ST().proveedores = ST().proveedores || []).push(pv); f.pagarId = pv.id; guardar(f, true); }
          pv.pedidos = pv.pedidos || [];
          if (nuevo){ var nd = { id: uid("pd"), orden: "", total: tot, vence: ven, nota: "", pagos: pagos, estado: "espera", detalle: det, fecha: hoyISO(), retiro: "", retiroOk: false }; aplicarEtapa(nd, est); pv.pedidos.push(nd); }
          else { d.detalle = det; d.total = tot; d.vence = ven; d.pagos = pagos; aplicarEtapa(d, est); }
          cerrar(); guardarProv(pv);
        };
      }, true);
  }

  var LUCI_IMG = "data:image/jpeg;base64,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";
  /* ================= LUCI · compras, pagos y recepción ================= */
  var FLU = {
    encargo: [["cotizado","Cotizado"],["sena","Seña pagada"],["listo","Listo"],["retiro","Retiro pedido"],["traslado","En traslado"],["deposito","En depósito"]],
    directa: [["pedido","Pedido"],["pagado","Pagado"],["traslado","En traslado"],["deposito","En depósito"]]
  };
  var ETQ = { cotizado:"Cotizado", pedido:"Pedido", sena:"Seña pagada", pagado:"Pagado", listo:"Listo", retiro:"Retiro pedido", traslado:"En traslado", deposito:"En depósito" };
  var ECO = { cotizado:["#ECE4DB","#5A4334"], pedido:["#ECE4DB","#5A4334"], sena:["#F3E4EA","#8A4F65"], pagado:["#F3E4EA","#8A4F65"], listo:["#ECE7F3","#6A4E86"], retiro:["#E0EEEB","#3C6E66"], traslado:["#E4ECF5","#46618A"], deposito:["#E2EBDB","#3F5E31"] };
  var COLS = [["Pedido",["cotizado","pedido"]],["Seña",["sena"]],["Listo / Pagado",["listo","pagado"]],["Retiro pedido",["retiro"]],["En traslado",["traslado"]],["En depósito",["deposito"]]];
  function tipoDe(nom, d){ return (d && d.tipo) || (/aurora|licari|afortunada|herrer|gabriel/i.test(String(nom || "")) ? "encargo" : "directa"); }
  function etapaDe(pv, d){
    var t = tipoDe(pv && pv.proveedor, d), ok = FLU[t].map(function(x){ return x[0]; });
    if (d.etapa && ok.indexOf(d.etapa) >= 0) return d.etapa;
    if (d.etapa === "deposito" || d.estado === "entregado") return "deposito";
    if (d.etapa === "traslado" || d.etapa === "retiro" && t === "directa") return "traslado";
    var pg = pagado(d), tot = Number(d.total) || 0;
    if (t === "encargo"){ if (d.etapa === "pagado") return "listo"; if (d.etapa === "pedido") return "cotizado"; return tot && pg >= tot ? "listo" : pg ? "sena" : "cotizado"; }
    if (d.etapa === "sena" || d.etapa === "listo") return "pagado"; if (d.etapa === "cotizado") return "pedido";
    return pg ? "pagado" : "pedido";
  }
  function estadoDeEtapa(e){ return e === "deposito" ? "entregado" : (e === "cotizado" || e === "pedido") ? "espera" : "curso"; }
  function aplicarEtapa(d, e){
    if (d.etapa === e) return;
    d.etapa = e; d.estado = estadoDeEtapa(e); d.etapaAt = Date.now();
    d.hist = (d.hist || []).concat([{ e: e, t: Date.now(), por: soy() }]).slice(-20);
    delete d.luciZz;
  }
  function setEtapa(pv, d, e){ aplicarEtapa(d, e); toast("Luci: " + pv.proveedor + " → " + ETQ[e]); return guardarProv(pv); }
  function diasEn(d){ var t = d.etapaAt || (d.fecha ? new Date(d.fecha + "T12:00:00").getTime() : Date.now()); return Math.floor((Date.now() - t) / 864e5); }
  function provs(){ return (ST().proveedores || []).filter(function(p){ return p && !p.borrado && p.proveedor; }); }
  function pedidosDe(pv){ var x = pv.pedidos; if (typeof x === "string"){ try { x = JSON.parse(x); } catch(e){ x = []; } pv.pedidos = x; } return Array.isArray(x) ? x : []; }
  function fichaDe(pv){ return fichas().find(function(f){ return provDe(f) === pv; }) || { nombre: pv.proveedor, pagarId: pv.id, _ps: 1 }; }
  function lineas(d){ return String(d.detalle || d.nota || "Pedido").split("\n").map(function(l){ return l.replace(/^[-•*\s]+/, "").trim(); }).filter(Boolean); }
  function resumen(d, n){ var l = lineas(d); return l.slice(0, n || 2).join(" · ") + (l.length > (n || 2) ? " · +" + (l.length - (n || 2)) + " más" : ""); }
  function todos(){ var r = []; provs().forEach(function(pv){ pedidosDe(pv).forEach(function(d){ if (d && !d.borrado) r.push({ pv: pv, d: d, e: etapaDe(pv, d) }); }); }); return r; }

  function alertas(){
    var hoy = hoyISO(), en2 = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), A = [];
    todos().forEach(function(x){
      var pv = x.pv, d = x.d, e = x.e, n = esc(pv.proveedor), tot = Number(d.total) || 0, sal = Math.max(0, tot - pagado(d)), dd = diasEn(d), q = { pv: pv, d: d };
      if (e === "deposito" || (d.luciZz && d.luciZz >= hoy)) return;
      function add(o){ o.pv = pv; o.d = d; o.sub = o.sub || resumen(d); A.push(o); }
      if (d.vence && d.vence <= en2 && sal){ add({ p: 1, ic: "💸", c: "sena", t: n + ": " + (d.vence < hoy ? "venció el " + fcorta(d.vence) : d.vence === hoy ? "vence hoy" : "vence el " + fcorta(d.vence)) + " y falta pagar <b>" + plata(sal) + "</b>", b: [["pagar", "Cargar pago", "pk"]] }); return; }
      if (e === "cotizado" && dd >= 2) add({ p: 4, ic: "🧾", c: "cotizado", t: "¿Pagamos la seña de " + n + "?", b: [["et:sena", "Sí, pagamos la seña", "dk"], ["pagar", "Cargar pago", ""]] });
      if (e === "sena" && dd >= 10) add({ p: 5, ic: "⏳", c: "sena", t: "¿" + n + " avisó que está listo?", sub: "Hace " + dd + " días que pagamos la seña", b: [["et:listo", "Sí, está listo", "dk"]] });
      if (e === "listo"){
        if (sal) add({ p: 2, ic: "💸", c: "listo", t: n + " está listo: falta pagar el resto, <b>" + plata(sal) + "</b>", b: [["pagar", "Cargar pago", "pk"]] });
        else add({ p: 2, ic: "🚚", c: "retiro", t: n + " está pago y listo: falta pedir el retiro", sub: "El mensaje para el transporte ya está armado", b: [["retiro", "Armar mensaje", ""], ["et:retiro", "Ya lo pedí", "dk"]] });
      }
      if (e === "pedido" && dd >= 1) add({ p: 4, ic: "🧾", c: "pedido", t: "¿Ya pagamos el pedido de " + n + "?", b: [["et:pagado", "Sí, está pago", "dk"], ["pagar", "Cargar pago", ""]] });
      if (e === "pagado" && dd >= 3) add({ p: 4, ic: "📦", c: "pagado", t: "¿Ya despacharon lo de " + n + "?", sub: "Pagado hace " + dd + " días", b: [["et:traslado", "Sí, viene en camino", "dk"]] });
      if (e === "retiro" && dd >= 1) add({ p: 3, ic: "🚚", c: "retiro", t: "¿El transporte ya retiró lo de " + n + "?", b: [["et:traslado", "Sí, viene en camino", "dk"]] });
      if (e === "traslado") add({ p: 3, ic: "📦", c: "traslado", t: "¿Llegó lo de " + n + "?", sub: resumen(d) + (dd ? " · viajando hace " + dd + (dd === 1 ? " día" : " días") : ""), b: [["et:deposito", "Llegó ✓", "dk"]] });
    });
    return A.sort(function(a, b){ return a.p - b.p; });
  }
  var LA = [];
  function vLuci(){
    if (!provs().length) return '<div class="nlu-hero"><div class="nlu-av"><img src="' + LUCI_IMG + '" alt="Luci"></div><div><div class="nlu-h">Hola, soy Luci</div><p>Estoy cargando los pedidos…</p></div></div>';
    LA = alertas();
    var T = todos(), h = '<div class="nlu-hero"><div class="nlu-av"><img src="' + LUCI_IMG + '" alt="Luci"></div><div><div class="nlu-h">Hola, soy Luci</div><p>Te ayudo con el día a día, las compras y la recepción. ' +
      (LA.length ? "Hoy tengo " + LA.length + (LA.length === 1 ? " cosa" : " cosas") + " para ustedes." : "Hoy no hay nada trabado ✓") + '</p></div></div>';
    h += vRutina() + '<div class="nlu-sec">Lo que necesito de ustedes</div>';
    if (!LA.length) h += '<div class="nlu-empty">Todo en orden. Cuando algo se trabe, te aviso acá y en el chat.</div>';
    h += '<div class="nlu-msgs">' + LA.map(function(a, i){
      var c = ECO[a.c] || ECO.pedido;
      return '<div class="nlu-msg"><div class="nlu-dot" style="background:' + c[0] + '">' + a.ic + '</div><div class="t">' + a.t + '<small>' + esc(a.sub) + '</small></div><div class="bt">' +
        a.b.map(function(b){ return '<button class="nlu-btn ' + b[2] + '" data-a="lu-do" data-i="' + i + '" data-x="' + b[0] + '">' + b[1] + '</button>'; }).join("") +
        '<button class="nlu-btn ghost" data-a="lu-do" data-i="' + i + '" data-x="mas" title="Cambiar o dejar para mañana">⋯</button></div></div>';
    }).join("") + '</div>';
    h += '<div class="nlu-sec">Cómo vienen los pedidos <span>Tocá uno para cambiar su estado</span></div><div class="nlu-cols">';
    var mes = Date.now() - 30 * 864e5;
    COLS.forEach(function(cl, ci){
      var its = T.filter(function(x){ return cl[1].indexOf(x.e) >= 0 && (x.e !== "deposito" || (x.d.etapaAt || new Date((x.d.fecha || "2000-01-01") + "T12:00:00").getTime()) > mes); });
      its.sort(function(a, b){ return String(b.d.fecha || "").localeCompare(String(a.d.fecha || "")); });
      var c = ECO[cl[1][0]], ver = cl[1][0] === "deposito" ? 4 : 99;
      h += '<div class="nlu-col' + (its.length ? "" : " vac") + '" style="background:' + c[0] + '"><div class="nlu-ch" style="color:' + c[1] + '">' + cl[0] + '<em>' + its.length + '</em></div>' +
        its.slice(0, ver).map(function(x){ var sal = Math.max(0, (Number(x.d.total) || 0) - pagado(x.d)); return '<div class="nlu-card" data-a="lu-card" data-pv="' + esc(x.pv.id) + '" data-pid="' + esc(x.d.id) + '"><b>' + esc(x.pv.proveedor) + '</b><span>' + esc(resumen(x.d, 1)) + '</span><small>' + (sal && x.e !== "deposito" ? "Falta " + plata(sal) : x.d.fecha ? "Pedido " + fcorta(x.d.fecha) : "") + '</small></div>'; }).join("") +
        (its.length > ver ? '<div class="nlu-card mas">+' + (its.length - ver) + ' más</div>' : "") + '</div>';
    });
    h += '</div>';
    return h;
  }
  function buscar(pvId, pid){ var pv = provs().find(function(p){ return p.id === pvId; }); if (!pv) return null; var d = pedidosDe(pv).find(function(x){ return x.id === pid; }); return d ? { pv: pv, d: d } : null; }
  function sheetEtapa(pv, d){
    var t = tipoDe(pv.proveedor, d), e = etapaDe(pv, d), f = fichaDe(pv), sal = Math.max(0, (Number(d.total) || 0) - pagado(d));
    function chips(){ var tt = tipoDe(pv.proveedor, d), ee = etapaDe(pv, d); return FLU[tt].map(function(x, i){ var on = x[0] === ee, c = ECO[x[0]]; return '<button class="nlu-step' + (on ? " on" : "") + '" data-e="' + x[0] + '" style="' + (on ? "background:" + c[1] + ";color:#fff;border-color:" + c[1] : "") + '"><i>' + (i + 1) + '</i>' + x[1] + '</button>'; }).join(""); }
    hoja('<div class="nfi-mh"><h5 class="nfi-sh-t" style="margin:0!important;flex:1">' + esc(pv.proveedor) + (d.fecha ? " · pedido del " + fcorta(d.fecha) : "") + '</h5><button class="npl-ic" id="luX" title="Cerrar">✕</button></div>' +
      '<div class="nlu-det">' + lineas(d).map(esc).join("<br>") + '</div>' +
      '<div class="nlu-mini">' + (Number(d.total) ? "Total " + plata(d.total) + " · " + (sal ? "falta " + plata(sal) : "pagado ✓") : "Total a confirmar") + '</div>' +
      '<div class="nfi-fl" style="margin:12px 0 6px">¿En qué está? <span style="color:#ABA097">· tocá el estado y se cambia</span></div><div class="nlu-steps" id="luSt">' + chips() + '</div>' +
      '<div class="nlu-tipo">Cómo es este pedido: <button data-t="encargo" class="' + (t === "encargo" ? "on" : "") + '">A pedido (cotizan, seña, listo)</button><button data-t="directa" class="' + (t === "directa" ? "on" : "") + '">Compra directa (web)</button></div>' +
      '<div class="nfi-sh-btns" style="margin-top:14px;flex-wrap:wrap"><button class="npl-btn" id="luPed">Ver / editar pedido completo</button>' + (f._ps ? "" : '<button class="npl-btn" id="luRet">Armar mensaje de retiro</button>') + '<button class="npl-btn" id="luZz">Recordame mañana</button></div>',
      function(hj, cerrar){
        hj.querySelector("#luX").onclick = cerrar;
        hj.querySelector("#luSt").onclick = function(ev){ var b = ev.target.closest("[data-e]"); if (!b) return; cerrar(); setEtapa(pv, d, b.dataset.e); };
        hj.querySelector(".nlu-tipo").onclick = function(ev){ var b = ev.target.closest("[data-t]"); if (!b) return; d.tipo = b.dataset.t; var ok = FLU[d.tipo].map(function(x){ return x[0]; }); if (d.etapa && ok.indexOf(d.etapa) < 0) d.etapa = etapaDe(pv, d); [].forEach.call(hj.querySelectorAll("[data-t]"), function(x){ x.classList.toggle("on", x === b); }); hj.querySelector("#luSt").innerHTML = chips(); guardarProv(pv); };
        hj.querySelector("#luPed").onclick = function(){ cerrar(); formPedido(f, d); };
        var r = hj.querySelector("#luRet"); if (r) r.onclick = function(){ cerrar(); retiro(f); };
        hj.querySelector("#luZz").onclick = function(){ cerrar(); d.luciZz = hoyISO(); toast("Dale, te lo vuelvo a recordar mañana"); guardarProv(pv); };
      }, true);
  }
  function luClick(el){
    var a = el.dataset.a;
    if (a === "lu-tarea"){ try { N().setTab("tareas"); window.scrollTo(0,0); } catch(e){} return true; }
    if (a === "lu-card"){ var x = buscar(el.dataset.pv, el.dataset.pid); if (x) sheetEtapa(x.pv, x.d); return true; }
    if (a === "lu-do"){
      var al = LA[+el.dataset.i]; if (!al) return true; var k = el.dataset.x, pv = al.pv, d = al.d;
      if (k.indexOf("et:") === 0) setEtapa(pv, d, k.slice(3));
      else if (k === "pagar") formPedido(fichaDe(pv), d);
      else if (k === "retiro"){ var f = fichaDe(pv); if (f._ps) toast("Falta la ficha de " + pv.proveedor + " para armar el retiro"); else retiro(f); }
      else if (k === "mas") sheetEtapa(pv, d);
      return true;
    }
    return false;
  }
  /* Luci avisa en el chat una vez por día (etiqueta a las dos) */
  var LUCHAT = false;
  function luciChat(){
    var hh = new Date(); if (LUCHAT || !sb() || !provs().length || !(LOADED || ST().loaded) || hh.getHours() * 60 + hh.getMinutes() < 510 || hh.getDay() === 0 || hh.getDay() === 6) return;
    var id = "luci-" + hoyISO(); LUCHAT = true;
    var txt = textoChat(); if (!txt) return;
    luciDecir(id, txt, "¡Buen día, chicas! Les dejé el resumen de hoy 🌷");
  }
  setInterval(function(){ try { luciChat(); } catch(e){} }, 30000);
  window.__nvLuciAbrir = function(){ V.vista = "luci"; V.id = null; try { localStorage.setItem(LSV, "luci"); } catch(x){} if (N().setTab) N().setTab("provcat"); setTimeout(montar, 50); window.scrollTo(0,0); };
  /* "Luci" en el menú, debajo de Proveedores */
  function menuLuci(){
    try {
      if (document.getElementById("nluNav")) return;
      var leaf = [].slice.call(document.querySelectorAll("nav *, aside *")).find(function(e){ return e.children.length === 0 && e.textContent.trim() === "Proveedores"; });
      if (!leaf) return; var row = leaf; while (row.parentElement && row.parentElement.children.length < 3 && row.parentElement.tagName !== "NAV") row = row.parentElement;
      var cl = row.cloneNode(true); cl.id = "nluNav"; cl.removeAttribute("onclick"); [].forEach.call(cl.querySelectorAll("[onclick]"), function(x){ x.removeAttribute("onclick"); });
      cl.className = String(row.className).replace(/\b(on|active|sel|act|cur)\b/g, "");
      var lf = [].slice.call(cl.querySelectorAll("*")).concat([cl]).find(function(e){ return e.children.length === 0 && e.textContent.trim() === "Proveedores"; }); if (lf) lf.textContent = "Luci";
      var sv = cl.querySelector("svg"); if (sv) sv.outerHTML = '<img src="' + LUCI_IMG + '" alt="" style="width:22px;height:22px;border-radius:50%;object-fit:cover;flex:none">';
      cl.addEventListener("click", function(ev){ ev.preventDefault(); ev.stopPropagation(); window.__nvLuciAbrir(); }, true);
      row.parentNode.insertBefore(cl, row.nextSibling);
    } catch(e){}
  }
  setInterval(menuLuci, 1500);

  /* ---------- Luci project manager: rutina del día + tareas de cada una ---------- */
  var DSEM = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  function tareasAbiertas(){
    var vis = {};
    return (ST().tareas || []).filter(function(t){ if (!t || t.borrado || t.estado === "hecha" || vis[t.id]) return false; vis[t.id] = 1; return true; })
      .sort(function(a, b){ var pa = a.prio === "alta" ? 0 : a.prio === "media" ? 1 : 2, pb = b.prio === "alta" ? 0 : b.prio === "media" ? 1 : 2; return pa - pb || String(a.fecha || "9").localeCompare(String(b.fecha || "9")); });
  }
  function tareasDe(q){ return tareasAbiertas().filter(function(t){ return (t.resp || "") === q; }); }
  function corto(s, n){ s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > (n || 60) ? s.slice(0, (n || 60) - 1) + "…" : s; }
  function rutinaHoy(){
    var d = new Date().getDay(), R = { dia: DSEM[d], saludo: "", items: [], finde: d === 0 || d === 6 };
    var enc = todos().filter(function(x){ return tipoDe(x.pv.proveedor, x.d) === "encargo" && (x.e === "sena" || x.e === "cotizado"); }).map(function(x){ return x.pv.proveedor; });
    enc = enc.filter(function(n, i){ return enc.indexOf(n) === i; });
    if (d === 1){ R.saludo = "¡Buen día, chicas! Arrancamos la semana 💪"; R.items = ["Es buen momento para escribirle a los mayoristas.", "Acuérdense de mandarle las etiquetas a Andrés de Vía Cargo, así las tiene para mañana."]; }
    else if (d === 2 || d === 4){ R.saludo = "¡Buen día, chicas! Hoy es " + DSEM[d] + ", toca empaquetar 📦"; R.items = ["Antes de arrancar: ¿llegó algo nuevo? ¿Laura o Iris entregaron lámparas? Contame y lo sumo."]; }
    else if (d === 3){ R.saludo = "¡Buen día! Mitad de semana 🌿"; R.items = ["Revisemos si entraron pedidos nuevos."]; if (enc.length) R.items.push("¿" + enc.join(" o ") + " avisaron si ya hay algo listo para retirar?"); R.items.push("¿Ya mandaron los seguimientos?"); }
    else if (d === 5){ R.saludo = "¡Buen día! Viernes, día más tranqui ☀️"; R.items = ["Fijémonos que todos los seguimientos estén enviados.", "¿Quedó algo de esta semana sin entregar?", "¿Laura, Iris y Damián ya están pagos?"]; }
    else { R.saludo = "Es finde, ¡a descansar! 🌴"; }
    return R;
  }
  function textoChat(){
    var R = rutinaHoy(); if (R.finde) return "";
    var L = ["@Pau @Euge " + R.saludo];
    if (R.items.length){ L.push(""); R.items.forEach(function(t){ L.push("• " + t); }); }
    var A = alertas();
    if (A.length){ L.push("", "De compras y pedidos:"); A.slice(0, 4).forEach(function(a){ L.push("• " + String(a.t).replace(/<[^>]+>/g, "")); }); if (A.length > 4) L.push("• y " + (A.length - 4) + " cosas más"); }
    var tp = tareasDe("pau").slice(0, 3), te = tareasDe("euge").slice(0, 3), ta = tareasDe("ambas").slice(0, 2);
    if (tp.length || te.length || ta.length) L.push("");
    if (tp.length) L.push("Pau, después podés seguir por: " + tp.map(function(t){ return corto(t.titulo, 45); }).join(" · "));
    if (te.length) L.push("Euge, vos por: " + te.map(function(t){ return corto(t.titulo, 45); }).join(" · "));
    if (ta.length) L.push("Y de las dos: " + ta.map(function(t){ return corto(t.titulo, 45); }).join(" · "));
    L.push("", "Cualquier cosa estoy en Proveedores → Luci 😊");
    return L.join("\n");
  }
  function vRutina(){
    var R = rutinaHoy(), me = soy(), mias = me === "pau" || me === "euge" ? tareasDe(me).slice(0, 4) : [], amb = tareasDe("ambas").slice(0, 3);
    var h = '<div class="nlu-sec">Hoy, ' + R.dia + '</div><div class="nlu-rut"><div class="nlu-sal">' + esc(R.saludo) + '</div>';
    if (R.items.length) h += '<ul>' + R.items.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    if (mias.length || amb.length){
      h += '<div class="nlu-tar"><b>' + (me ? (me === "pau" ? "Pau" : "Euge") + ", podés seguir por estas:" : "Tareas para seguir:") + '</b>' +
        mias.concat(amb).map(function(t){ return '<div class="nlu-tr" data-a="lu-tarea"><span class="p p-' + esc(t.prio || "n") + '"></span>' + esc(corto(t.titulo, 80)) + (t.resp === "ambas" ? ' <em>de las dos</em>' : "") + '</div>'; }).join("") + '</div>';
    }
    return h + '</div>';
  }
  /* ---------- Luci: mensajes en el chat + aviso al celu ---------- */
  var LUCI_CANAL = "dm";
  function luciPush(texto, tag){ try { if (sb() && sb().functions) sb().functions.invoke("avisos", { body: { accion: "luci", texto: texto, tag: tag || "" } }).then(function(){}, function(){}); } catch(e){} }
  /* publica un mensaje de Luci una sola vez por id (si ya existe, no hace nada) */
  function luciDecir(id, texto, aviso){
    if (!sb()) return Promise.resolve(false);
    return sb().from("registros").select("id").eq("tabla", "chat").eq("id", id).then(function(r){
      if (r.error || (r.data && r.data.length)) return false;
      var now = Date.now();
      return sb().from("registros").upsert({ tabla: "chat", id: id, data: { id: id, adj: [], por: "luci", reac: {}, canal: LUCI_CANAL, texto: texto, creado: now, borrado: false, cambiado: now }, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true })
        .then(function(w){ if (w.error) return false; luciPush(aviso || texto.replace(/@Pau @Euge\s*/g, "").split("\n")[0], id); return true; });
    });
  }
  /* avisos urgentes en el momento (vence hoy / venció, algo listo para retirar) — una vez por día cada uno */
  var LUURG = 0;
  function luciUrgentes(){
    if (!provs().length || !(LOADED || ST().loaded) || Date.now() - LUURG < 25 * 60e3) return; LUURG = Date.now();
    var hh = new Date(); if (hh.getHours() < 8 || hh.getHours() >= 21) return;
    alertas().filter(function(a){ return a.p <= 2; }).slice(0, 3).forEach(function(a){
      var t = String(a.t).replace(/<[^>]+>/g, "");
      luciDecir("luci-u-" + a.d.id + "-" + a.c + "-" + hoyISO(), "@Pau @Euge Chicas, ojo con esto: " + t + " 🙏\nLo pueden resolver desde Proveedores → Luci.", t);
    });
  }
  setInterval(function(){ try { luciUrgentes(); } catch(e){} }, 60000);

  /* ---------- Dólares publicidad · Euge (desde #movimientos) ---------- */
  function numAR(s){ s = String(s || "").trim(); if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", "."); else s = s.replace(",", "."); return Number(s) || 0; }
  function usdDe(t){
    var m = t.match(/(?:u\$s|us\$|usd|d[oó]lares?)\s*([\d.,]+)/i) || t.match(/([\d.,]+)\s*(?:u\$s|us\$|usd|d[oó]lares?)/i);
    return m ? numAR(m[1]) : 0;
  }
  var LUUSD = 0;
  function luciUsd(){
    if (!sb() || Date.now() - LUUSD < 90e3) return; LUUSD = Date.now();
    var desde = new Date(Math.max(Date.now() - 3 * 864e5, Date.parse("2026-11-27T20:30:00Z"))).toISOString();
    sb().from("movimientos").select("id,msg_id,texto,autor,monto,creado").gte("creado", desde).order("id", { ascending: false }).limit(60).then(function(r){
      (r.data || []).forEach(function(mv){
        var t = String(mv.texto || ""), low = t.toLowerCase();
        if (!/(u\$s|us\$|usd|d[oó]lar)/i.test(t)) return;
        var usd = usdDe(t); if (!usd) return;
        var compra = /compr[eéoó]|compra/i.test(low), publi = /publicidad|facebook|meta|instagram|\bfb\b|\bads?\b/i.test(low);
        if (!compra && !publi) return;
        var id = "usdm-" + mv.id, monto = compra ? -usd : usd;
        var fila = { id: id, at: "", por: mv.autor || "", fecha: String(mv.creado || "").slice(0, 10) || hoyISO(), monto: String(monto), notas: "desde #movimientos · " + t.slice(0, 120), creado: String(Date.now()), inicial: "", cambiado: String(Date.now()), concepto: compra ? "COMPRA " + usd + " USD PARA RECUPERAR PUBLICIDAD" : "USD PUBLICIDAD" };
        sb().from("registros").select("id").eq("tabla", "fin_usd").eq("id", id).then(function(x){
          if (x.error || (x.data && x.data.length)) return;
          sb().from("registros").upsert({ tabla: "fin_usd", id: id, data: fila, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){
            if (w.error) return;
            var sinPesos = compra && !(Number(mv.monto) > 0) && !/\$\s*[\d.]{4,}/.test(t);
            luciDecir("luci-usd-" + mv.id, (compra ? "Anoté la compra de " + usd + " USD en Dólares publicidad · Euge: se restan de lo que Nervo te debe 💵" : "Anoté " + usd + " USD de publicidad en Dólares publicidad · Euge: se suman a lo que Nervo te debe 💵") +
              (sinPesos ? "\n¿Cuántos pesos salieron? Escribilo en #movimientos así lo descuento también en pesos (ej: compré 100 usd $180.000)." : ""), compra ? "Compra de " + usd + " USD anotada" : usd + " USD de publicidad anotados");
          });
        });
      });
    }, function(){});
  }
  setInterval(function(){ try { luciUsd(); } catch(e){} }, 30000);
  window.__nvLuci = { alertas: function(){ return alertas(); }, texto: function(){ return textoChat(); }, usd: function(){ LUUSD = 0; luciUsd(); }, push: luciPush };
  /* ================= Canal "Luci" en el chat: comandos, aprobaciones y respuestas ================= */
  LUCI_CANAL = "luci";
  var LUCI_INICIO = Date.parse("2026-11-27T20:30:00Z"); /* Luci solo mira lo que pasa desde que empezó a trabajar */
  var LC = { open: false, msgs: [], busy: false, last: 0, pane: null, visto: 0 };
  try { LC.visto = +localStorage.getItem("nvLuciVisto") || 0; } catch(e){}
  function nrm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function guardarFila(tabla, o){
    o.cambiado = Date.now(); o.por = soy();
    var fila = {}; Object.keys(o).forEach(function(k){ var v = o[k]; fila[k] = (v && typeof v === "object") ? JSON.stringify(v) : v; });
    var L = window.__nvLocal;
    return Promise.resolve(L && L.guardar ? L.guardar([tabla, fila]) : Promise.reject(new Error("sin conexión"))).then(function(){ try { N().render && N().render(); } catch(e){} });
  }
  function arr(x){ if (typeof x === "string"){ try { x = JSON.parse(x); } catch(e){ x = []; } } return Array.isArray(x) ? x : []; }
  function plataN(t){ var m = String(t).match(/\$\s*([\d.,]+)/) || String(t).match(/\b(\d{1,3}(?:\.\d{3})+|\d{4,})\b/); return m ? numAR(m[1]) : 0; }
  function cantDe(t){ var m = String(t).match(/(?:^|\s)(\d{1,3})(?:\s*[x×]|\s+(?=[a-záéíóú]))/i); return m ? +m[1] : 0; }
  function sinCant(t){ return String(t).replace(/(?:^|\s)\d{1,3}\s*[x×]?\s+(?=[a-záéíóú])/i, " ").trim(); }

  /* ---- búsquedas ---- */
  var ALIAS = { gabriel: "herrero", herreria: "herrero", tica: "tikka", tika: "tikka", afortunada: "afortunada", dehierro: "hierro", grass: "grass" };
  function provPor(q){ q = nrm(q).split(" ")[0]; if (!q || q.length < 3) return null; q = ALIAS[q] || q; return provs().find(function(p){ var n = nrm(p.proveedor); return n.split(" ").some(function(w){ return w.indexOf(q) === 0; }); }) || null; }
  var CONECT = { a: 1, al: 1, de: 1, del: 1, la: 1, el: 1, para: 1, por: 1, le: 1 };
  function quien(r){ var ws = String(r).replace(/\$\s*[\d.,]+/g, " ").replace(/\b\d[\d.,]*\b/g, " ").split(/\s+/).filter(function(w){ return w && !CONECT[nrm(w)]; }); for (var i = 0; i < ws.length; i++){ var p = provPor(ws[i]); if (p) return { pv: p, w: ws[i] }; var t = tejPor(ws[i]); if (t) return { tj: t, w: ws[i] }; } return { w: ws[0] || "" }; }
  function tejPor(q){ q = nrm(q).split(" ")[0]; if (!q) return null; var ts = (ST().tejedoras || []).filter(function(t){ return !t.borrado && nrm(t.nombre).split(" ")[0] === q; });
    ts.sort(function(a, b){ function n(t){ return arr(t.encargos).length + arr(t.cargos).length + arr(t.pagos).length; } return n(b) - n(a) || (+b.cambiado || 0) - (+a.cambiado || 0); }); return ts[0] || null; }
  function stockPor(q, tipo){
    var w = nrm(q).split(" ").filter(function(x){ return x && x.length > 1 || /\d/.test(x); });
    if (!w.length) return [];
    return (ST().stock || []).filter(function(s){ if (s.borrado) return false; if (tipo && (s.tipo || "terminado") !== tipo) return false; var n = nrm(s.producto); return w.every(function(x){ return n.indexOf(x) >= 0; }); }).slice(0, 12);
  }
  function pedAbierto(pv){ var ds = pedidosDe(pv).filter(function(d){ return !d.borrado && etapaDe(pv, d) !== "deposito"; }); ds.sort(function(a, b){ return String(b.fecha || "").localeCompare(String(a.fecha || "")); }); return ds[0] || null; }
  function pedConDeuda(pv){ var ds = pedidosDe(pv).filter(function(d){ return !d.borrado && Math.max(0, (+d.total || 0) - pagado(d)) > 0; }); ds.sort(function(a, b){ return String(a.fecha || "").localeCompare(String(b.fecha || "")); }); return ds[0] || pedAbierto(pv); }
  function plataN2(t){ var v = plataN(t); if (v) return v; var m = String(t).match(/\b(\d{2,3})\s*(?:mil|k)\b/i); if (m) return +m[1] * 1000; m = String(t).match(/\b(\d{1,3}(?:[.,]\d{3})+|\d{4,})\b/); return m ? numAR(m[1]) : 0; }

  /* ---- mensajes ---- */
  function lcEnviar(texto, por, acc){
    var now = Date.now(), id = (por === "luci" ? "lu" : "lc") + now + Math.random().toString(36).slice(2, 5);
    var data = { id: id, adj: [], por: por, reac: {}, canal: "luci", texto: texto, creado: now, borrado: false, cambiado: now };
    if (acc) data.acc = acc;
    LC.msgs.push(data); lcPintar();
    return sb().from("registros").upsert({ tabla: "chat", id: id, data: data, borrado: false, actualizado: new Date().toISOString(), por: por }, { onConflict: "tabla,id" }).then(function(r){ if (r.error) toast("No se pudo enviar"); return data; });
  }
  function lcMarcar(m, est){ m.est = est; m.cambiado = Date.now(); lcPintar(); return sb().from("registros").upsert({ tabla: "chat", id: m.id, data: m, borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(){}); }
  function luci(t, acc){ return lcEnviar(t, "luci", acc); }
  function lcLeer(){
    if (!sb() || LC.busy) return; LC.busy = true;
    sb().from("registros").select("data").eq("tabla", "chat").order("actualizado", { ascending: false }).limit(400).then(function(r){
      LC.busy = false; if (r.error) return;
      var ms = (r.data || []).map(function(x){ return x.data; }).filter(function(d){ return d && d.canal === "luci" && !d.borrado; });
      ms.sort(function(a, b){ return (a.creado || 0) - (b.creado || 0); });
      var sig = ms.map(function(m){ return m.id + (m.est || "") + (m.cambiado || ""); }).join("|");
      if (sig !== LC.sig){ LC.sig = sig; LC.msgs = ms.slice(-120); lcPintar(); }
      lcBadge();
    }, function(){ LC.busy = false; });
  }

  /* ---- comandos ---- */
  var AYUDA = "Esto es lo que entiendo 👇\n" +
    "• /ver aurora · /ver iris · /ver toscana 65 → te cuento todo\n" +
    "• /pedido aurora 8 arezzo, 6 poli → pedido nuevo\n" +
    "• /seña licari $200.000 · /pagué aurora $608.000 → cargo el pago\n" +
    "• /retiro licari → ya se pidió el retiro\n" +
    "• /llegó aurora → llegó al depósito\n" +
    "• /entra 5 toscana 65 · /sale 2 toscana 65 → stock\n" +
    "• /gabriel 6 carmina 40 → Gabriel entregó armazones\n" +
    "• /llevé iris 4 toscana 50 → le llevamos armazones\n" +
    "• /iris 2 toscana 65 · /laura 3 toscana 50 → entregaron lámparas\n" +
    "• /pagué laura $30.000 → pago a una tejedora (o a Damián)\n" +
    "Antes de cambiar algo te muestro qué voy a hacer y vos confirmás 😊";
  function elegir(cmd, base, ops){
    if (!ops.length){ luci("No encontré ese producto en el stock 🙈 Probá con otras palabras (ej: toscana 65 negro)."); return; }
    if (ops.length === 1){ base.sid = ops[0].id; luciPropone(cmd, base); return; }
    luci("Encontré varios, ¿cuál es?", { tipo: "elegir", cmd: cmd, base: base, ops: ops.map(function(s){ return [s.id, s.producto]; }) });
  }
  function stockId(id){ return (ST().stock || []).find(function(s){ return s.id === id; }); }
  function luciPropone(cmd, b){
    var s = b.sid ? stockId(b.sid) : null, n = b.n, txt = "";
    if (cmd === "entra") txt = "Voy a sumar " + n + " a «" + s.producto + "» (hay " + (+s.cantidad || 0) + " → quedan " + ((+s.cantidad || 0) + n) + ").";
    if (cmd === "sale") txt = "Voy a restar " + n + " de «" + s.producto + "» (hay " + (+s.cantidad || 0) + " → quedan " + Math.max(0, (+s.cantidad || 0) - n) + ").";
    if (cmd === "gabriel") txt = "Gabriel entregó " + n + " armazones de «" + s.producto + "»: los sumo (hay " + (+s.cantidad || 0) + " → " + ((+s.cantidad || 0) + n) + ").";
    if (cmd === "lleve") txt = "Le llevamos a " + b.tej + " " + n + " armazones «" + s.producto + "»: los resto de armazones y le anoto el encargo.";
    if (cmd === "tej") txt = b.tej + " entregó " + n + " «" + s.producto + "»: lo sumo al stock (hay " + (+s.cantidad || 0) + " → " + ((+s.cantidad || 0) + n) + ")" + (b.precio ? " y le cargo " + plata(b.precio * n) + " a su cuenta." : ". No encontré su precio por pieza, el pago cargalo en Equipo.");
    luci(txt + "\n¿Lo cargo?", { tipo: "cmd", cmd: cmd, b: b });
  }
  function ejecutar(acc){
    var b = acc.b || {}, s = b.sid ? stockId(b.sid) : null;
    function stk(delta){ s.cantidad = Math.max(0, (+s.cantidad || 0) + delta); return guardarFila("stock", s); }
    if (acc.cmd === "entra" || acc.cmd === "gabriel") return stk(b.n).then(function(){ return "Listo ✓ «" + s.producto + "» ahora tiene " + s.cantidad + "."; });
    if (acc.cmd === "sale") return stk(-b.n).then(function(){ return "Listo ✓ «" + s.producto + "» ahora tiene " + s.cantidad + "."; });
    if (acc.cmd === "lleve"){
      var t = tejPor(b.tej); if (!t) return Promise.resolve("No encontré a " + b.tej + " en Equipo 🙈");
      var enc = arr(t.encargos); enc.push({ id: uid("enc"), que: b.que, cant: b.n, fecha: hoyISO(), estado: "curso", nota: "", retiros: [], cambiado: Date.now() }); t.encargos = enc;
      return guardarFila("tejedoras", t).then(function(){ return stk(-b.n); }).then(function(){ return "Listo ✓ Le anoté a " + t.nombre + " " + b.n + " " + b.que + " y quedan " + s.cantidad + " armazones."; });
    }
    if (acc.cmd === "tej"){
      var tj = tejPor(b.tej); if (!tj) return Promise.resolve("No encontré a " + b.tej + " en Equipo 🙈");
      var en = arr(tj.encargos), q = nrm(b.que).split(" "), e = en.filter(function(x){ return x.estado !== "listo" && q.every(function(w){ return nrm(x.que).indexOf(w) >= 0 || /^\d+$/.test(w) && nrm(x.que).indexOf(w) >= 0; }); })[0];
      if (e){ e.retiros = arr(e.retiros).concat([{ cant: b.n, fecha: hoyISO() }]); var tot = e.retiros.reduce(function(a, r){ return a + (+r.cant || 0); }, 0); if (tot >= (+e.cant || 0)) e.estado = "listo"; e.cambiado = Date.now(); }
      tj.encargos = en;
      if (b.precio){ tj.cargos = arr(tj.cargos).concat([{ monto: b.precio * b.n, fecha: hoyISO(), concepto: b.n + " × " + b.que + " retiradas", por: soy() }]); }
      return guardarFila("tejedoras", tj).then(function(){ return stk(b.n); }).then(function(){ return "Listo ✓ Sumé " + b.n + " al stock (" + s.cantidad + " en total)" + (e ? " y lo marqué en el encargo de " + tj.nombre : "") + "."; });
    }
    if (acc.cmd === "pagotej"){
      var tp = (ST().tejedoras || []).find(function(t){ return t.id === b.tej; }); if (!tp) return Promise.resolve("No encontré a esa persona en Equipo 🙈");
      tp.pagos = arr(tp.pagos).concat([{ monto: b.monto, fecha: hoyISO(), nota: b.nota || "desde Luci", por: soy() }]);
      var cgs = arr(tp.cargos).reduce(function(a, c){ return a + (+c.monto || 0); }, 0), pgs = arr(tp.pagos).reduce(function(a, c){ return a + (+c.monto || 0); }, 0);
      return guardarFila("tejedoras", tp).then(function(){ return "Listo ✓ Cargué " + plata(b.monto) + " a " + tp.nombre + ". " + (cgs - pgs > 0 ? "Te faltó pagar " + plata(cgs - pgs) + "." : cgs - pgs < 0 ? "Tenés un saldo a favor de " + plata(pgs - cgs) + " 💚" : "Quedó al día ✓"); });
    }
    if (acc.cmd === "pago"){
      var pv = provs().find(function(p){ return p.id === b.pv; }), d = pv && pedidosDe(pv).find(function(x){ return x.id === b.d; });
      if (!d) return Promise.resolve("No encontré ese pedido 🙈");
      d.pagos = (d.pagos || []).concat([{ monto: b.monto, fecha: hoyISO(), nota: b.nota || "desde Luci", por: soy() }]);
      var sal = Math.max(0, (+d.total || 0) - pagado(d)), tt = tipoDe(pv.proveedor, d), e2 = etapaDe(pv, d);
      if (b.sena && tt === "encargo" && e2 === "cotizado") aplicarEtapa(d, "sena");
      else if ((+d.total || 0) && !sal) aplicarEtapa(d, tt === "encargo" ? (["cotizado","sena"].indexOf(e2) >= 0 ? "listo" : e2) : (e2 === "pedido" ? "pagado" : e2));
      return guardarProv(pv).then(function(){ return "Listo ✓ Cargué " + plata(b.monto) + " a " + pv.proveedor + ". " + ((+d.total || 0) ? (sal ? "Te faltó pagar " + plata(sal) + "." : pagado(d) > (+d.total || 0) ? "Tenés un saldo a favor de " + plata(pagado(d) - (+d.total || 0)) + " 💚" : "Quedó al día ✓") : ""); });
    }
    if (acc.cmd === "etapa"){
      var pv2 = provs().find(function(p){ return p.id === b.pv; }), d2 = pv2 && pedidosDe(pv2).find(function(x){ return x.id === b.d; });
      if (!d2) return Promise.resolve("No encontré ese pedido 🙈");
      aplicarEtapa(d2, b.e); return guardarProv(pv2).then(function(){ return "Listo ✓ " + pv2.proveedor + " → " + ETQ[b.e] + "."; });
    }
    if (acc.cmd === "pedido"){
      var pv3 = provs().find(function(p){ return p.id === b.pv; }); if (!pv3) return Promise.resolve("No encontré ese proveedor 🙈");
      var nd = { id: uid("pd"), orden: "", total: b.total || 0, vence: "", nota: "", pagos: b.pagado ? [{ monto: b.pagado, fecha: hoyISO(), nota: "desde Luci", por: soy() }] : [], estado: "espera", detalle: b.det, fecha: hoyISO(), retiro: "", retiroOk: false };
      aplicarEtapa(nd, b.pagado ? "deposito" : FLU[tipoDe(pv3.proveedor)][0][0]); pv3.pedidos = pedidosDe(pv3).concat([nd]);
      return guardarProv(pv3).then(function(){ return "Listo ✓ Anoté el pedido a " + pv3.proveedor + ". Te aviso cuando haya que pagar o retirar 😉"; });
    }
    return Promise.resolve("No sé hacer eso todavía 🙈");
  }
  /* ---------- tejedoras: cuenta clara ---------- */
  function tjHrs(h){ return (+h.horas || 0) * (+h.valor || 0) + (+h.cole || 0); }
  function tjCuenta(t){
    var hs = arr(t.horas);
    var cg = arr(t.cargos).reduce(function(a, c){ return a + (+c.monto || 0); }, 0) + hs.reduce(function(a, h){ return a + tjHrs(h); }, 0);
    var pg = arr(t.pagos).reduce(function(a, c){ return a + (+c.monto || 0); }, 0) + hs.reduce(function(a, h){ return a + Math.min(tjHrs(h), +h.pagado || 0); }, 0);
    return Math.round(cg - pg);
  }
  function tjSaldo(d){ return d > 0 ? "Te falta pagarle " + plata(d) + "." : d < 0 ? "Te queda un saldo a favor de " + plata(-d) + " 💚" : "Estás al día ✓"; }
  function tjLimpio(x){ return nrm(x).replace(/^\s+/, ""); }
  function tjPrecio(t, que){
    var q = tjLimpio(que), rows = [];
    try { var pn = (ST().notas || {}).precios; rows = JSON.parse((pn && pn.texto) || "[]"); } catch(e){ rows = []; }
    var r = (Array.isArray(rows) ? rows : []).filter(function(x){ return x && x.p !== "" && tjLimpio(x.n) === q; })[0];
    if (r && +r.p) return +r.p;
    var cs = arr(t.cargos).filter(function(c){ var m = String(c.concepto || "").match(/^(\d+)\s*×\s*(.*?)\s+retiradas$/); return m && tjLimpio(m[2]) === q && +m[1]; });
    if (cs.length){ var c = cs[cs.length - 1], n = +String(c.concepto).match(/^(\d+)/)[1]; return (+c.monto || 0) / n; }
    return 0;
  }
  function tjPendientes(t){
    return arr(t.encargos).filter(function(e){ return e.estado !== "listo"; }).map(function(e){
      var r = arr(e.retiros).reduce(function(a, x){ return a + (+x.cant || 0); }, 0), q = Math.max(0, (+e.cant || 0) - r), p = tjPrecio(t, e.que);
      return { que: String(e.que || "").replace(/^[•·\s]+/, ""), q: q, p: p, nota: e.nota || "" };
    }).filter(function(x){ return x.q > 0; });
  }
  function fichaTej(t){
    var L = ["🧶 " + t.nombre], ult = "", items = [];
    arr(t.encargos).forEach(function(e){ arr(e.retiros).forEach(function(r){ if ((r.fecha || "") > ult){ ult = r.fecha || ""; items = []; } if ((r.fecha || "") === ult) items.push((+r.cant || 0) + " × " + String(e.que || "").replace(/^[•·\s]+/, "")); }); });
    if (items.length){
      var mt = arr(t.cargos).filter(function(c){ return (c.fecha || "") === ult; }).reduce(function(a, c){ return a + (+c.monto || 0); }, 0);
      L.push("Lo último que retiraste (" + fcorta(ult) + "): " + items.join(", ") + (mt ? " · " + plata(mt) : ""));
    }
    var ps = arr(t.pagos), up = ps.reduce(function(a, p){ return (p.fecha || "") > a ? (p.fecha || "") : a; }, "");
    if (ps.length){ var tp = ps.filter(function(p){ return (p.fecha || "") === up; }).reduce(function(a, p){ return a + (+p.monto || 0); }, 0); L.push("Pagaste " + plata(tp) + (up ? " (" + fcorta(up) + ")" : "")); }
    L.push(tjSaldo(tjCuenta(t)));
    var pe = tjPendientes(t);
    if (pe.length){ var n = pe.reduce(function(a, x){ return a + x.q; }, 0), m = pe.reduce(function(a, x){ return a + x.q * x.p; }, 0); L.push("📌 Falta retirar " + n + (n === 1 ? " pieza" : " piezas") + (m ? " · " + plata(m) : "") + ". Preguntame «¿qué tengo que retirar de " + t.nombre + "?» y te detallo."); }
    return L.join("\n");
  }
  function retirarTej(t){
    var pe = tjPendientes(t);
    if (!pe.length) return "🧶 " + t.nombre + "\nNo tenés nada para retirar ✓\n" + tjSaldo(tjCuenta(t));
    var m = pe.reduce(function(a, x){ return a + x.q * x.p; }, 0), sp = pe.some(function(x){ return !x.p; }), d = tjCuenta(t);
    var L = ["🧶 Para retirar de " + t.nombre + ":"].concat(pe.map(function(x){ return "• " + x.q + " × " + x.que + (x.nota ? " (" + x.nota.toLowerCase() + ")" : "") + (x.p ? " — " + plata(x.q * x.p) : " — sin precio"); }));
    if (m) L.push("Total: " + plata(m) + (sp ? " (sin contar lo que no tiene precio)" : ""));
    if (m && d < 0) L.push("Tenés " + plata(-d) + " a favor, así que al retirar pagarías " + plata(Math.max(0, m + d)) + ".");
    else if (m && d > 0) L.push("Ojo: además le debés " + plata(d) + " de antes → total " + plata(m + d) + ".");
    return L.join("\n");
  }
  function retirarTodas(){
    var ts = (ST().tejedoras || []).filter(function(t){ return !t.borrado && tjPendientes(t).length; });
    if (!ts.length) return "No hay nada pendiente para retirar ✓";
    return ts.map(retirarTej).join("\n\n");
  }
  function ver(q){
    var pv = provPor(q);
    if (pv){
      var ds = pedidosDe(pv).filter(function(d){ return etapaDe(pv, d) !== "deposito"; });
      var debe = pedidosDe(pv).reduce(function(a, d){ return a + Math.max(0, (+d.total || 0) - pagado(d)); }, 0);
      return luci("📦 " + pv.proveedor + "\n" + (debe ? "Te falta pagarle " + plata(debe) + "." : "Estás al día ✓") + "\n" +
        (ds.length ? ds.map(function(d){ return "• " + resumen(d) + " — " + ETQ[etapaDe(pv, d)] + (d.vence ? " · vence " + fcorta(d.vence) : ""); }).join("\n") : "No hay pedidos abiertos."));
    }
    var t = tejPor(q);
    if (t) return luci(fichaTej(t));
    var ss = stockPor(q);
    if (ss.length) return luci("🔎 " + q + "\n" + ss.map(function(s){ return "• " + s.producto + ": " + (+s.cantidad || 0) + ((s.tipo || "") === "armazon" ? " (armazón)" : ""); }).join("\n"));
    return luci("No encontré nada con «" + q + "» 🙈");
  }
  function procesar(t){
    var m = String(t).trim().match(/^\/(\S+)\s*([\s\S]*)$/); if (!m){ return; }
    var c = nrm(m[1]), r = m[2].trim(), n = cantDe(r) || 1;
    if (/^(agreg|carg|anot|sum|registr)/.test(c) && /^(un |el )?pagos?\b/i.test(r)){ c = "pague"; r = r.replace(/^(un |el )?pagos?\s*/i, ""); }
    if (c === "pagamos" || c === "pagaste" || c === "pague" || c === "pagar") c = "pague";
    if (c === "ayuda" || c === "comandos") return luci(AYUDA);
    if (c === "ver" || c === "info") return ver(r);
    if (c === "entra" || c === "sale") return elegir(c, { n: n }, stockPor(sinCant(r)));
    if (c === "gabriel" || c === "herrero") return elegir("gabriel", { n: n }, stockPor(sinCant(r), "armazon"));
    if (c === "lleve" || c === "llevamos"){ var p = r.split(/\s+/), tj = p.shift(), rest = p.join(" "); return elegir("lleve", { n: cantDe(rest) || 1, tej: tj.charAt(0).toUpperCase() + tj.slice(1), que: sinCant(rest) }, stockPor(sinCant(rest), "armazon")); }
    var tej = tejPor(c);
    if (tej){
      var que = sinCant(r), precio = 0, w = nrm(que).split(" ");
      arr(tej.cargos).slice().reverse().some(function(cg){ var cc = nrm(cg.concepto), k = String(cg.concepto || "").match(/^(\d+)\s*[x×]/); if (w.every(function(x){ return cc.indexOf(x) >= 0; }) && k){ precio = Math.round((+cg.monto || 0) / (+k[1] || 1)); return true; } return false; });
      return elegir("tej", { n: n, tej: tej.nombre, que: que, precio: precio }, stockPor(que, "terminado"));
    }
    var prov = c === "pedido" || c === "sena" || c === "pague" || c === "pago" || c === "retiro" || c === "llego" ? c : "";
    if (prov){
      var qn = quien(r), pv = qn.pv || null, pp = [qn.w || ""], resto = r.replace(new RegExp("\\b(a|al|de|del)?\\s*" + (qn.w || "§").replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"), " ").trim();
      var tq = !pv && (prov === "pague" || prov === "pago") ? (qn.tj || tejPor(pp[0] || "")) : null;
      if (tq){
        var mt = plataN2(resto); if (!mt) return luci("¿De cuánto fue? Ej: /" + m[1] + " " + pp[0] + " $30.000");
        var nt = resto.replace(/\$?\s*\d[\d.,]*\s*(mil|k)?/gi, " ").replace(/\b(a|al|de|pesos|porfa|por favor|carg[aá]lo|cargalo)\b/gi, " ").replace(/c[aá]rgalo/gi, " ").replace(/\s+/g, " ").trim();
        return luci("Voy a cargar un pago de " + plata(mt) + " a " + tq.nombre + " en Equipo" + (nt ? " (" + nt + ")" : "") + ".\n¿Lo cargo?", { tipo: "cmd", cmd: "pagotej", b: { tej: tq.id, monto: mt, nota: nt } });
      }
      if (!pv) return luci("¿De qué proveedor? No encontré «" + (pp[0] || "") + "» 🙈");
      if (prov === "pedido") return luci("Voy a anotar un pedido nuevo a " + pv.proveedor + ":\n" + (resto || "(sin detalle)") + (plataN(resto) ? "\nTotal " + plata(plataN(resto)) : "") + "\n¿Lo cargo?", { tipo: "cmd", cmd: "pedido", b: { pv: pv.id, det: resto.replace(/\$\s*[\d.,]+/, "").trim() || "Pedido", total: plataN(resto) } });
      var d = (prov === "pague" || prov === "pago") ? pedConDeuda(pv) : pedAbierto(pv);
      if (!d && (prov === "pague" || prov === "pago")){ var mo = plataN2(resto); if (!mo) return luci("¿De cuánto fue? Ej: /pagué " + pp[0] + " $200.000"); return luci(pv.proveedor + " no tiene pedidos con deuda. ¿Anoto un pedido nuevo ya pagado de " + plata(mo) + "?", { tipo: "cmd", cmd: "pedido", b: { pv: pv.id, det: "Pago a " + pv.proveedor, total: mo, pagado: mo } }); }
      if (!d) return luci(pv.proveedor + " no tiene pedidos abiertos. Si es nuevo, usá /pedido " + pp[0] + " …");
      if (prov === "sena" || prov === "pague" || prov === "pago"){
        var monto = plataN2(resto); if (!monto) return luci("¿De cuánto fue? Ej: /" + m[1] + " " + pp[0] + " $200.000");
        return luci("Voy a cargar un pago de " + plata(monto) + " a " + pv.proveedor + " (pedido " + fcorta(d.fecha) + ": " + resumen(d, 1) + ").\n¿Lo cargo?", { tipo: "cmd", cmd: "pago", b: { pv: pv.id, d: d.id, monto: monto, sena: prov === "sena" } });
      }
      var e = prov === "retiro" ? (tipoDe(pv.proveedor, d) === "encargo" ? "retiro" : "traslado") : "deposito";
      return luci("Voy a pasar el pedido de " + pv.proveedor + " (" + resumen(d, 1) + ") a «" + ETQ[e] + "».\n¿Lo cargo?", { tipo: "cmd", cmd: "etapa", b: { pv: pv.id, d: d.id, e: e } });
    }
    return luci("Mmm, ese comando no lo conozco 🙈 Escribí /ayuda y te muestro los que sé.");
  }
  /* ---------- Luci con IA: arma un resumen del tablero y pregunta ---------- */
  function luContexto(){
    var S = ST(), o = {};
    o.proveedores = provs().map(function(pv){ return { nombre: pv.proveedor, pedidos: pedidosDe(pv).filter(function(d){ return etapaDe(pv, d) !== "deposito" || (+d.total || 0) > pagado(d) || (d.fecha || "") >= hoyMenos(60); }).map(function(d){ return { fecha: d.fecha, detalle: String(d.detalle || "").slice(0, 300), total: +d.total || 0, pagado: pagado(d), etapa: ETQ[etapaDe(pv, d)] || "", vence: d.vence || "", pagos: arr(d.pagos).map(function(p){ return [p.fecha || "", +p.monto || 0]; }) }; }) }; });
    o.equipo = (S.tejedoras || []).filter(function(t){ return !t.borrado; }).map(function(t){ var d = tjCuenta(t); return { nombre: t.nombre, tipo: t.tipo || "tejedora", saldo: d, saldo_txt: d > 0 ? "le deben " + d : d < 0 ? "saldo a favor de Nervo " + (-d) : "al dia", falta_retirar: tjPendientes(t).map(function(x){ return [x.q, x.que, x.q * x.p]; }), ultimos_retiros: arr(t.cargos).slice(-6).map(function(c){ return [c.fecha, c.concepto, +c.monto || 0]; }), ultimos_pagos: arr(t.pagos).slice(-6).map(function(p){ return [p.fecha, +p.monto || 0]; }) }; });
    o.stock = (S.stock || []).filter(function(s){ return !s.borrado; }).map(function(s){ return [s.producto, (s.tipo || "terminado") === "armazon" ? "armazon" : "terminado", +s.cantidad || 0]; });
    o.tareas_abiertas = (S.tareas || []).filter(function(t){ return !t.borrado && t.estado !== "hecha" && t.estado !== "lista" && !t.hecha; }).slice(0, 80).map(function(t){ return [t.titulo || t.texto || "", t.resp || "", t.fecha || "", t.prio || ""]; });
    var B = S.bzData || {}; o.pedidos_clientes_abiertos = [].concat(B.min || [], B.may || []).filter(function(x){ return !/ENVIAD|ENTREGAD|CANCEL/.test(luEnvC(x)) && (x.fecha || "") >= hoyMenos(45); }).map(function(x){ return { venta: x.venta || "", cliente: x.cliente || "", estado: luEnvC(x), productos: arr(x.prods), cant: x.cant || "", fecha: x.fecha || "" }; });
    var V = S.ven; if (V && V.ord){ var mes = hoyISO().slice(0, 7), om = V.ord.filter(function(x){ return String(x.f || "").slice(0, 7) === mes; }); o.ventas_mes = { cantidad: om.length, facturado: om.reduce(function(a, x){ return a + (+x.t || 0); }, 0), ultimas: om.slice(-15).map(function(x){ return [x.f, x.v, x.c, +x.t || 0]; }) }; o.productos_vendidos_mes = (V.items || []).filter(function(x){ return x.m === mes; }).map(function(x){ return [x.p, x.q]; }); }
    try { o.rutina_hoy = textoChat(); } catch(e){}
    o.lo_que_nos_contaron_las_chicas = LSAB.l;
    return JSON.stringify(o);
  }
  var LSAB = { l: [], at: 0 };
  function luSaber(){
    if (!sb() || Date.now() - LSAB.at < 5 * 60e3) return; LSAB.at = Date.now();
    sb().from("registros").select("data").eq("tabla", "luci_saber").eq("borrado", false).then(function(r){ if (!r.error) LSAB.l = (r.data || []).map(function(x){ return x.data && x.data.texto; }).filter(Boolean); }, function(){});
  }
  setTimeout(function(){ try { luSaber(); } catch(e){} }, 3000); setInterval(function(){ try { luSaber(); } catch(e){} }, 5 * 60e3);
  function luAprender(t){
    var id = "sab-" + Date.now().toString(36), q = t.replace(/^(luci[,:]?\s*)?(aprend[eé]|acordate|record[aá]|anot[aá] que|sab[eé] que)\s*(que\s*)?[:,]?\s*/i, "").trim();
    if (q.length < 4){ luci("¿Qué querés que aprenda? Escribime por ejemplo: aprendé que Gabriel tarda hasta 1 semana."); return; }
    sb().from("registros").upsert({ tabla: "luci_saber", id: id, data: { id: id, texto: q, por: soy(), fecha: hoyISO() }, borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(r){
      if (r.error){ luci("No pude guardarlo 🙈 Probá de nuevo."); return; } LSAB.l.push(q); luci("Anotado ✓ Ya lo sé: «" + q + "» 📝");
    });
  }
  function luEnvC(x){ var e = x.env || x.estado || ""; if (Array.isArray(e)) e = e.join(" "); return String(e).toUpperCase().trim(); }
  function hoyMenos(n){ var d = new Date(Date.now() - n * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function luciPiensa(t, siFalla){
    var run = window.google && google.script && google.script.run; if (!run){ siFalla(); return; }
    LC.tip = true; lcPintar();
    var hist = LC.msgs.slice(-8, -1).map(function(m){ return { yo: m.por !== "luci", t: m.texto }; }), fin = false;
    function listo(){ if (fin) return false; fin = true; LC.tip = false; lcPintar(); return true; }
    setTimeout(function(){ if (listo()) luci("Uy, me estoy tardando mucho 🙈 Probá de nuevo en un ratito."); }, 45000);
    try {
      run.withSuccessHandler(function(r){ if (!listo()) return; if (r && r.t) luci(String(r.t).replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[*-]\s+/gm, "• ").replace(/^#+\s*/gm, "")); else siFalla(); })
        .withFailureHandler(function(e){ if (!listo()) return; var m = String(e && e.message || e); if (/no disponible/i.test(m)) siFalla(); else if (/429|quota/i.test(m)) luci("Hoy ya usé todas mis consultas de IA 🙈 Mañana vuelvo a poder. Mientras tanto probá /ayuda."); else luci("Uy, no pude pensar eso ahora 🙈 Probá de nuevo en un rato."); })
        .luciIA(t, luContexto(), hist);
    } catch(e){ listo(); siFalla(); }
  }
  function lcMandar(t){
    t = String(t || "").trim(); if (!t) return;
    var cmdT = t.charAt(0) === "/" ? t : (/^(pagu[eé]|pago|pagamos|se[ñn]a|lleg[oó]|retiro|entra|sale|ver|pedido|llev[eé]|ayuda|agreg\S*|carg\S*|anot\S*)(?=\s|$)/i.test(t) ? "/" + t : (tejPor(t.split(/\s+/)[0]) && /\d/.test(t) ? "/" + t : ""));
    lcEnviar(t, soy() || "euge").then(function(){
      if (cmdT){ t = cmdT; }
      else {
        if (/^(ver\s+|los\s+)?seguimientos?\b/i.test(t)){ segAbrir(); return; }
        if (/^(conteo|contar|d[ií]a cero|contar stock|conteo de stock)\b/i.test(t)){ c0Abrir(); return; }
        if (/^(luci[,:]?\s*)?(aprend[eé]|acordate|record[aá]|anot[aá] que|sab[eé] que)\b/i.test(t)){ luAprender(t); return; }
        var qq = quien(t), pal = t.split(/\s+/).length;
        if (/retir/i.test(t) && !qq.pv && (qq.tj || !/\b(aurora|licari|grass|bicentenario)\b/i.test(t))){ LC.tip = true; lcPintar(); setTimeout(function(){ LC.tip = false; luci(qq.tj ? retirarTej(qq.tj) : retirarTodas()); }, 450); return; }
        if ((qq.pv || qq.tj) && (pal <= 2 || /saldo|favor|deb[oe]|debemos|deuda|al d[ií]a/i.test(t))){ LC.tip = true; lcPintar(); setTimeout(function(){ LC.tip = false; ver(qq.w); }, 450); return; }
        luciPiensa(t, function(){ if (qq.pv || qq.tj) ver(qq.w); else luci("Mmm, esa no la sé todavía 🙈 Probá /ayuda y te muestro lo que sé hacer."); });
        return;
      }
      if (t.charAt(0) === "/") { LC.tip = true; lcPintar(); setTimeout(function(){ LC.tip = false; try { procesar(t); } catch(e){ luci("Uy, algo me salió mal 🙈 Probá de nuevo."); } }, 450); }
    });
  }
  function lcAccion(id, x, i){
    var m = LC.msgs.find(function(z){ return z.id === id; }); if (m && m.acc && m.acc.tipo === "seg"){ segAbrir(); return; } if (m && m.acc && m.acc.tipo === "conteo"){ c0Abrir(); return; } if (!m || m.est) return;
    if (m.acc && m.acc.tipo === "pedok"){
      lcMarcar(m, x === "no" ? "no" : "ok");
      if (x === "no"){ luci("Dale, mañana a las 18 te lo vuelvo a recordar 😉"); return; }
      sb().from("registros").upsert({ tabla: "luci_ok", id: m.acc.ok, data: { id: m.acc.ok, txt: m.acc.txt, por: soy(), fecha: hoyISO() }, borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(){ luci("Genial, lo taché ✓ (" + (soy() === "pau" ? "Pau" : "Euge") + ": " + m.acc.txt.replace(/^No hay /, "") + " pedido)"); });
      return;
    }
    if (x === "no"){ lcMarcar(m, "no"); luci("Dale, no toco nada 👍"); return; }
    if (m.acc && m.acc.tipo === "elegir"){ var op = m.acc.ops[+i]; if (!op) return; lcMarcar(m, "ok"); var b = m.acc.base; b.sid = op[0]; luciPropone(m.acc.cmd, b); return; }
    lcMarcar(m, "ok");
    ejecutar(m.acc).then(function(t){ luci(t); }, function(e){ luci("No pude guardarlo 🙈 (" + (e && e.message || e) + ")"); });
  }

  /* ---- aprobaciones desde #movimientos ---- */
  var LCMOV = 0;
  function lcMovs(){
    if (!sb() || !provs().length || Date.now() - LCMOV < 60e3) return; LCMOV = Date.now();
    var desde = new Date(Math.max(Date.now() - 2 * 864e5, LUCI_INICIO)).toISOString();
    sb().from("movimientos").select("id,texto,autor,monto,contraparte,signo,creado").gte("creado", desde).order("id", { ascending: false }).limit(60).then(function(r){
      (r.data || []).forEach(function(mv){
        if (!(+mv.monto > 0) || mv.signo === "ingreso") return;
        var txt = (mv.contraparte || "") + " " + (mv.texto || ""), pv = null;
        nrm(txt).split(" ").some(function(w){ if (w.length < 4) return false; var p = provPor(w); if (p){ pv = p; return true; } return false; });
        if (!pv){
          var tm = null; (ST().tejedoras || []).some(function(t){ var k = nrm(t.nombre).split(" ")[0]; if (k.length > 2 && nrm(txt).split(" ").indexOf(k) >= 0){ tm = tejPor(k); return true; } return false; });
          if (!tm) return; var idt = "luci-mv-" + mv.id;
          sb().from("registros").select("id").eq("tabla", "chat").eq("id", idt).then(function(x){
            if (x.error || (x.data && x.data.length)) return;
            var now = Date.now(), data = { id: idt, adj: [], por: "luci", reac: {}, canal: "luci", texto: "Vi en #movimientos un pago de " + plata(mv.monto) + " a " + tm.nombre + " 🧶\n¿Lo cargo en su cuenta de Equipo?", creado: now, borrado: false, cambiado: now, acc: { tipo: "cmd", cmd: "pagotej", b: { tej: tm.id, monto: +mv.monto, nota: "desde #movimientos" } } };
            sb().from("registros").upsert({ tabla: "chat", id: idt, data: data, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){ if (!w.error){ luciPush("Pago a " + tm.nombre + " para aprobar", idt); lcLeer(); } });
          });
          return;
        }
        var d = pedAbierto(pv); if (!d) return;
        var id = "luci-mv-" + mv.id;
        sb().from("registros").select("id").eq("tabla", "chat").eq("id", id).then(function(x){
          if (x.error || (x.data && x.data.length)) return;
          var now = Date.now(), t = "Vi en #movimientos un pago de " + plata(mv.monto) + " a " + pv.proveedor + " 💳\n¿Lo cargo al pedido del " + fcorta(d.fecha) + " (" + resumen(d, 1) + ")?";
          var data = { id: id, adj: [], por: "luci", reac: {}, canal: "luci", texto: t, creado: now, borrado: false, cambiado: now, acc: { tipo: "cmd", cmd: "pago", b: { pv: pv.id, d: d.id, monto: +mv.monto, nota: "desde #movimientos" } } };
          sb().from("registros").upsert({ tabla: "chat", id: id, data: data, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){ if (!w.error){ luciPush("Pago a " + pv.proveedor + " para aprobar", id); lcLeer(); } });
        });
      });
    }, function(){});
  }
  setInterval(function(){ try { lcMovs(); } catch(e){} }, 30000);

  /* ---- interfaz: botón en la lista de canales + panel ---- */
  var LCSS = [
    "#nluChb{display:flex!important;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:12px 14px;margin:10px 0 6px;border:1px solid #F1E4EA;border-radius:14px;background:#fff;box-shadow:0 4px 14px rgba(138,79,101,.10);text-align:left;font:inherit;color:#2A211C;cursor:pointer}",
    "#nluChb.on{background:#FBF3F6;border-color:#EAD6DE}",
    "#nluChb .av{width:46px;height:46px;min-width:46px;border-radius:50%;overflow:hidden;background:#F3E4EA;box-shadow:0 0 0 3px #fff,0 2px 8px rgba(138,79,101,.18)}",
    "#nluChb .av img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;display:block}",
    "#nluChb .tx{flex:1;min-width:0}#nluChb .r1{display:flex;align-items:baseline;gap:8px}#nluChb .r1 b{font-weight:600;font-size:16px;flex:1}",
    "#nluChb .tm{font-style:normal;font-size:12px;color:#ABA097}",
    "#nluChb .pv{display:block;font-size:13.5px;color:#7A6D64;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}",
    "#nluBadge{background:#8A4F65;color:#fff;font-size:11px;font-weight:600;border-radius:9px;padding:2px 7px;flex:none}",
    "#nluPane{position:fixed;z-index:60;background:#fff;display:flex;flex-direction:column;font-family:Outfit,system-ui,sans-serif;color:#2A211C;border-left:1px solid #EFEBE7}",
    "#nluPane *{box-sizing:border-box}",
    "#nluPane .hd{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#F3E4EA;border-bottom:1px solid #EAD6DE}",
    "#nluPane .hd .av{width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid #fff;flex:none}#nluPane .hd .av img{width:100%;height:100%;object-fit:cover;animation:nluResp 4s ease-in-out infinite;transform-origin:50% 90%}",
    "#nluPane .hd b{font-size:16px;display:block}#nluPane .hd span{font-size:12px;color:#6E5560}",
    "#nluPane .hd .x{margin-left:auto;border:1px solid #EAD6DE;background:#fff;border-radius:8px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer;color:#8A4F65}",
    "#nluPane .ms{flex:1;overflow:auto;padding:14px 16px;background:#FFFCFA;display:flex;flex-direction:column;gap:9px}",
    "#nluPane .m{display:flex;gap:8px;align-items:flex-end;max-width:88%}#nluPane .m.yo{align-self:flex-end;flex-direction:row-reverse}",
    "#nluPane .m .a{width:26px;height:26px;border-radius:50%;overflow:hidden;flex:none;background:#F3E4EA;display:grid;place-items:center;font-size:11px;font-weight:600;color:#8A4F65}#nluPane .m .a img{width:100%;height:100%;object-fit:cover}",
    "#nluPane .m .b{background:#fff;border:1px solid #EFEBE7;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-break:break-word}",
    "#nluPane .m.yo .b{background:#5A4334;color:#fff;border-color:#5A4334;border-radius:12px 12px 4px 12px}",
    "#nluPane .m.otra .b{background:#F7F3EF}",
    "#nluPane .m small{display:block;font-size:10.5px;color:#ABA097;margin-top:3px}#nluPane .m.yo small{color:#E5D6CB}",
    "#nluPane .bt{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}",
    "#nluPane .bt button{padding:7px 12px;border-radius:7px;font:inherit;font-size:13px;font-weight:500;border:1px solid #E3DCD5;background:#fff;color:#2A211C;cursor:pointer}",
    "#nluPane .bt button.dk{background:#5A4334;color:#fff;border-color:#5A4334}",
    "#nluPane .est{font-size:12px;color:#7A6D64;margin-top:6px}",
    "#nluPane .tip{font-size:12px;color:#ABA097;font-style:italic;padding-left:34px}",
    "#nluPane .ch{display:flex;gap:6px;flex-wrap:wrap;padding:8px 12px 0;background:#fff;border-top:1px solid #F1ECE7}",
    "#nluPane .ch button{font:inherit;font-size:12px;border:1px solid #EAD6DE;background:#FBF6F8;color:#8A4F65;border-radius:20px;padding:4px 10px;cursor:pointer}",
    "#nluPane form{display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:#fff}",
    "#nluPane textarea{flex:1;border:1px solid #E3DCD5;border-radius:10px;padding:10px 12px;font:inherit;font-size:16px;resize:none;height:44px;outline:none}",
    "#nluPane form button{border:0;border-radius:10px;background:#8A4F65;color:#fff;font:inherit;font-weight:600;padding:0 16px;cursor:pointer}",
    ".nlu-chon .chmain{visibility:hidden}"
  ].join("\n");
  (function(){ var s = document.createElement("style"); s.textContent = LCSS; document.head.appendChild(s); })();
  function hora(t){ var d = new Date(t || Date.now()); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function lcPintar(){
    var P = LC.pane; if (!P) return; var box = P.querySelector(".ms"), abajo = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    var me = soy();
    box.innerHTML = (LC.msgs.length ? "" : '<div class="m"><div class="a"><img src="' + LUCI_IMG + '"></div><div class="b">¡Hola! Soy Luci 🌷 Escribime /ayuda y te muestro lo que sé hacer.</div></div>') + LC.msgs.map(function(m){
      var lu = m.por === "luci", yo = !lu && m.por === me, a = m.acc, bt = "";
      if (a && !m.est){
        if (a.tipo === "elegir") bt = '<div class="bt">' + a.ops.map(function(o, i){ return '<button data-lc="' + m.id + '" data-x="ok" data-i="' + i + '">' + esc(o[1]) + '</button>'; }).join("") + '<button data-lc="' + m.id + '" data-x="no">Ninguno</button></div>';
        else if (a.tipo === "conteo") bt = '<div class="bt"><button class="dk" data-lc="' + m.id + '" data-x="c0">📦 Abrir conteo</button></div>';
        else if (a.tipo === "seg") bt = '<div class="bt"><button class="dk" data-lc="' + m.id + '" data-x="seg">📋 Ver seguimientos</button></div>';
        else if (a.tipo === "pedok") bt = '<div class="bt"><button class="dk" data-lc="' + m.id + '" data-x="ok">Ya está pedido ✓</button><button data-lc="' + m.id + '" data-x="no">Todavía no</button></div>';
        else bt = '<div class="bt"><button class="dk" data-lc="' + m.id + '" data-x="ok">Sí, cargalo</button><button data-lc="' + m.id + '" data-x="no">No</button></div>';
      } else if (a && m.est) bt = '<div class="est">' + (a.tipo === "pedok" ? (m.est === "ok" ? "✓ Pedido" : "Pendiente — te lo recuerdo mañana") : m.est === "ok" ? "✓ Aprobado" : "✕ Cancelado") + '</div>';
      return '<div class="m' + (yo ? " yo" : lu ? "" : " otra") + '">' + (yo ? "" : '<div class="a">' + (lu ? '<img src="' + LUCI_IMG + '">' : esc(String(m.por || "?").charAt(0).toUpperCase())) + '</div>') +
        '<div class="b">' + esc(m.texto).replace(/@(Pau|Euge)/g, "<b>@$1</b>") + bt + '<small>' + (lu || yo ? "" : esc(m.por === "pau" ? "Pau" : m.por === "euge" ? "Euge" : m.por) + " · ") + hora(m.creado) + '</small></div></div>';
    }).join("") + (LC.tip ? '<div class="tip">Luci está escribiendo…</div>' : "");
    if (abajo || LC.primera){ box.scrollTop = box.scrollHeight; LC.primera = false; }
  }
  function lcBadge(){
    var b = document.getElementById("nluBadge"); if (!b) return;
    var n = LC.msgs.filter(function(m){ return m.por === "luci" && (m.creado || 0) > LC.visto; }).length;
    b.textContent = n || ""; b.style.display = n && !LC.open ? "" : "none";
  }
  function lcPos(){
    var P = LC.pane; if (!P) return;
    var mn = document.querySelector(".chw .chmain"), movil = window.innerWidth < 760;
    if (!mn || movil){ P.style.left = "0"; P.style.top = "0"; P.style.width = "100%"; P.style.height = "100%"; P.style.zIndex = "9500"; return; }
    var r = mn.getBoundingClientRect(); P.style.left = r.left + "px"; P.style.top = r.top + "px"; P.style.width = r.width + "px"; P.style.height = r.height + "px"; P.style.zIndex = "60";
  }
  function lcAbrir(){
    LC.open = true; LC.visto = Date.now(); try { localStorage.setItem("nvLuciVisto", String(LC.visto)); } catch(e){}
    if (!LC.pane){
      var P = document.createElement("div"); P.id = "nluPane";
      P.innerHTML = '<div class="hd"><div class="av"><img src="' + LUCI_IMG + '"></div><div><b>Luci</b><span>● en línea · compras, pagos, stock y producción</span></div><button class="x" type="button">Cerrar</button></div><div class="ms"></div>' +
        '<div class="ch"><button type="button" data-q="/ayuda">¿Qué sabés hacer?</button><button type="button" data-q="/ver ">/ver</button><button type="button" data-q="/pagué ">/pagué</button><button type="button" data-q="/iris ">/iris</button><button type="button" data-q="/entra ">/entra</button></div>' +
        '<form><textarea placeholder="Escribile a Luci… (ej: /ver aurora)"></textarea><button type="submit">Enviar</button></form>';
      document.body.appendChild(P); LC.pane = P;
      P.querySelector(".x").onclick = lcCerrar;
      var ta = P.querySelector("textarea");
      P.querySelector("form").onsubmit = function(e){ e.preventDefault(); var t = ta.value; ta.value = ""; lcMandar(t); };
      ta.onkeydown = function(e){ if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); P.querySelector("form").onsubmit(e); } };
      P.querySelector(".ch").onclick = function(e){ var b = e.target.closest("[data-q]"); if (!b) return; if (b.dataset.q === "/ayuda"){ lcMandar("/ayuda"); return; } ta.value = b.dataset.q; ta.focus(); };
      P.querySelector(".ms").onclick = function(e){ var b = e.target.closest("[data-lc]"); if (!b) return; lcAccion(b.dataset.lc, b.dataset.x, b.dataset.i); };
    }
    LC.pane.style.display = "flex"; LC.primera = true; lcPos(); lcPintar(); lcLeer(); lcBadge();
    var w = document.querySelector(".chw"); if (w) w.classList.add("nlu-chon");
    var cb = document.getElementById("nluChb"); if (cb) cb.classList.add("on");
  }
  function lcCerrar(){ LC.open = false; if (LC.pane) LC.pane.style.display = "none"; var w = document.querySelector(".chw"); if (w) w.classList.remove("nlu-chon"); var cb = document.getElementById("nluChb"); if (cb) cb.classList.remove("on"); }
  function lcMontar(){
    var mov = document.querySelector(".chw .chb.nvmovtop"), w = document.querySelector(".chw");
    if (!mov || !w){ if (LC.open) lcCerrar(); return; }
    if (!document.getElementById("nluChb")){
      var b = document.createElement("button"); b.type = "button"; b.id = "nluChb"; b.setAttribute("data-nvg", "top");
      b.innerHTML = '<span class="av"><img src="' + LUCI_IMG + '" alt=""></span><span class="tx"><span class="r1"><b>Luci</b><em class="tm"></em></span><span class="pv">Tu compañera para compras, pagos y stock 🌷</span></span><span id="nluBadge"></span>';
      b.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); lcAbrir(); }, true);
      mov.parentNode.insertBefore(b, mov.nextSibling); lcBadge();
      if (!w.__nlu){ w.__nlu = 1; w.addEventListener("click", function(e){ var o = e.target.closest(".chb"); if (o && o.id !== "nluChb" && LC.open) lcCerrar(); }, true); }
    }
    var cb = document.getElementById("nluChb"); if (cb && cb.previousElementSibling !== mov) mov.parentNode.insertBefore(cb, mov.nextSibling);
    if (cb){
      var ult = LC.msgs.filter(function(m){ return m.por === "luci"; }).slice(-1)[0], cp = cb.querySelector(".pv"), ct = cb.querySelector(".tm");
      if (ult){ var tx = String(ult.texto).replace(/@(Pau|Euge)\s*/g, "").split("\n")[0]; if (cp.textContent !== tx) cp.textContent = tx; var hh = hora(ult.creado); if (ct.textContent !== hh) ct.textContent = hh; }
    }
    if (LC.open){ w.classList.add("nlu-chon"); lcPos(); }
  }
  setInterval(function(){ try { lcMontar(); } catch(e){} }, 700);
  window.addEventListener("resize", function(){ try { lcPos(); } catch(e){} });
  setInterval(function(){ if (!document.hidden && (LC.open || !LC.sig)) lcLeer(); }, 5000);
  setInterval(function(){ if (!document.hidden && !LC.open) lcLeer(); }, 60000);
  window.__nvLuciChat = lcAbrir;
  window.__nvLuciCmd = function(t){ procesar(t); return LC.msgs; }; window.__nvLuciAcc = lcAccion; window.__nvLuciVer = { ctx: luContexto, ficha: fichaTej, retirar: retirarTej, todas: retirarTodas, quien: quien };
  /* ---------- Luci 18:00: pedidos sin armazón / sin stock ---------- */
  var LU_EXT = { aurora: ["mantua", "ravenna", "arezzo"], licari: ["vat", "roma", "pisa"], "la afortunada": ["gaetta"], grass: ["puglia", "cinque", "taormina", "liguria", "lombardia", "arauco", "brescia"] };
  var LU_GEN = { aplique: 1, colgante: 1, velador: 1, de: 1, pie: 1, mesa: 1, luz: 1, tipo: 1, set: 1, x: 1 };
  function luPalabras(s){ return nrm(s).split(" ").filter(function(w){ return w && !LU_GEN[w]; }); }
  function luEnv(x){ var e = x.env || x.estado || ""; if (Array.isArray(e)) e = e.join(" "); return String(e).toUpperCase(); }
  function luAbiertos(){
    var B = ST().bzData || {}, L = [].concat(B.min || [], B.may || []);
    return L.filter(function(x){ return /REVISAR|PARA HACER|EN PROCESO/.test(luEnv(x)); });
  }
  function luFaltantes(){
    var arms = (ST().stock || []).filter(function(s){ return !s.borrado && s.tipo === "armazon"; });
    var ters = (ST().stock || []).filter(function(s){ return !s.borrado && (s.tipo || "terminado") !== "armazon" && (+s.cantidad || 0) > 0; });
    var F = {};
    luAbiertos().forEach(function(x){
      var ps = arr(x.prods).length ? arr(x.prods) : String(x.productos || "").split(/\n|,/).filter(Boolean);
      var cs = String(x.cant || "").split("\n").filter(function(l){ return /\[.\]/.test(l); });
      var vta = x.venta || x.num || x.cliente || "";
      ps.forEach(function(p, i){
        var ln = cs[i] || "", hecho = /\[x\]/i.test(ln), q = +((ln.match(/\]\s*(\d+)/) || [])[1]) || 1;
        if (hecho) return;
        var np = nrm(p), wp = np.split(" "), wq = luPalabras(p).filter(function(z){ return z.length > 1; });
        var hayTer = ters.some(function(s){ var n = nrm(s.producto), nw = n.split(" "); return wq.every(function(z){ return nw.indexOf(z) >= 0 || /\d/.test(z) && n.indexOf(z.replace(/cm$/, "")) >= 0; }); });
        if (hayTer) return;
        /* producto propio: buscar su armazón (todas sus palabras en el nombre del producto) */
        var cand = arms.filter(function(a){ var w = luPalabras(a.producto); return w.length && w.every(function(z){ return wp.indexOf(z) >= 0 || /\d/.test(z) && np.indexOf(z) >= 0; }); });
        cand.sort(function(a, b){ return luPalabras(b.producto).length - luPalabras(a.producto).length; });
        if (cand.length){
          var a = cand[0], wa = luPalabras(a.producto);
          var k = "arm:" + a.id; F[k] = F[k] || { k: k, txt: "No hay armazón " + a.producto, q: 0, hay: +a.cantidad || 0, v: [] }; F[k].q += q; if (F[k].v.indexOf(vta) < 0) F[k].v.push(vta);
          return;
        }
        /* producto de proveedor */
        Object.keys(LU_EXT).some(function(pv){
          var mo = LU_EXT[pv].filter(function(m){ return wp.indexOf(m) >= 0; })[0]; if (!mo) return false;
          var k = "ext:" + np.replace(/\s+/g, ""), nom = pv === "la afortunada" ? "La Afortunada" : pv.charAt(0).toUpperCase() + pv.slice(1);
          F[k] = F[k] || { k: k, txt: "No hay stock de " + String(p).replace(/^(Colgante|Aplique|Velador)\s+/i, "") + " → pedir a " + nom, q: 0, hay: 0, v: [] }; F[k].q += q; if (F[k].v.indexOf(vta) < 0) F[k].v.push(vta);
          return true;
        });
      });
    });
    return Object.keys(F).map(function(k){ return F[k]; }).filter(function(f){ return f.q > f.hay; });
  }
  function luOkId(f){ return "lok-" + f.k.replace(/[^\w:]/g, "") + "-" + f.v.slice().sort().join("_").replace(/\s+/g, ""); }
  /* a las 18: si hoy se retiró de una tejedora y falta pagarle */
  function luciPagosHoy(){
    var hoy = hoyISO();
    (ST().tejedoras || []).filter(function(t){ return !t.borrado && arr(t.cargos).some(function(c){ return c.fecha === hoy; }); }).forEach(function(t){
      var d = tjCuenta(t); if (d <= 0) return;
      var hoyM = arr(t.cargos).filter(function(c){ return c.fecha === hoy; }).reduce(function(a, c){ return a + (+c.monto || 0); }, 0);
      luciDecir("luci-pago-" + t.id + "-" + hoy, "@Pau @Euge Hoy le retiraron a " + t.nombre + " por " + plata(hoyM) + " y le falta cobrar " + plata(d) + " 🧶\nAcuérdense de pagarle hoy. Cuando lo hagan escribime: pagué " + plata(d).replace("$ ", "") + " a " + t.nombre, "Falta pagarle " + plata(d) + " a " + t.nombre);
    });
  }
  var LU6 = 0;
  function luci18(forzar){
    if (!sb() || !(LOADED || ST().loaded) || (!forzar && Date.now() - LU6 < 10 * 60e3)) return Promise.resolve(); LU6 = Date.now();
    var d = new Date(), dw = d.getDay();
    if (!forzar && (dw === 0 || dw === 6 || d.getHours() < 18 || d.getHours() >= 22)) return Promise.resolve();
    try { luciPagosHoy(); } catch(e){}
    if (!ST().bzData) return Promise.resolve();
    var fs = luFaltantes(); if (!fs.length) return Promise.resolve();
    var hoy = hoyISO(), cab = "luci-18-" + hoy;
    return sb().from("registros").select("id").eq("tabla", "luci_ok").then(function(r){
      var ok = {}; (r.data || []).forEach(function(x){ ok[x.id] = 1; });
      fs = fs.filter(function(f){ return !ok[luOkId(f)]; }); if (!fs.length) return;
      return sb().from("registros").select("id").eq("tabla", "chat").eq("id", cab).then(function(x){
        if (x.error || (x.data && x.data.length)) return;
        var now = Date.now(), filas = [{ tabla: "chat", id: cab, data: { id: cab, adj: [], por: "luci", reac: {}, canal: "luci", texto: "@Pau @Euge Chicas, no se olviden de los pedidos 🙏\n" + fs.map(function(f){ return "• " + f.txt; }).join("\n") + "\nCuando esté pedido, tocá el botón así lo tacho.", creado: now, borrado: false, cambiado: now }, borrado: false, actualizado: new Date(now).toISOString(), por: "luci" }];
        fs.forEach(function(f, i){
          var id = "luci-18-" + hoy + "-" + i, t = now + i + 1;
          filas.push({ tabla: "chat", id: id, data: { id: id, adj: [], por: "luci", reac: {}, canal: "luci", texto: f.txt + " (faltan " + (f.q - f.hay) + ")\nPara: " + f.v.join(", "), creado: t, borrado: false, cambiado: t, acc: { tipo: "pedok", ok: luOkId(f), txt: f.txt } }, borrado: false, actualizado: new Date(t).toISOString(), por: "luci" });
        });
        return sb().from("registros").upsert(filas, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){ if (!w.error){ luciPush("Chicas, no se olviden de los pedidos: " + fs.map(function(f){ return f.txt.replace(/^No hay /, ""); }).join(", "), cab); lcLeer(); } });
      });
    }, function(){});
  }
  setInterval(function(){ try { luci18(); } catch(e){} }, 60000);
  window.__nvLuci18 = { faltan: luFaltantes, correr: function(){ LU6 = 0; return luci18(true); } };
  /* pedidos de clientes con más de 12 días sin entregar → aviso diario */
  var LU12 = 0;
  function luci12(forzar){
    if (!sb() || !(LOADED || ST().loaded) || !ST().bzData || (!forzar && Date.now() - LU12 < 15 * 60e3)) return []; LU12 = Date.now();
    var d = new Date(); if (!forzar && (d.getDay() === 0 || d.getHours() < 9 || d.getHours() >= 21)) return [];
    var B = ST().bzData, hoy = hoyISO(), lim = hoyMenos(12), viejo = hoyMenos(60), out = [];
    [].concat(B.min || [], B.may || []).forEach(function(x){
      var e = luEnv(x).trim(), f = String(x.fecha || "").slice(0, 10);
      if (!e || /ENVIAD|ENTREGAD|CANCEL|RETIRAD/.test(e) || !f || f > lim || f < viejo) return;
      var dias = Math.round((Date.parse(hoy) - Date.parse(f)) / 864e5), q = x.venta || x.num || x.cliente || "";
      out.push(q);
      if (forzar === "ver") return;
      luciDecir("luci-12d-" + String(q).replace(/\s+/g, "") + "-" + hoy, "@Pau @Euge Chicas, ¿qué está pasando con el pedido " + q + (x.cliente && x.cliente !== q ? " (" + x.cliente + ")" : "") + "? 🤔\nPasaron " + dias + " días desde su compra y todavía figura «" + e.charAt(0) + e.slice(1).toLowerCase() + "».", "¿Qué pasa con el pedido " + q + "? Pasaron " + dias + " días");
    });
    return out;
  }
  setInterval(function(){ try { luci12(); } catch(e){} }, 60000);
  window.__nvLuci12 = function(){ LU12 = 0; return luci12("ver"); };
  /* ---------- Seguimientos del día para Pau (lista para mandar por WhatsApp) ---------- */
  var SEGOK = {};
  function segLeerOk(){ if (!sb()) return Promise.resolve(); return sb().from("registros").select("id").eq("tabla", "luci_seg").then(function(r){ if (!r.error){ SEGOK = {}; (r.data || []).forEach(function(x){ SEGOK[x.id] = 1; }); } }, function(){}); }
  function segFila(x){ return x && x.id && x.guia && String(x.enviado || "").slice(0, 10) >= hoyMenos(3) && String(x.enviado || "").slice(0, 10) >= "2026-11-27"; }
  function segLista(){ return (ST().seguimiento || []).filter(function(x){ return !x.borrado && segFila(x); }).sort(function(a, b){ return String(b.enviado).localeCompare(String(a.enviado)) || String(a.nombre).localeCompare(String(b.nombre)); }); }
  function segMsg(x){
    var emp = x.empresa || "Vía Cargo", g = String(x.guia || ""), se = (window.SEG_EMP || []).filter(function(e){ return e[0] === emp; })[0] || [];
    var url = /v[ií]a\s*cargo/i.test(emp) ? "https://viacargo.com.ar/seguimiento-de-envio/" : String(se[1] || "").replace("{g}", g);
    return "Hola, queremos avisarte que tu pedido fue despachado! ✨\n\n📦 Transporte: " + emp + "\n🔢 Código de seguimiento: " + g + (url ? "\n\nPodés verificar su estado desde acá 👉 " + url : "") + "\n\nMuchas gracias por elegirnos ! Cualquier cosa, estamos a tu disposición !";
  }
  function segTel(t){ t = String(t || "").replace(/\D/g, ""); if (!t) return ""; if (/^0/.test(t)) t = t.replace(/^0/, ""); if (t.length === 10) t = "549" + t; if (/^54(?!9)/.test(t) && t.length === 12) t = "549" + t.slice(2); return t; }
  function segCopiar(txt){
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt).then(function(){ toast("Copiado ✓"); }, function(){ segCopiar2(txt); }); } catch(e){}
    segCopiar2(txt);
  }
  function segCopiar2(txt){ var ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copiado ✓"); } catch(e){} ta.remove(); }
  function segMarcar(id){ SEGOK[id] = 1; segPintar(); sb().from("registros").upsert({ tabla: "luci_seg", id: id, data: { id: id, por: soy(), fecha: hoyISO() }, borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(){}); }
  function segPintar(){
    var B = document.getElementById("nluSeg"); if (!B) return;
    var L = segLista(), pend = L.filter(function(x){ return !SEGOK[x.id]; }), dias = {};
    L.forEach(function(x){ var f = String(x.enviado).slice(0, 10); (dias[f] = dias[f] || []).push(x); });
    var h = '<div class="sh"><button class="x" data-sg="cerrar">✕</button><b>Seguimientos</b><small>' + (pend.length ? pend.length + " para mandar · tocá WhatsApp y se abre el chat con el mensaje listo" : "Todo mandado ✓ ¡Bien ahí!") + '</small></div><div class="sl">';
    if (!L.length) h += '<p class="vac">No hay envíos con guía en los últimos días.</p>';
    Object.keys(dias).sort().reverse().forEach(function(f){
      h += '<div class="dia">' + (f === hoyISO() ? "Hoy" : fcorta(f)) + '</div>';
      dias[f].forEach(function(x){
        var ok = SEGOK[x.id], tel = segTel(x.tel);
        h += '<div class="it' + (ok ? " ok" : "") + '"><b>' + esc(x.nombre || "Cliente") + (x.venta ? ' · ' + esc(x.venta) : "") + '</b><small>' + esc(x.empresa || "") + ' · ' + esc(x.guia) + (ok ? " · ya mandado ✓" : "") + '</small>' +
          (ok ? "" : '<div class="r">' + (tel ? '<a class="wa" data-sg="wa" data-id="' + esc(x.id) + '" href="https://wa.me/' + tel + '?text=' + encodeURIComponent(segMsg(x)) + '" target="_blank" rel="noopener">WhatsApp</a>' : '<span class="no">Sin teléfono</span>') + '<button data-sg="cp" data-id="' + esc(x.id) + '">Copiar</button><button data-sg="ok" data-id="' + esc(x.id) + '">✓ Enviado</button></div>') + '</div>';
      });
    });
    h += '</div>' + (pend.length > 1 ? '<button class="all" data-sg="todos">Copiar todos los mensajes juntos</button>' : "");
    B.innerHTML = h;
  }
  function segAbrir(){
    var P = LC.pane || document.body;
    var B = document.getElementById("nluSeg");
    if (!B){ B = document.createElement("div"); B.id = "nluSeg"; P.appendChild(B);
      B.onclick = function(e){
        var b = e.target.closest("[data-sg]"); if (!b) return; var a = b.dataset.sg, x = segLista().filter(function(z){ return z.id === b.dataset.id; })[0];
        if (a === "cerrar"){ B.remove(); return; }
        if (a === "cp" && x){ segCopiar(segMsg(x)); return; }
        if (a === "ok" && x){ segMarcar(x.id); return; }
        if (a === "wa" && x){ setTimeout(function(){ if (!SEGOK[x.id] && window.confirm("¿Ya le mandaste el seguimiento a " + (x.nombre || "este cliente") + "?")) segMarcar(x.id); }, 1500); return; }
        if (a === "todos"){ segCopiar(segLista().filter(function(z){ return !SEGOK[z.id]; }).map(function(z){ return "👤 " + (z.nombre || "") + (z.tel ? " · " + z.tel : "") + "\n" + segMsg(z); }).join("\n\n————————\n\n")); }
      };
    }
    segPintar(); segLeerOk().then(segPintar);
  }
  (function(){ var s = document.createElement("style"); s.textContent = [
    "#nluSeg{position:absolute;inset:0;z-index:5;background:#FFFCFA;display:flex;flex-direction:column;font-family:Outfit,system-ui,sans-serif}",
    "#nluSeg .sh{padding:14px 16px 10px;border-bottom:1px solid #EFE4E0;background:#fff;position:relative}#nluSeg .sh b{font-size:17px;font-weight:600}#nluSeg .sh small{display:block;color:#8A7A72;font-size:13px;margin-top:2px;padding-right:30px}",
    "#nluSeg .x{position:absolute;right:12px;top:12px;width:32px;height:32px;border-radius:50%;border:1px solid #EFE4E0;background:#fff;font-size:15px;cursor:pointer;color:#5A4334}",
    "#nluSeg .sl{flex:1;overflow:auto;padding:10px 14px 14px}#nluSeg .dia{font-size:12px;font-weight:600;color:#8A4F65;text-transform:uppercase;letter-spacing:.06em;margin:10px 2px 6px}",
    "#nluSeg .it{border:1px solid #EFE4E0;border-radius:14px;padding:10px 12px;margin-bottom:8px;background:#fff}#nluSeg .it b{font-size:14.5px;font-weight:600}#nluSeg .it small{display:block;color:#8A7A72;font-size:12.5px;margin:2px 0 8px;word-break:break-all}",
    "#nluSeg .it.ok{background:#F6F4F2}#nluSeg .it.ok b{color:#A0938B}#nluSeg .it.ok small{margin-bottom:0}",
    "#nluSeg .r{display:flex;gap:6px}#nluSeg .r>*{flex:1;text-align:center;padding:9px 0;border-radius:10px;font:inherit;font-size:13.5px;border:1px solid #E6D8D3;background:#fff;color:#2A211C;text-decoration:none;cursor:pointer}",
    "#nluSeg .r .wa{background:#E8F3EC;color:#3F7A55;border-color:#CFE6D7;font-weight:500}#nluSeg .r .no{color:#A0938B;font-size:12.5px}",
    "#nluSeg .all{margin:0 14px 14px;padding:12px;border-radius:12px;border:0;background:#54433D;color:#fff;font:inherit;font-size:14.5px;cursor:pointer}#nluSeg .vac{color:#8A7A72;font-size:14px}"
  ].join("\n"); document.head.appendChild(s); })();
  /* aviso a Pau: a la tarde si hubo envíos hoy; a la mañana si quedó alguno sin mandar */
  var LUSEG = 0;
  function luciSeg(){
    if (!sb() || !(LOADED || ST().loaded) || Date.now() - LUSEG < 10 * 60e3) return; LUSEG = Date.now();
    var d = new Date(), h = d.getHours(), dw = d.getDay(); if (dw === 0 || dw === 6) return;
    segLeerOk().then(function(){
      var hoy = hoyISO(), L = segLista(), deHoy = L.filter(function(x){ return String(x.enviado).slice(0, 10) === hoy; }), viejos = L.filter(function(x){ return String(x.enviado).slice(0, 10) < hoy && !SEGOK[x.id]; });
      if (h >= 17 && h < 22 && deHoy.filter(function(x){ return !SEGOK[x.id]; }).length){ var id = "luci-seg-" + hoy; luciDecirAcc(id, "@Pau hoy salieron " + deHoy.length + (deHoy.length === 1 ? " envío" : " envíos") + " 📦\nTe dejé los seguimientos listos para mandar.", "Seguimientos de hoy listos para mandar"); }
      if (h >= 10 && h < 21 && viejos.length){ var id2 = "luci-segp-" + hoy; luciDecirAcc(id2, "@Pau quedaron " + viejos.length + (viejos.length === 1 ? " seguimiento" : " seguimientos") + " sin mandar de " + (viejos.length === 1 ? "un día anterior" : "días anteriores") + " 🙏\n¿Los mandamos hoy?", "Quedaron seguimientos sin mandar"); }
    });
  }
  function luciDecirAcc(id, texto, aviso){
    return sb().from("registros").select("id").eq("tabla", "chat").eq("id", id).then(function(r){
      if (r.error || (r.data && r.data.length)) return;
      var now = Date.now();
      return sb().from("registros").upsert({ tabla: "chat", id: id, data: { id: id, adj: [], por: "luci", reac: {}, canal: "luci", texto: texto, creado: now, borrado: false, cambiado: now, acc: { tipo: "seg" } }, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){ if (!w.error){ luciPush(aviso, id); lcLeer(); } });
    });
  }
  setInterval(function(){ try { luciSeg(); } catch(e){} }, 60000);
  window.__nvSeg = { abrir: segAbrir, lista: segLista, msg: segMsg };
  /* ---------- Día cero del stock: conteo guiado y compartido (Pau y Euge) ---------- */
  var C0 = { n: {}, grupo: null, q: "", busy: false };
  function c0Items(){ return (ST().stock || []).filter(function(s){ return !s.borrado && s.producto; }); }
  function c0Grupo(s){ return (s.tipo || "terminado") === "armazon" ? "Armazones" : (s.categoria || "Otros"); }
  function c0Grupos(){
    var G = {}; c0Items().forEach(function(s){ var g = c0Grupo(s); (G[g] = G[g] || []).push(s); });
    var orden = Object.keys(G).sort(function(a, b){ return (a === "Armazones" ? -1 : b === "Armazones" ? 1 : G[b].length - G[a].length); });
    return orden.map(function(g){ return { g: g, L: G[g].sort(function(a, b){ return String(a.producto).localeCompare(String(b.producto)); }) }; });
  }
  function c0Leer(){ if (!sb()) return Promise.resolve(); return sb().from("registros").select("id,data").eq("tabla", "luci_conteo").limit(3000).then(function(r){ if (r.error) return; C0.n = {}; (r.data || []).forEach(function(x){ if (x.data && x.data.sid && !x.data.cerrado) C0.n[x.data.sid] = x.data; }); }, function(){}); }
  var C0T = {};
  function c0Set(sid, n){
    n = Math.max(0, Math.round(n)); C0.n[sid] = { sid: sid, n: n, por: soy(), at: Date.now() }; c0Pintar();
    clearTimeout(C0T[sid]); C0T[sid] = setTimeout(function(){ sb().from("registros").upsert({ tabla: "luci_conteo", id: "c0-" + sid, data: C0.n[sid], borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(r){ if (r.error) toast("No se guardó, revisá la conexión"); }); }, 500);
  }
  function c0Pintar(){
    var B = document.getElementById("nluC0"); if (!B) return;
    var GS = c0Grupos(), tot = c0Items().length, hechos = c0Items().filter(function(s){ return C0.n[s.id]; }).length, pct = tot ? Math.round(hechos * 100 / tot) : 0;
    var h = '<div class="sh"><button class="x" data-c0="cerrar">✕</button><b>Conteo día cero</b><small>' + hechos + ' de ' + tot + ' contados · se guarda solo, pueden contar las dos a la vez</small><div class="pr"><i style="width:' + pct + '%"></i></div></div>';
    if (!C0.grupo){
      h += '<div class="sl">' + GS.map(function(G){ var c = G.L.filter(function(s){ return C0.n[s.id]; }).length; return '<button class="gr" data-c0="g" data-g="' + esc(G.g) + '"><b>' + esc(G.g) + '</b><span>' + c + ' / ' + G.L.length + (c === G.L.length ? " ✓" : "") + '</span></button>'; }).join("") + '</div>';
      h += '<button class="all" data-c0="fin">Terminar el día cero</button>';
    } else {
      var G = GS.filter(function(x){ return x.g === C0.grupo; })[0] || { L: [] }, q = nrm(C0.q);
      var L = G.L.filter(function(s){ return !q || nrm(s.producto).indexOf(q) >= 0; });
      h += '<div class="tb"><button data-c0="volver">← Grupos</button><input id="nluC0q" placeholder="Buscar en ' + esc(C0.grupo) + '…" value="' + esc(C0.q) + '"></div><div class="sl">';
      h += L.map(function(s){
        var c = C0.n[s.id], ac = +s.cantidad || 0, v = c ? c.n : null;
        return '<div class="row' + (c ? " ok" : "") + '"><div class="n">' + esc(s.producto) + '<small>El tablero dice ' + ac + (c && c.n !== ac ? ' <i class="dif">contaste ' + c.n + '</i>' : "") + (c && c.por ? ' · ' + (c.por === "pau" ? "Pau" : "Euge") : "") + '</small></div><div class="q"><button data-c0="m" data-id="' + esc(s.id) + '">−</button><input data-c0in="' + esc(s.id) + '" inputmode="numeric" value="' + (v == null ? "" : v) + '" placeholder="·"><button data-c0="p" data-id="' + esc(s.id) + '">+</button></div></div>';
      }).join("") + (L.length ? "" : '<p class="vac">No hay productos con ese nombre.</p>') + '</div>';
      var i = GS.map(function(x){ return x.g; }).indexOf(C0.grupo), sig = GS[i + 1];
      h += '<button class="all" data-c0="' + (sig ? "g" : "volver") + '"' + (sig ? ' data-g="' + esc(sig.g) + '"' : "") + '>' + (sig ? "Seguir con " + esc(sig.g) + " →" : "Listo, volver a los grupos") + '</button>';
    }
    var ae = document.activeElement, foc = ae && ae.id === "nluC0q", sel = foc ? ae.selectionStart : 0, sc = (B.querySelector(".sl") || {}).scrollTop || 0;
    B.innerHTML = h;
    var nsl = B.querySelector(".sl"); if (nsl) nsl.scrollTop = sc;
    if (foc){ var qi = document.getElementById("nluC0q"); if (qi){ qi.focus(); try { qi.setSelectionRange(sel, sel); } catch(e){} } }
  }
  function c0Terminar(){
    var it = c0Items(), cont = it.filter(function(s){ return C0.n[s.id]; }), falta = it.length - cont.length, cambian = cont.filter(function(s){ return C0.n[s.id].n !== (+s.cantidad || 0); });
    if (!cont.length){ toast("Todavía no contaron nada"); return; }
    if (!window.confirm("Contaron " + cont.length + " productos (" + cambian.length + " cambian).\n" + (falta ? falta + " sin contar quedan como están.\n" : "") + "¿Cierro el día cero y paso estos números al stock?")) return;
    if (C0.busy) return; C0.busy = true; toast("Guardando el stock…");
    var log = cambian.map(function(s){ return [s.id, s.producto, +s.cantidad || 0, C0.n[s.id].n]; }), i = 0;
    function sig(){
      if (i >= cambian.length){
        var id = "dia0-" + hoyISO();
        return sb().from("registros").upsert({ tabla: "luci_conteo", id: id, data: { id: id, cerrado: true, fecha: hoyISO(), por: soy(), contados: cont.length, cambios: log }, borrado: false, actualizado: new Date().toISOString(), por: soy() || "luci" }, { onConflict: "tabla,id" }).then(function(){
          C0.busy = false; var B = document.getElementById("nluC0"); if (B) B.remove();
          luci("Listo ✓ Cerré el día cero: contaron " + cont.length + " productos y " + cambian.length + " cambiaron.\nDesde hoy este es el stock oficial 💪");
        });
      }
      var s = cambian[i++]; s.cantidad = C0.n[s.id].n; s.nota = (s.nota ? s.nota + " · " : "") + "día cero " + fcorta(hoyISO());
      return guardarFila("stock", s).then(sig, function(){ C0.busy = false; toast("Se cortó guardando, tocá Terminar de nuevo"); });
    }
    sig();
  }
  function c0Abrir(){
    var P = LC.pane || document.body, B = document.getElementById("nluC0");
    if (!B){
      B = document.createElement("div"); B.id = "nluC0"; P.appendChild(B);
      B.onclick = function(e){
        var b = e.target.closest("[data-c0]"); if (!b) return; var a = b.dataset.c0, s = b.dataset.id;
        if (a === "cerrar"){ B.remove(); return; }
        if (a === "g"){ C0.grupo = b.dataset.g; C0.q = ""; c0Pintar(); var sl = B.querySelector(".sl"); if (sl) sl.scrollTop = 0; return; }
        if (a === "volver"){ C0.grupo = null; C0.q = ""; c0Pintar(); return; }
        if (a === "m" || a === "p"){ var st = stockId(s), cur = C0.n[s] ? C0.n[s].n : (+(st || {}).cantidad || 0); c0Set(s, cur + (a === "p" ? 1 : -1)); return; }
        if (a === "fin"){ c0Terminar(); }
      };
      B.oninput = function(e){
        if (e.target.id === "nluC0q"){ C0.q = e.target.value; c0Pintar(); return; }
        var sid = e.target.dataset && e.target.dataset.c0in; if (!sid) return; var v = String(e.target.value).replace(/\D/g, ""); if (v === "") return; c0Set(sid, +v);
      };
    }
    c0Pintar(); c0Leer().then(c0Pintar);
  }
  (function(){ var s = document.createElement("style"); s.textContent = [
    "#nluC0{position:absolute;inset:0;z-index:6;background:#FFFCFA;display:flex;flex-direction:column;font-family:Outfit,system-ui,sans-serif;color:#2A211C}",
    "#nluC0 .sh{padding:14px 16px 12px;border-bottom:1px solid #EFE4E0;background:#fff;position:relative}#nluC0 .sh b{font-size:17px;font-weight:600}#nluC0 .sh small{display:block;color:#8A7A72;font-size:13px;margin:2px 0 8px;padding-right:34px}",
    "#nluC0 .pr{height:8px;border-radius:9px;background:#F3E9EC}#nluC0 .pr i{display:block;height:8px;border-radius:9px;background:#C98AA3}",
    "#nluC0 .x{position:absolute;right:12px;top:12px;width:32px;height:32px;border-radius:50%;border:1px solid #EFE4E0;background:#fff;font-size:15px;cursor:pointer;color:#5A4334}",
    "#nluC0 .sl{flex:1;overflow:auto;padding:10px 14px}#nluC0 .vac{color:#8A7A72}",
    "#nluC0 .gr{display:flex;width:100%;justify-content:space-between;align-items:center;padding:13px 14px;margin-bottom:8px;border:1px solid #EFE4E0;border-radius:14px;background:#fff;font:inherit;font-size:15px;cursor:pointer;color:#2A211C}#nluC0 .gr span{color:#8A4F65;font-size:13.5px}",
    "#nluC0 .tb{display:flex;gap:8px;padding:10px 14px 0}#nluC0 .tb button{border:1px solid #E6D8D3;background:#fff;border-radius:10px;padding:8px 10px;font:inherit;font-size:13.5px;cursor:pointer;color:#2A211C;white-space:nowrap}#nluC0 .tb input{flex:1;min-width:0;border:1px solid #E6D8D3;border-radius:10px;padding:8px 10px;font:inherit;font-size:16px}",
    "#nluC0 .row{display:flex;align-items:center;gap:10px;border:1px solid #EFE4E0;border-radius:12px;padding:9px 10px;background:#fff;margin-bottom:7px}#nluC0 .row.ok{background:#F7FBF7;border-color:#D9EAD9}",
    "#nluC0 .row .n{flex:1;min-width:0;font-size:14px}#nluC0 .row .n small{display:block;color:#8A7A72;font-size:12px;margin-top:1px}#nluC0 .dif{font-style:normal;color:#8A4F65;background:#FBEEF3;border-radius:6px;padding:0 5px}",
    "#nluC0 .q{display:flex;align-items:center;gap:5px;flex:none}#nluC0 .q button{width:34px;height:34px;border-radius:10px;border:1px solid #E6D8D3;background:#fff;font-size:18px;cursor:pointer;color:#2A211C}#nluC0 .q input{width:44px;height:34px;text-align:center;border:1px solid #E6D8D3;border-radius:10px;font:inherit;font-size:16px;font-weight:600}",
    "#nluC0 .all{margin:8px 14px 14px;padding:13px;border-radius:12px;border:0;background:#54433D;color:#fff;font:inherit;font-size:15px;cursor:pointer}"
  ].join("\n"); document.head.appendChild(s); })();
  /* el martes 1/12 Luci avisa que arranca el día cero */
  var LUC0 = 0;
  function luciDia0(){
    if (!sb() || !(LOADED || ST().loaded) || Date.now() - LUC0 < 10 * 60e3) return; LUC0 = Date.now();
    var d = new Date(); if (hoyISO() !== "2026-12-01" || d.getHours() * 60 + d.getMinutes() < 510) return;
    var id = "luci-dia0-" + hoyISO();
    sb().from("registros").select("id").eq("tabla", "chat").eq("id", id).then(function(r){
      if (r.error || (r.data && r.data.length)) return; var now = Date.now();
      sb().from("registros").upsert({ tabla: "chat", id: id, data: { id: id, adj: [], por: "luci", reac: {}, canal: "luci", texto: "@Pau @Euge ¡Hoy es el día cero del stock! 📦\nVamos contando por grupos desde el celu. Pueden contar las dos a la vez y pausar cuando quieran; se guarda solo.\nCuando terminen, tocan «Terminar» y desde ahí el stock queda oficial.", creado: now, borrado: false, cambiado: now, acc: { tipo: "conteo" } }, borrado: false, actualizado: new Date().toISOString(), por: "luci" }, { onConflict: "tabla,id", ignoreDuplicates: true }).then(function(w){ if (!w.error){ luciPush("¡Hoy es el día cero del stock! 📦", id); lcLeer(); } });
    });
  }
  setInterval(function(){ try { luciDia0(); } catch(e){} }, 60000);
  window.__nvC0 = { abrir: c0Abrir, grupos: c0Grupos };
  function pintar(){
    if (!ROOT || !ROOT.isConnected) return;
    ROOT.innerHTML = V.vista === "luci" ? vLuci() : V.id ? vFicha() : vLista();
  }

  /* ---------- acciones ---------- */
  function onClick(e){
    var el = e.target.closest("[data-a]"); if (!el || !ROOT.contains(el)) return;
    if (/^lu-/.test(el.dataset.a)){ luClick(el); return; }
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
      case "ped": pedidoMenu(f, el.dataset.pid); break;
      case "ped-new": pedidoNuevo(f); break;
      case "todos": V.todos = !V.todos; pintar(); break;
      case "ir-pagar": try { N().setTab("proveedores"); window.scrollTo(0,0); } catch(x){} break;
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
      SEG.innerHTML = '<button data-v="luci">Luci · pedidos</button><button data-v="fichas">Fichas</button><button data-v="">Grass · precios y stock</button>';
      SEG.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; V.vista = b.dataset.v; try { localStorage.setItem(LSV, V.vista); } catch(x){} montar(); window.scrollTo(0,0); });
      list0.parentNode.insertBefore(SEG, list0);
    }
    [].forEach.call(SEG.children, function(b){ b.classList.toggle("on", (b.dataset.v || "") === (V.vista || "")); });
    if (V.vista === "fichas" || V.vista === "luci"){
      if (ROOT && ROOT.isConnected && ROOT.dataset.v !== V.vista){ ROOT.dataset.v = V.vista; pintar(); }
      document.body.classList.add("nfi-on");
      if (!ROOT || !ROOT.isConnected){
        ROOT = document.createElement("div"); ROOT.id = "nfiRoot"; ROOT.dataset.v = V.vista; list0.parentNode.insertBefore(ROOT, list0.nextSibling);
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
  setInterval(function(){ if ((V.vista === "fichas" || V.vista === "luci") && ROOT && ROOT.isConnected && !document.hidden){ var ae = document.activeElement; if (!V.id && !(ae && ROOT.contains(ae) && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) pintar(); leer(); } }, 60000);
})();

/* ================= Mayoristas → Web mayorista (pedidos, carritos y visitas de nervomayorista.com) ================= */
(function(){
  if (window.__nvMayWeb) return; window.__nvMayWeb = 1;
  var LSV = "nvMayVista";
  var PED = {}, WEB = {}, LOADED = false, BUSY = false, ROOT = null, SEG = null;
  var V = { vista: "", sub: "ped", ver: {} };
  try { V.vista = localStorage.getItem(LSV) || ""; } catch(e){}
  var EST = { nuevo: ["Nuevo", "#F3E4EA", "#8A4F65"], contactado: ["Contactado", "#E4ECF5", "#46618A"], confirmado: ["Confirmado", "#E2EBDB", "#3F5E31"], enviado: ["Enviado", "#ECE4DB", "#5A4334"], cancelado: ["Cancelado", "#F1EDE9", "#7A6D64"] };

  function N(){ return window.__nv || {}; }
  function ST(){ return N().S || {}; }
  function soy(){ return (ST().soy || "").toLowerCase(); }
  function sb(){ return window.__sb; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function toast(m){ var t = document.createElement("div"); t.className = "npl-toast"; t.textContent = m; document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2000); }
  function plata(n){ return "$ " + Math.round(Number(n) || 0).toLocaleString("es-AR"); }
  function hace(ts){ if (!ts) return ""; var m = Math.round((Date.now() - ts) / 60000); if (m < 1) return "recién"; if (m < 60) return "hace " + m + " min"; var h = Math.round(m / 60); if (h < 24) return "hace " + h + " h"; var d = Math.round(h / 24); return d === 1 ? "ayer" : "hace " + d + " días"; }
  function fecha(ts){ var d = new Date(ts); return d.getDate() + "/" + (d.getMonth() + 1) + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function waNum(t){ var d = String(t || "").replace(/\D/g, ""); if (!d) return ""; if (d.indexOf("54") === 0) d = d.slice(2); if (d.charAt(0) === "0") d = d.slice(1); if (d.charAt(0) !== "9") d = "9" + d; d = d.replace(/^9(\d{2,4})15/, "9$1"); return "54" + d; }
  function dominio(r){ try { return r ? new URL(r).hostname.replace(/^www\./, "") : ""; } catch(e){ return ""; } }

  function leer(){
    if (!sb() || BUSY) return Promise.resolve(); BUSY = true;
    return Promise.all([
      sb().from("registros").select("id,data,borrado").eq("tabla", "may_pedidos").limit(2000),
      sb().from("registros").select("id,data,borrado").eq("tabla", "may_web").order("actualizado", { ascending: false }).limit(1000)
    ]).then(function(rs){
      BUSY = false;
      var p = {}, w = {};
      (rs[0].data || []).forEach(function(x){ if (!x.borrado){ var o = x.data || {}; o.id = x.id; p[x.id] = o; } });
      (rs[1].data || []).forEach(function(x){ if (!x.borrado){ var o = x.data || {}; o.id = x.id; w[x.id] = o; } });
      PED = p; WEB = w; LOADED = true; pintar();
    }, function(){ BUSY = false; });
  }
  function guardar(tabla, o){
    return sb().from("registros").upsert({ tabla: tabla, id: o.id, data: o, borrado: false, actualizado: new Date().toISOString(), por: soy() || "nervo" }, { onConflict: "tabla,id" })
      .then(function(r){ if (r.error) toast("No se pudo guardar: " + r.error.message); else toast("Guardado"); });
  }

  var CSS = [
    "body.nmw-on #list{display:none!important}",
    "#nmwSeg{display:flex;gap:6px;margin:4px 0 14px;font-family:Outfit,system-ui,sans-serif}",
    "#nmwSeg button{border:0;font:inherit;font-size:14px;padding:8px 15px;border-radius:8px;background:#F4F1EE;color:#7A6D64;cursor:pointer}",
    "#nmwSeg button.on{background:#5A4334;color:#fff}",
    "#nmwRoot{font-family:Outfit,system-ui,sans-serif;color:#241C17;max-width:1100px;padding-bottom:120px}",
    "#nmwRoot *{box-sizing:border-box}",
    ".nmw-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}",
    ".nmw-sum div{background:#fff;border:1px solid #ECE7E2;border-radius:8px;padding:12px 14px;cursor:pointer}",
    ".nmw-sum div.on{border-color:#5A4334;box-shadow:inset 0 0 0 1px #5A4334}",
    ".nmw-sum b{font-size:22px;font-weight:600;display:block}.nmw-sum small{font-size:12px;color:#7A6D64}",
    ".nmw-card{background:#fff;border:1px solid #ECE7E2;border-radius:8px;padding:14px;margin-bottom:10px}",
    ".nmw-h{display:flex;align-items:flex-start;gap:10px}",
    ".nmw-h .bd{flex:1;min-width:0}.nmw-h b{font-size:15.5px;font-weight:600;display:block}.nmw-h small{font-size:12.5px;color:#7A6D64;display:block;margin-top:2px;word-break:break-word}",
    ".nmw-h .tot{font-size:16px;font-weight:600;white-space:nowrap;text-align:right}.nmw-h .tot small{font-weight:400}",
    ".nmw-items{margin:10px 0 0;padding:10px 0 0;border-top:1px solid #F3EFEB;font-size:13.5px;line-height:1.55;color:#3B2C23}",
    ".nmw-items div{display:flex;gap:8px}.nmw-items span:first-child{flex:1}.nmw-items span:last-child{color:#7A6D64;white-space:nowrap}",
    ".nmw-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}",
    ".nmw-acts a,.nmw-acts button{display:inline-flex;align-items:center;gap:6px;border:1px solid #ECE7E2;background:#fff;border-radius:8px;font:inherit;font-size:13px;padding:7px 12px;color:#241C17;text-decoration:none;cursor:pointer}",
    ".nmw-acts a.wa{background:#2F6A3A;border-color:#2F6A3A;color:#fff}",
    ".nmw-acts select{border:1px solid #ECE7E2;border-radius:8px;font:inherit;font-size:13px;padding:7px 10px;background:#fff}",
    ".nmw-chip{display:inline-block;font-size:11px;padding:2px 8px;border-radius:4px;white-space:nowrap;margin-left:6px;vertical-align:middle}",
    ".nmw-note{font-size:13px;color:#7A6D64;margin:8px 0 0}",
    ".nmw-row{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 4px;border-top:1px solid #F3EFEB;font-size:13.5px}",
    ".nmw-row:first-child{border-top:0}.nmw-row small{color:#7A6D64;font-size:12px}.nmw-row .r{text-align:right}",
    ".nmw-empty{color:#ABA097;font-size:14px;padding:14px 4px;line-height:1.5}",
    ".nmw-info{font-size:12.5px;color:#7A6D64;margin:-4px 0 12px;line-height:1.5}",
    "@media (max-width:640px){.nmw-sum{grid-template-columns:repeat(2,minmax(0,1fr))}}"
  ].join("");
  var st = document.createElement("style"); st.id = "nmw-css"; st.textContent = CSS; document.head.appendChild(st);

  function itemsHtml(its){
    return '<div class="nmw-items">' + (its || []).map(function(it){ return '<div><span>' + esc(it.n) + (it.v && it.v !== "—" ? " · " + esc(it.v) : "") + '</span><span>× ' + (it.q || 0) + (it.p ? " · " + plata(it.p * (it.q || 0)) : "") + '</span></div>'; }).join("") + '</div>';
  }
  function abandonados(){
    var lim = Date.now() - 30 * 60000;
    return Object.keys(WEB).map(function(k){ return WEB[k]; }).filter(function(w){ return !w.oculto && (w.carrito || []).length && (w.carritoAt || 0) < lim; })
      .sort(function(a, b){ return (b.carritoAt || 0) - (a.carritoAt || 0); });
  }
  function vista(){
    var peds = Object.keys(PED).map(function(k){ return PED[k]; }).sort(function(a, b){ return (b.fecha || 0) - (a.fecha || 0); });
    var webs = Object.keys(WEB).map(function(k){ return WEB[k]; }).sort(function(a, b){ return (b.ultima || 0) - (a.ultima || 0); });
    var ab = abandonados();
    var sem = Date.now() - 7 * 864e5, vis7 = webs.filter(function(w){ return (w.ultima || 0) > sem; }).length;
    var mes = new Date(); mes = new Date(mes.getFullYear(), mes.getMonth(), 1).getTime();
    var pm = peds.filter(function(p){ return (p.fecha || 0) >= mes && p.estado !== "cancelado"; });
    var nuevos = peds.filter(function(p){ return (p.estado || "nuevo") === "nuevo"; }).length;
    var h = '<div class="nmw-sum">' +
      '<div data-a="sub" data-v="ped" class="' + (V.sub === "ped" ? "on" : "") + '"><b>' + pm.length + '</b><small>pedidos este mes · ' + plata(pm.reduce(function(a, p){ return a + (Number(p.total) || 0); }, 0)) + '</small></div>' +
      '<div data-a="sub" data-v="ped" class=""><b>' + nuevos + '</b><small>pedidos sin responder</small></div>' +
      '<div data-a="sub" data-v="car" class="' + (V.sub === "car" ? "on" : "") + '"><b>' + ab.length + '</b><small>carritos abandonados</small></div>' +
      '<div data-a="sub" data-v="vis" class="' + (V.sub === "vis" ? "on" : "") + '"><b>' + vis7 + '</b><small>visitantes en 7 días</small></div></div>';
    if (!LOADED) return h + '<div class="nmw-empty">Cargando…</div>';
    if (V.sub === "ped"){
      if (!peds.length) h += '<div class="nmw-empty">Todavía no entró ningún pedido desde nervomayorista.com. Cuando un mayorista mande el carrito, aparece acá y les avisa en el chat #may.</div>';
      peds.forEach(function(p){
        var e = EST[p.estado || "nuevo"] || EST.nuevo, wa = waNum(p.tel);
        h += '<div class="nmw-card"><div class="nmw-h"><div class="bd"><b>' + esc(p.nombre || "Sin nombre") + '<span class="nmw-chip" style="background:' + e[1] + ';color:' + e[2] + '">' + e[0] + '</span>' + (p.wa ? '<span class="nmw-chip" style="background:#E2EBDB;color:#3F5E31">también por WhatsApp</span>' : "") + '</b>' +
          '<small>' + fecha(p.fecha) + " · " + [p.tel, p.mail].filter(Boolean).map(esc).join(" · ") + '</small></div><div class="tot">' + plata(p.total) + '<br><small>estimado</small></div></div>' +
          itemsHtml(p.items) + (p.nota ? '<div class="nmw-note">📝 ' + esc(p.nota) + '</div>' : "") +
          '<div class="nmw-acts">' + (wa ? '<a class="wa" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">Escribirle por WhatsApp</a>' : "") +
          (p.mail ? '<a href="mailto:' + esc(p.mail) + '">Mail</a>' : "") +
          '<select data-a="est" data-id="' + p.id + '">' + Object.keys(EST).map(function(k){ return '<option value="' + k + '"' + ((p.estado || "nuevo") === k ? " selected" : "") + '>' + EST[k][0] + '</option>'; }).join("") + '</select>' +
          '<button data-a="nota" data-id="' + p.id + '">✎ Nota</button></div></div>';
      });
    } else if (V.sub === "car"){
      h += '<div class="nmw-info">Gente que armó un carrito y no lo mandó (hace más de 30 minutos). Si dejó el nombre o el teléfono en el formulario, aparece acá para escribirle.</div>';
      if (!ab.length) h += '<div class="nmw-empty">No hay carritos abandonados por ahora.</div>';
      ab.forEach(function(w){
        var tot = (w.carrito || []).reduce(function(a, it){ return a + (it.p || 0) * (it.q || 0); }, 0), wa = waNum(w.tel);
        h += '<div class="nmw-card"><div class="nmw-h"><div class="bd"><b>' + esc(w.nombre || "Visitante sin datos") + '</b><small>' + hace(w.carritoAt) + (w.disp ? " · desde el " + esc(w.disp) : "") + (w.visitas > 1 ? " · entró " + w.visitas + " veces" : "") + ([w.tel, w.mail].filter(Boolean).length ? " · " + [w.tel, w.mail].filter(Boolean).map(esc).join(" · ") : "") + '</small></div>' +
          '<div class="tot">' + plata(w.total || tot) + '</div></div>' + itemsHtml(w.carrito) +
          '<div class="nmw-acts">' + (wa ? '<a class="wa" href="https://wa.me/' + wa + '?text=' + encodeURIComponent("Hola " + (String(w.nombre || "").split(" ")[0] || "") + "! Soy de Nervo Design. Vimos que armaste un carrito en el catálogo mayorista, ¿te ayudamos a terminar el pedido?") + '" target="_blank" rel="noopener">Escribirle por WhatsApp</a>' : "") +
          (w.mail ? '<a href="mailto:' + esc(w.mail) + '">Mail</a>' : "") + '<button data-a="ocultar" data-id="' + w.id + '">Ya lo vimos · sacar</button></div></div>';
      });
    } else {
      h += '<div class="nmw-info">Cada fila es una persona (un celu o una compu) que entró al catálogo. Si no dejó sus datos no sabemos quién es, pero sí si armó carrito o mandó pedido.</div><div class="nmw-card" style="padding:4px 12px">';
      if (!webs.length) h += '<div class="nmw-empty">Todavía no hay visitas registradas.</div>';
      webs.slice(0, 80).forEach(function(w){
        var est = (w.pedidos || []).length ? ["Mandó pedido", "#E2EBDB", "#3F5E31"] : (w.carrito || []).length ? ["Armó carrito", "#F3E4EA", "#8A4F65"] : ["Miró", "#F1EDE9", "#7A6D64"];
        var de = dominio(w.ref);
        h += '<div class="nmw-row"><span><b style="font-weight:500">' + esc(w.nombre || "Visitante") + '</b><span class="nmw-chip" style="background:' + est[1] + ';color:' + est[2] + '">' + est[0] + '</span></span><small class="r">' + hace(w.ultima) + '</small>' +
          '<small>' + (w.visitas || 1) + (w.visitas > 1 ? " visitas" : " visita") + (w.disp ? " · " + esc(w.disp) : "") + (de ? " · vino de " + esc(de) : "") + (w.utm ? " · " + esc(w.utm) : "") + '</small><small class="r">' + (w.primera ? "desde " + new Date(w.primera).toLocaleDateString("es-AR") : "") + '</small></div>';
      });
      h += '</div>';
    }
    return h;
  }
  function pintar(){ if (ROOT && ROOT.isConnected) ROOT.innerHTML = vista(); }

  function onClick(e){
    var el = e.target.closest("[data-a]"); if (!el || !ROOT.contains(el)) return;
    var a = el.dataset.a, id = el.dataset.id;
    if (a === "sub"){ V.sub = el.dataset.v; pintar(); }
    if (a === "nota"){ var p = PED[id]; var n = window.prompt("Nota del pedido", p.nota || ""); if (n == null) return; p.nota = n.trim(); guardar("may_pedidos", p).then(pintar); }
    if (a === "ocultar"){ var w = WEB[id]; if (!confirm("¿Sacar este carrito de la lista? (no se borra, solo deja de aparecer)")) return; w.oculto = true; guardar("may_web", w).then(pintar); pintar(); }
  }
  function onChange(e){
    var el = e.target; if (el.dataset.a !== "est") return; var p = PED[el.dataset.id]; if (!p) return;
    p.estado = el.value; p.estadoPor = soy(); p.estadoAt = Date.now(); guardar("may_pedidos", p).then(pintar);
  }

  function montar(){
    var s = ST(), list0 = document.getElementById("list");
    if (s.tab !== "mayoristas" || !list0){
      document.body.classList.remove("nmw-on");
      if (SEG && SEG.parentNode) SEG.remove(); if (ROOT && ROOT.parentNode) ROOT.remove(); return;
    }
    if (!SEG || !SEG.isConnected){
      SEG = document.createElement("div"); SEG.id = "nmwSeg";
      SEG.innerHTML = '<button data-v="">Clientes y mails</button><button data-v="web">Web mayorista</button>';
      SEG.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; V.vista = b.dataset.v; try { localStorage.setItem(LSV, V.vista); } catch(x){} montar(); window.scrollTo(0,0); });
      list0.parentNode.insertBefore(SEG, list0);
    }
    var nb = Object.keys(PED).filter(function(k){ return (PED[k].estado || "nuevo") === "nuevo"; }).length;
    SEG.children[1].textContent = "Web mayorista" + (nb ? " · " + nb + " nuevo" + (nb > 1 ? "s" : "") : "");
    [].forEach.call(SEG.children, function(b){ b.classList.toggle("on", (b.dataset.v || "") === (V.vista || "")); });
    if (V.vista === "web"){
      document.body.classList.add("nmw-on");
      if (!ROOT || !ROOT.isConnected){
        ROOT = document.createElement("div"); ROOT.id = "nmwRoot"; list0.parentNode.insertBefore(ROOT, list0.nextSibling);
        ROOT.addEventListener("click", onClick); ROOT.addEventListener("change", onChange);
        pintar(); leer();
      }
    } else {
      document.body.classList.remove("nmw-on"); if (ROOT && ROOT.parentNode) ROOT.remove();
    }
  }
  setInterval(montar, 700); setTimeout(montar, 300);
  setInterval(function(){ if (!document.hidden && (V.vista === "web" || ST().tab === "mayoristas")) leer(); }, 60000);
  setTimeout(leer, 4000);
})();
