/* =====================================================================
   SHOPCAR - código comum a todas as páginas
   (cabeçalho, menu, busca, rodapé, cards, favoritos, animações)
   ===================================================================== */
(function () {
  const L = window.LOJA;
  const EST = (window.ESTOQUE || []).filter(v => v && v.id);

  /* ---------- ícones ---------- */
  const s = (p, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
  const I = {
    wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>`,
    search: s('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    menu: s('<path d="M3 7h18M3 12h18M3 17h12"/>'),
    close: s('<path d="M6 6l12 12M18 6 6 18"/>'),
    chev: s('<path d="m6 9 6 6 6-6"/>'),
    arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    left: s('<path d="M15 18l-6-6 6-6"/>'),
    right: s('<path d="m9 18 6-6-6-6"/>'),
    heart: s('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'),
    pin: s('<path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    phone: s('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    insta: s('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
    fb: s('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
    cal: s('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    gauge: s('<path d="M12 14l4-4"/><path d="M3.3 17a9 9 0 1 1 17.4 0"/>'),
    gear: s('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 8v8M18 8v4H6"/>'),
    fuel: s('<path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M3 22h12M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h4"/>'),
    check: s('<path d="M20 6 9 17l-5-5"/>'),
    shield: s('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
    swap: s('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
    money: s('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>'),
    chat: s('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5h.5a8.5 8.5 0 0 1 8 8z"/>'),
    share: s('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'),
    car: s('<path d="M5 17h14M3 17v-4l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 13h18"/>')
  };

  /* ---------- utilitários ---------- */
  const brl = n => "R$ " + Number(n).toLocaleString("pt-BR");
  const kmFmt = n => (n == null ? "Km não informado" : Number(n).toLocaleString("pt-BR") + " km");
  const ano = v => `${v.anoFab}/${v.anoModelo}`;
  const nome = v => `${v.marca} ${v.modelo}${v.versao ? " " + v.versao : ""}`;
  const capa = v => (v.fotos && v.fotos[0]) || "";
  const slug = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = msg => `https://wa.me/${L.whatsapp}?text=${encodeURIComponent(msg)}`;
  const waCarro = v => waLink(`Olá! Vim pelo site e tenho interesse no ${nome(v)} ${ano(v)} (${brl(v.preco)}). Ainda está disponível?`);
  const urlVeiculo = v => `veiculo.html?id=${encodeURIComponent(v.id)}`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(L.mapsBusca)}`;

  const FAIXAS = [
    { id: "ate50", label: "Até R$ 50 mil", min: 0, max: 50000 },
    { id: "50a80", label: "R$ 50 a 80 mil", min: 50000, max: 80000 },
    { id: "80mais", label: "Acima de R$ 80 mil", min: 80000, max: Infinity }
  ];
  const TIPOS = ["Hatch", "Sedã", "SUV", "Picape", "Perua", "Moto"];
  const contar = (campo) => {
    const m = new Map();
    EST.forEach(v => m.set(v[campo], (m.get(v[campo]) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  };

  /* ---------- favoritos ---------- */
  const FKEY = "shopcar_favoritos";
  const favs = new Set(JSON.parse(localStorage.getItem(FKEY) || "[]"));
  const salvarFavs = () => localStorage.setItem(FKEY, JSON.stringify([...favs]));
  document.addEventListener("click", e => {
    const b = e.target.closest(".fav-btn");
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.id;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    salvarFavs();
    document.querySelectorAll(`.fav-btn[data-id="${CSS.escape(id)}"]`).forEach(x => {
      x.classList.toggle("is-on", favs.has(id));
      x.setAttribute("aria-pressed", favs.has(id));
    });
    document.dispatchEvent(new CustomEvent("favs-changed"));
  });

  /* ---------- card ---------- */
  function card(v) {
    const img = capa(v)
      ? `<img src="${esc(capa(v))}" alt="${esc(nome(v))}" loading="lazy" decoding="async">`
      : `<div class="no-photo">Fotos em breve</div>`;
    const novo = v.anoModelo >= new Date().getFullYear() - 1 ? `<span class="tag tag--blue">Ano recente</span>` : "";
    return `<article class="car-card">
      <a class="car-card__link" href="${urlVeiculo(v)}" aria-label="${esc(nome(v))}, ${ano(v)}, ${brl(v.preco)}"></a>
      <div class="car-card__media">${img}
        <div class="car-card__tags"><span class="tag">${esc(v.carroceria)}</span>${novo}</div>
        <button class="fav-btn ${favs.has(v.id) ? "is-on" : ""}" data-id="${esc(v.id)}" aria-pressed="${favs.has(v.id)}" aria-label="Favoritar ${esc(nome(v))}">${I.heart}</button>
      </div>
      <div class="car-card__body">
        <span class="car-card__brand">${esc(v.marca)}</span>
        <h3 class="t-card">${esc(v.modelo)}</h3>
        <span class="car-card__version">${esc(v.versao || " ")}</span>
        <div class="car-card__specs">
          <span>${I.cal}${ano(v)}</span>
          <span>${I.gauge}${kmFmt(v.km)}</span>
          ${v.cambio ? `<span>${I.gear}${esc(v.cambio)}</span>` : ""}
        </div>
        <div class="car-card__foot">
          <span class="t-price">${brl(v.preco)}</span>
          <a class="wa-round" href="${waCarro(v)}" target="_blank" rel="noopener" aria-label="Falar sobre ${esc(nome(v))} no WhatsApp">${I.wa}</a>
        </div>
      </div>
    </article>`;
  }

  /* ---------- cabeçalho ---------- */
  function header(pagina) {
    const marcas = contar("marca");
    const tipos = contar("carroceria");
    const dest = EST.filter(v => v.destaque && capa(v));
    const feat = dest[Math.floor(Math.random() * dest.length)] || EST[0];
    const h = L.horarios.filter(x => x.horas !== "Fechado").map(x => `${x.dias.replace("Segunda a sexta", "Seg a sex").replace("Sábado", "Sáb")} ${x.horas.replace(":00", "h").replace(" às ", "–").replace(":00", "h")}`).join(" · ");
    const el = document.createElement("header");
    el.className = "header" + (pagina === "home" ? "" : " is-solid");
    el.innerHTML = `
    <div class="utility"><div class="container">
      <div class="utility__group utility__group--left">
        <a href="${mapsLink}" target="_blank" rel="noopener">${I.pin}${esc(L.endereco.split(",")[0])} · ${esc(L.referencia)}</a>
        <span class="hide-sm">${I.clock}${esc(h)}</span>
      </div>
      <div class="utility__group utility__group--right">
        <a href="${esc(L.instagram)}" target="_blank" rel="noopener">${I.insta}${esc(L.instagramUsuario)}</a>
        <a href="${waLink("Olá! Vim pelo site.")}" target="_blank" rel="noopener">${I.phone}${esc(L.telefoneExibicao)}</a>
      </div>
    </div></div>
    <div class="nav-bar"><div class="container">
      <a class="logo" href="index.html" aria-label="${esc(L.nome)}, página inicial"><img src="img/logo.webp" alt="${esc(L.nome)}" width="330" height="58"></a>
      <nav class="nav" aria-label="Principal">
        <div class="nav__item" data-mega>
          <a class="nav__link ${pagina === "estoque" ? "is-active" : ""}" href="estoque.html" aria-haspopup="true" aria-expanded="false">Estoque ${I.chev}</a>
          <div class="mega"><div class="mega__inner">
            <div><p class="mega__title">Por marca</p><ul class="mega__list mega__list--cols">
              ${marcas.map(([m, n]) => `<li><a href="estoque.html?marca=${encodeURIComponent(m)}">${esc(m)} <small>${n}</small></a></li>`).join("")}
            </ul></div>
            <div><p class="mega__title">Por carroceria</p><ul class="mega__list">
              ${tipos.map(([t, n]) => `<li><a href="estoque.html?tipo=${encodeURIComponent(t)}">${esc(t)} <small>${n}</small></a></li>`).join("")}
            </ul></div>
            <div><p class="mega__title">Atalhos</p><ul class="mega__list">
              <li><a href="estoque.html">Todo o estoque <small>${EST.length}</small></a></li>
              ${FAIXAS.map(f => `<li><a href="estoque.html?faixa=${f.id}">${f.label}</a></li>`).join("")}
              <li><a href="estoque.html?cambio=Automático">Automáticos</a></li>
              <li><a href="estoque.html?ordem=menor-preco">Menor preço</a></li>
              <li><a href="estoque.html?favoritos=1">Meus favoritos</a></li>
            </ul></div>
            <div class="mega__feature-col">${feat ? `<a class="mega-feature" href="${urlVeiculo(feat)}">
              <img src="${esc(feat.capaHD || capa(feat))}" alt="" loading="lazy">
              <div class="mega-feature__body"><span class="eyebrow">Destaque da semana</span>
              <p class="t-h3" style="margin:.5rem 0 .25rem">${esc(feat.marca)} ${esc(feat.modelo)}</p>
              <span style="color:#ffffffcc">${ano(feat)} · ${kmFmt(feat.km)} · <b>${brl(feat.preco)}</b></span></div></a>` : ""}</div>
          </div></div>
        </div>
        <div class="nav__item"><a class="nav__link" href="index.html#financiamento">Financiamento</a></div>
        <div class="nav__item"><a class="nav__link" href="index.html#venda">Venda seu carro</a></div>
        <div class="nav__item"><a class="nav__link" href="index.html#sobre">A Shopcar</a></div>
        <div class="nav__item"><a class="nav__link" href="index.html#loja">Contato</a></div>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" data-open-search aria-label="Buscar">${I.search}</button>
        <a class="btn btn--primary btn--sm nav-cta" href="${waLink("Olá! Vim pelo site e gostaria de atendimento.")}" target="_blank" rel="noopener">${I.wa} WhatsApp</a>
        <button class="icon-btn menu-btn" data-open-drawer aria-label="Abrir menu">${I.menu}</button>
      </div>
    </div></div>`;
    document.body.prepend(el);

    // busca
    const sb = document.createElement("div");
    sb.className = "search"; sb.setAttribute("role", "dialog"); sb.setAttribute("aria-label", "Buscar no estoque");
    const pop = ["Onix", "HB20S", "Civic", "SUV", "Picape", "Automático"];
    sb.innerHTML = `<button class="icon-btn search__close" data-close-search aria-label="Fechar busca">${I.close}</button>
      <form action="estoque.html" role="search">${I.search}<input name="q" type="search" placeholder="Busque por marca, modelo ou versão" aria-label="Buscar" autocomplete="off"></form>
      <div class="search__chips"><span>Buscas populares</span>${pop.map(p => `<a class="chip" href="estoque.html?q=${encodeURIComponent(p)}">${p}</a>`).join("")}</div>`;
    document.body.append(sb);

    // gaveta
    const dr = document.createElement("div");
    dr.className = "drawer"; dr.setAttribute("aria-label", "Menu");
    dr.innerHTML = `<div class="drawer__top"><img src="img/logo.webp" alt="${esc(L.nome)}"><button class="icon-btn" data-close-drawer aria-label="Fechar menu">${I.close}</button></div>
      <button class="drawer__search" data-open-search>${I.search} Buscar no estoque</button>
      <a class="drawer__link" href="estoque.html">Estoque <span style="font-family:var(--ff-price);color:var(--blue-ink);font-weight:400">${EST.length}</span></a>
      <a class="drawer__link" href="index.html#financiamento">Financiamento ${I.arrow}</a>
      <a class="drawer__link" href="index.html#venda">Venda seu carro ${I.arrow}</a>
      <a class="drawer__link" href="index.html#sobre">A Shopcar ${I.arrow}</a>
      <a class="drawer__link" href="index.html#loja">Contato ${I.arrow}</a>
      <p class="drawer__label">Por carroceria</p>
      <div class="chips">${tipos.map(([t, n]) => `<a class="chip" href="estoque.html?tipo=${encodeURIComponent(t)}">${esc(t)} <small>${n}</small></a>`).join("")}</div>
      <p class="drawer__label">Por marca</p>
      <div class="chips">${marcas.map(([m, n]) => `<a class="chip" href="estoque.html?marca=${encodeURIComponent(m)}">${esc(m)} <small>${n}</small></a>`).join("")}</div>
      <div class="drawer__cta">
        <a class="btn btn--wa" href="${waLink("Olá! Vim pelo site e gostaria de atendimento.")}" target="_blank" rel="noopener">${I.wa} Falar no WhatsApp</a>
        <a class="btn btn--ghost" href="${mapsLink}" target="_blank" rel="noopener">${I.pin} Como chegar</a>
      </div>`;
    document.body.append(dr);

    // comportamento
    const megaItem = el.querySelector("[data-mega]");
    let tm;
    const abrir = on => { clearTimeout(tm); megaItem.classList.toggle("is-open", on); megaItem.querySelector(".nav__link").setAttribute("aria-expanded", on); el.classList.toggle("menu-open", on); };
    megaItem.addEventListener("mouseenter", () => abrir(true));
    megaItem.addEventListener("mouseleave", () => { tm = setTimeout(() => abrir(false), 140); });
    megaItem.addEventListener("focusin", () => abrir(true));
    megaItem.addEventListener("focusout", e => { if (!megaItem.contains(e.relatedTarget)) abrir(false); });

    const lock = on => document.documentElement.style.overflow = on ? "hidden" : "";
    document.addEventListener("click", e => {
      if (e.target.closest("[data-open-search]")) { dr.classList.remove("is-open"); sb.classList.add("is-open"); lock(true); setTimeout(() => sb.querySelector("input").focus(), 80); }
      if (e.target.closest("[data-close-search]") || e.target === sb) { sb.classList.remove("is-open"); lock(false); }
      if (e.target.closest("[data-open-drawer]")) { dr.classList.add("is-open"); lock(true); }
      if (e.target.closest("[data-close-drawer]") || (e.target.closest(".drawer a"))) { dr.classList.remove("is-open"); lock(false); }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") { sb.classList.remove("is-open"); dr.classList.remove("is-open"); abrir(false); lock(false); }
    });
    const onScroll = () => el.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- rodapé ---------- */
  function footer() {
    const marcas = contar("marca").slice(0, 8);
    const f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML = `<div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="img/logo.webp" alt="${esc(L.nome)}" loading="lazy">
          <p>Seminovos selecionados em Taguatinga, com financiamento facilitado e avaliação do seu usado na troca. ${esc(L.slogan)}.</p>
          <div class="footer__social">
            <a class="icon-btn" href="${esc(L.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
            ${L.facebook ? `<a class="icon-btn" href="${esc(L.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>` : ""}
            <a class="icon-btn" href="${waLink("Olá! Vim pelo site.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
          </div>
        </div>
        <nav aria-label="Estoque"><h4>Estoque</h4><ul>
          <li><a href="estoque.html">Ver todos (${EST.length})</a></li>
          ${marcas.map(([m]) => `<li><a href="estoque.html?marca=${encodeURIComponent(m)}">${esc(m)}</a></li>`).join("")}
        </ul></nav>
        <nav aria-label="Serviços"><h4>A Shopcar</h4><ul>
          <li><a href="index.html#financiamento">Financiamento</a></li>
          <li><a href="index.html#venda">Venda ou troca</a></li>
          <li><a href="index.html#sobre">Sobre a loja</a></li>
          <li><a href="estoque.html?favoritos=1">Meus favoritos</a></li>
        </ul></nav>
        <div><h4>Atendimento</h4><ul>
          <li><a href="${waLink("Olá! Vim pelo site.")}" target="_blank" rel="noopener">${esc(L.telefoneExibicao)}</a></li>
          <li><a href="mailto:${esc(L.email)}">${esc(L.email)}</a></li>
          <li><a href="${mapsLink}" target="_blank" rel="noopener">${esc(L.endereco)}<br>${esc(L.cidade)}</a></li>
          ${L.horarios.map(x => `<li><span>${esc(x.dias)}: ${esc(x.horas)}</span></li>`).join("")}
        </ul></div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(L.nome)} · ${esc(L.cidade)}</span>
        <span>Preços e disponibilidade sujeitos a alteração sem aviso prévio. Fotos meramente ilustrativas do veículo anunciado.</span>
      </div>
    </div>`;
    document.body.append(f);
    const wa = document.createElement("a");
    wa.className = "wa-float"; wa.href = waLink("Olá! Vim pelo site e gostaria de atendimento."); wa.target = "_blank"; wa.rel = "noopener";
    wa.setAttribute("aria-label", "Falar com a Shopcar no WhatsApp"); wa.innerHTML = I.wa;
    document.body.append(wa);
    // na home, o botão flutuante só aparece depois do topo (não cobre a busca rápida)
    if (document.querySelector(".hero")) {
      const upd = () => wa.classList.toggle("is-hidden", window.scrollY < window.innerHeight * .6);
      upd(); window.addEventListener("scroll", upd, { passive: true });
    }
  }

  /* ---------- carrossel arrastável ---------- */
  function rail(root) {
    const track = root.querySelector(".rail__track");
    const bar = root.querySelector(".rail__progress i");
    const upd = () => {
      if (!bar) return;
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      bar.style.width = Math.max(vis * 100, 8) + "%";
      bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 / Math.max(vis, .08)) - 1) * 100 : 0}%)`;
    };
    track.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    window.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-drag"); } track.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { if (!down) return; down = false; setTimeout(() => track.classList.remove("is-drag"), 0); });
    track.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
    root.closest("section")?.querySelectorAll("[data-rail-prev],[data-rail-next]").forEach(b =>
      b.addEventListener("click", () => track.scrollBy({ left: (b.hasAttribute("data-rail-next") ? 1 : -1) * step() * 2, behavior: "smooth" })));
  }

  /* ---------- animação ao rolar ---------- */
  function reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(n => io.observe(n));
  }

  window.SC = { L, EST, I, brl, kmFmt, ano, nome, capa, slug, esc, waLink, waCarro, urlVeiculo, mapsLink, FAIXAS, TIPOS, contar, favs, card, rail, reveal };

  document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.dataset.page || "home";
    header(pagina);
    footer();
    // dispara a página específica depois que o cabeçalho existe
    document.dispatchEvent(new CustomEvent("sc:ready"));
    reveal();
  });
})();
