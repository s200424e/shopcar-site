/* SHOPCAR - página inicial */
document.addEventListener("sc:ready", () => {
  const { L, EST, I, brl, kmFmt, ano, nome, capa, esc, waLink, waCarro, urlVeiculo, mapsLink, FAIXAS, contar, card, rail } = window.SC;
  const $ = s => document.querySelector(s);
  const icons = root => root.querySelectorAll("[data-icon]").forEach(n => { n.outerHTML = I[n.dataset.icon] || ""; });

  /* ---------- HERO ---------- */
  const dest = EST.find(v => v.destaque && v.capaHD) || EST.find(v => v.capaHD);
  const slides = [
    {
      img: "img/hero/showroom-renegade.jpg",
      eyebrow: `Taguatinga · ${L.referencia}`,
      titulo: "Realizando<br>sonhos",
      texto: `${EST.length} seminovos selecionados esperando por você, com financiamento facilitado e seu usado na troca.`,
      ctas: [["Ver estoque", "estoque.html", "primary"], ["Falar no WhatsApp", waLink("Olá! Vim pelo site e gostaria de atendimento."), "outline", true]]
    },
    dest && {
      img: dest.capaHD,
      eyebrow: "Destaque da semana",
      titulo: `${esc(dest.marca)}<br>${esc(dest.modelo)}`,
      specs: `<span>${esc(dest.versao)}</span><span>${ano(dest)}</span><span>${kmFmt(dest.km)}</span><b>${brl(dest.preco)}</b>`,
      ctas: [["Ver detalhes", urlVeiculo(dest), "primary"], ["Tenho interesse", waCarro(dest), "outline", true]]
    },
    {
      img: "img/hero/chaves-s10.jpg",
      eyebrow: "Financiamento",
      titulo: "Até 60x pra<br>sair dirigindo",
      texto: "Análise de crédito sem custo, aprovação rápida e seu usado como entrada.",
      ctas: [["Simular agora", "#financiamento", "primary"], ["Falar com a loja", waLink("Olá! Vim pelo site e quero simular um financiamento."), "outline", true]]
    },
    {
      img: "img/hero/c180.jpg",
      eyebrow: "Venda ou troca",
      titulo: "Seu usado<br>vale mais aqui",
      texto: "Avaliação justa e transparente. Venda com segurança ou use o carro como entrada no próximo.",
      ctas: [["Avaliar meu carro", waLink("Olá! Vim pelo site e quero avaliar meu carro para venda/troca."), "primary", true], ["Como funciona", "#venda", "outline"]]
    }
  ].filter(Boolean);

  const track = $("#heroTrack");
  track.innerHTML = slides.map((s, i) => `
    <div class="hero__slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${slides.length}">
      <div class="hero__media"><img src="${esc(s.img)}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>
      <div class="hero__content">
        <span class="eyebrow reveal-up">${s.eyebrow}</span>
        <${i === 0 ? "h1" : "h2"} class="t-display hero__title reveal-up">${s.titulo}</${i === 0 ? "h1" : "h2"}>
        ${s.texto ? `<p class="hero__text reveal-up">${s.texto}</p>` : ""}
        ${s.specs ? `<div class="hero__specs reveal-up">${s.specs}</div>` : ""}
        <div class="hero__ctas reveal-up">${s.ctas.map(([t, h, k, ext]) => `<a class="btn btn--${k}" href="${esc(h)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${ext ? I.wa : ""}${t}</a>`).join("")}</div>
      </div>
    </div>`).join("");
  const dots = $("#heroDots");
  dots.innerHTML = slides.map((s, i) => `<button class="hero__dot${i === 0 ? " is-on" : ""}" aria-label="Ir para destaque ${i + 1}"></button>`).join("");
  $("#heroTotal").textContent = String(slides.length).padStart(2, "0");
  document.querySelector('[data-hero="-1"]').innerHTML = I.left;
  document.querySelector('[data-hero="1"]').innerHTML = I.right;

  const hero = $(".hero");
  const DUR = 7000;
  hero.style.setProperty("--dur", DUR + "ms");
  let atual = 0, timer;
  function ir(n) {
    atual = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${atual * 100}%)`;
    track.querySelectorAll(".hero__slide").forEach((el, i) => el.classList.toggle("is-active", i === atual));
    dots.querySelectorAll(".hero__dot").forEach((d, i) => {
      d.classList.remove("is-on"); void d.offsetWidth; d.classList.toggle("is-on", i === atual);
    });
    $("#heroNow").textContent = String(atual + 1).padStart(2, "0");
    agendar();
  }
  function agendar() { clearTimeout(timer); if (!hero.classList.contains("is-paused")) timer = setTimeout(() => ir(atual + 1), DUR); }
  dots.addEventListener("click", e => { const b = e.target.closest(".hero__dot"); if (b) ir([...dots.children].indexOf(b)); });
  document.querySelectorAll("[data-hero]").forEach(b => b.addEventListener("click", () => ir(atual + Number(b.dataset.hero))));
  hero.addEventListener("mouseenter", () => { hero.classList.add("is-paused"); clearTimeout(timer); });
  hero.addEventListener("mouseleave", () => { hero.classList.remove("is-paused"); agendar(); });
  let tx = null;
  hero.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1)); tx = null; });
  document.addEventListener("visibilitychange", () => document.hidden ? clearTimeout(timer) : agendar());
  agendar();

  /* ---------- BUSCA RÁPIDA ---------- */
  const marcas = contar("marca"), tipos = contar("carroceria");
  $("#qMarca").insertAdjacentHTML("beforeend", marcas.map(([m, n]) => `<option value="${esc(m)}">${esc(m)} (${n})</option>`).join(""));
  $("#qTipo").insertAdjacentHTML("beforeend", tipos.map(([t, n]) => `<option value="${esc(t)}">${esc(t)} (${n})</option>`).join(""));
  $("#qFaixa").insertAdjacentHTML("beforeend", FAIXAS.map(f => `<option value="${f.id}">${f.label}</option>`).join(""));
  const qf = $("#quickForm");
  const contarQuick = () => {
    const d = Object.fromEntries(new FormData(qf));
    const f = FAIXAS.find(x => x.id === d.faixa);
    const n = EST.filter(v => (!d.marca || v.marca === d.marca) && (!d.tipo || v.carroceria === d.tipo) && (!d.cambio || v.cambio === d.cambio) && (!f || (v.preco >= f.min && v.preco < f.max))).length;
    $("#quickCount").textContent = `Ver ${n} ${n === 1 ? "veículo" : "veículos"}`;
  };
  qf.addEventListener("change", contarQuick); contarQuick();
  qf.addEventListener("submit", e => {
    e.preventDefault();
    const p = new URLSearchParams([...new FormData(qf)].filter(([, v]) => v));
    location.href = "estoque.html" + (p.toString() ? "?" + p : "");
  });

  /* ---------- RECÉM-CHEGADOS ---------- */
  $("#railChegados").innerHTML = EST.filter(v => capa(v)).slice(0, 12).map(card).join("");
  document.querySelector("[data-rail-prev]").innerHTML = I.left;
  document.querySelector("[data-rail-next]").innerHTML = I.right;
  rail(document.querySelector("#chegados .rail"));

  /* ---------- MARCAS ---------- */
  // marcas de carro (motos ficam numa célula própria no fim)
  const carrosSoh = EST.filter(v => v.carroceria !== "Moto");
  const motos = EST.filter(v => v.carroceria === "Moto");
  const marcasCarro = [...carrosSoh.reduce((m, v) => m.set(v.marca, (m.get(v.marca) || 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const celulas = marcasCarro.slice(0, motos.length ? 14 : 15).map(([m, n]) => ({
    href: `estoque.html?marca=${encodeURIComponent(m)}`, nome: m, n, foto: carrosSoh.find(v => v.marca === m && capa(v))
  }));
  if (motos.length) celulas.push({ href: "estoque.html?tipo=Moto", nome: "Motos", n: motos.length, foto: motos.find(v => capa(v)) });
  $("#brandGrid").innerHTML = celulas.map((c, i) => `
    <a class="brand-cell" href="${c.href}" aria-label="Ver ${esc(c.nome)}, ${c.n} ${c.n > 1 ? "veículos" : "veículo"}">
      ${c.foto ? `<img src="${esc(capa(c.foto))}" alt="" loading="lazy">` : ""}
      <span class="brand-cell__num">${String(i + 1).padStart(2, "0")}</span>
      <span class="brand-cell__name">${esc(c.nome)}</span>
      <span class="brand-cell__count">${c.n} ${c.n > 1 ? "veículos" : "veículo"} <b>Explorar →</b></span>
    </a>`).join("");
  $("#tipoChips").insertAdjacentHTML("beforeend", tipos.map(([t, n]) => `<a class="chip" href="estoque.html?tipo=${encodeURIComponent(t)}">${esc(t)} <small>${n}</small></a>`).join(""));

  /* ---------- FAIXAS ---------- */
  $("#priceTiles").innerHTML = FAIXAS.map((f, i) => {
    const lista = EST.filter(v => v.preco >= f.min && v.preco < f.max);
    const foto = lista.filter(v => v.capaHD).sort((a, b) => b.preco - a.preco)[0];
    const menor = lista.length ? Math.min(...lista.map(v => v.preco)) : 0;
    return `<a class="price-tile reveal${i ? " reveal-d" + i : ""}" href="estoque.html?faixa=${f.id}">
      ${foto ? `<img src="${esc(foto.capaHD)}" alt="" loading="lazy">` : ""}
      <span class="eyebrow">${lista.length} ${lista.length === 1 ? "veículo" : "veículos"}</span>
      <span class="t-h3">${f.label}</span>
      <span class="price-tile__foot"><span>${lista.length ? "A partir de " + brl(menor) : "Em breve"}</span><span class="link-arrow">Ver ${I.arrow}</span></span>
    </a>`;
  }).join("");

  /* ---------- SIMULADOR ---------- */
  const sCarro = $("#simCarro"), sValor = $("#simValor"), sEnt = $("#simEntrada");
  sCarro.insertAdjacentHTML("beforeend", [...EST].sort((a, b) => nome(a).localeCompare(nome(b))).map(v => `<option value="${esc(v.id)}">${esc(nome(v))} ${ano(v)} · ${brl(v.preco)}</option>`).join(""));
  let parcelas = 48;
  const pct = el => ((el.value - el.min) / (el.max - el.min)) * 100 + "%";
  const sim = () => {
    const valor = +sValor.value, ent = Math.round(valor * (+sEnt.value / 100) / 100) * 100;
    $("#simValorOut").textContent = brl(valor);
    $("#simEntradaOut").textContent = `${sEnt.value}% · ${brl(ent)}`;
    $("#simFin").textContent = brl(valor - ent);
    $("#simEnt").textContent = brl(ent);
    sValor.style.setProperty("--p", pct(sValor)); sEnt.style.setProperty("--p", pct(sEnt));
    return { valor, ent };
  };
  sCarro.addEventListener("change", () => { const v = EST.find(x => x.id === sCarro.value); if (v) { sValor.value = v.preco; } sim(); });
  sValor.addEventListener("input", () => { sCarro.value = ""; sim(); });
  sEnt.addEventListener("input", sim);
  $("#simParc").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $("#simParc").querySelectorAll("button").forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", x === b); });
    parcelas = parseInt(b.textContent, 10);
  });
  $("#simForm").addEventListener("submit", e => {
    e.preventDefault();
    const { valor, ent } = sim();
    const v = EST.find(x => x.id === sCarro.value);
    const msg = `Olá! Vim pelo site e quero uma simulação de financiamento:\n` +
      (v ? `• Veículo: ${nome(v)} ${ano(v)}\n` : "") +
      `• Valor: ${brl(valor)}\n• Entrada: ${brl(ent)}\n• Parcelas: ${parcelas}x`;
    window.open(waLink(msg), "_blank", "noopener");
  });
  const params = new URLSearchParams(location.search);
  if (params.get("simular")) { sCarro.value = params.get("simular"); sCarro.dispatchEvent(new Event("change")); }
  sim();

  /* ---------- VENDA ---------- */
  $("#vendaCta").href = waLink("Olá! Vim pelo site e quero avaliar meu carro.\nModelo:\nAno:\nKm:\n(vou mandar as fotos aqui)");

  /* ---------- NÚMEROS (calculados do estoque) ---------- */
  const carros = EST.filter(v => v.carroceria !== "Moto");
  const minPreco = Math.min(...(carros.length ? carros : EST).map(v => v.preco));
  $("#stats").innerHTML = [
    [`${EST.length}`, "veículos no estoque agora"],
    [`${marcas.length}`, "marcas diferentes para escolher"],
    [`60<em>x</em>`, "parcelamento máximo no financiamento"],
    [`${Math.floor(minPreco / 1000)}<em>mil</em>`, "é o valor do carro mais em conta hoje"]
  ].map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join("");

  /* ---------- INSTAGRAM ---------- */
  $("#instaCta").href = L.instagram;
  $("#instaUser").textContent = L.instagramUsuario;
  $("#instaGrid").innerHTML = EST.filter(v => v.fotos && v.fotos.length > 2).slice(0, 6)
    .map((v, i) => `<a href="${esc(L.instagram)}" target="_blank" rel="noopener" aria-label="Instagram da Shopcar"><img src="${esc(v.fotos[i % 2 ? 2 : 0])}" alt="" loading="lazy"></a>`).join("");

  /* ---------- LOJA ---------- */
  $("#store").innerHTML = `
    <div class="store__map"><iframe title="Mapa da Shopcar Veículos" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(L.mapsBusca)}&z=16&output=embed"></iframe></div>
    <div class="store__info">
      <div class="store__row">${I.pin}<div><h3>Endereço</h3><p>${esc(L.endereco)}<br>${esc(L.referencia)} · ${esc(L.cidade)}</p></div></div>
      <div class="store__row">${I.clock}<div><h3>Horário</h3><ul class="hours">${L.horarios.map(h => `<li><span>${esc(h.dias)}</span><b>${esc(h.horas)}</b></li>`).join("")}</ul></div></div>
      <div class="store__row">${I.phone}<div><h3>Contato</h3><p>${esc(L.telefoneExibicao)} (WhatsApp)<br><a href="mailto:${esc(L.email)}">${esc(L.email)}</a></p></div></div>
      <div class="store__ctas">
        <a class="btn btn--primary btn--sm" href="${mapsLink}" target="_blank" rel="noopener">${I.pin} Como chegar</a>
        <a class="btn btn--wa btn--sm" href="${waLink("Olá! Vim pelo site e quero agendar uma visita.")}" target="_blank" rel="noopener">${I.wa} Agendar visita</a>
      </div>
    </div>`;

  icons(document);
  // ícone do link "ver estoque" das marcas
});
