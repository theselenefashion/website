(() => {
  document.documentElement.classList.add("js-enhanced");
  const products = [
    { category: "bags", index: 0, name: "Bow Crochet Bag", price: 2490, image: "bags/bag1.jpeg" },
    { category: "bags", index: 1, name: "Ribbon Bow Bag", price: 2590, image: "bags/bag2.jpeg" },
    { category: "bags", index: 2, name: "Midnight Shoulder Bag", price: 2790, image: "bags/bag3.jpeg" },
    { category: "bags", index: 3, name: "Noir Chain Bag", price: 2690, image: "bags/bag4.jpeg" },
    { category: "bags", index: 4, name: "Soft Cream Crochet Bag", price: 2390, image: "bags/bag5.jpeg" },
    { category: "bags", index: 5, name: "Pearl Handle Bag", price: 2490, image: "bags/bag6.jpeg" },
    { category: "bags", index: 6, name: "Everyday Crochet Tote", price: 2290, image: "bags/bag7.jpeg" },
    { category: "bags", index: 7, name: "Ivory Mini Bag", price: 2190, image: "bags/bag8.jpeg" },
    { category: "bags", index: 8, name: "Woven Evening Bag", price: 2890, image: "bags/bag9.jpeg" },
    { category: "bags", index: 9, name: "Chocolate Crochet Bag", price: 2590, image: "bags/bag10.jpeg" },
    { category: "bags", index: 10, name: "Classic Shoulder Bag", price: 2690, image: "bags/bag11.jpeg" },
    { category: "tops", index: 0, name: "Red Crochet Cardigan", price: 2290, image: "tops/top1.jpeg" },
    { category: "tops", index: 1, name: "Olive Crochet Sweater", price: 1990, image: "tops/top2.jpeg" },
    { category: "tops", index: 2, name: "Cloud Crochet Hoodie", price: 2690, image: "tops/top3.jpeg" },
    { category: "tops", index: 3, name: "Pink Crochet Wrap", price: 2290, image: "tops/top4.jpeg" },
    { category: "tops", index: 4, name: "Butter Yellow Sweater", price: 1890, image: "tops/top5.jpeg" },
    { category: "tops", index: 5, name: "Black Halter Top", price: 1790, image: "tops/top6.jpeg" },
    { category: "tops", index: 6, name: "Cream Crochet Top", price: 1990, image: "tops/top7.jpeg" },
    { category: "tops", index: 7, name: "Beige Fringe Top", price: 2090, image: "tops/top8.jpeg" },
    { category: "tops", index: 8, name: "Blue Crochet Halter", price: 1790, image: "tops/top9.jpeg" },
    { category: "tops", index: 9, name: "Chocolate Halter", price: 1790, image: "tops/top10.jpeg" }
  ];

  const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
  const keyFor = product => `${product.category}-${product.index}`;
  const readStore = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  const writeStore = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  const readFlag = key => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeFlag = (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  };
  const removeStored = key => {
    try { localStorage.removeItem(key); } catch { /* Storage may be unavailable in private browsing. */ }
  };
  const getProduct = (category, index) => products.find(product => product.category === category && product.index === index);

  document.addEventListener("DOMContentLoaded", () => {
    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];
    const body = document.body;
    const header = $("#siteHeader");
    const menu = $("#mobileMenu");
    const search = $("#searchPanel");
    const account = $("#accountPanel");
    const drawer = $("#bagDrawer");

    function updateScrollState() {
      header?.classList.toggle("scrolled", window.scrollY > 40);
      const hero = $("#heroSlider");
      const cta = $("#scrollShopCta");
      if (cta && hero) {
        const visible = window.scrollY > 70 && window.scrollY < Math.max(0, hero.offsetHeight - 80);
        cta.classList.toggle("is-visible", visible);
        cta.setAttribute("aria-hidden", String(!visible));
      }
    }
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    function syncPanelState() {
      body.classList.toggle("panel-open", [menu, search, account, drawer].some(panel => panel?.classList.contains("active")));
    }
    function setPanel(panel, open, trigger) {
      if (!panel) return;
      if (open) {
        [menu, search, account, drawer].forEach(other => {
          if (other && other !== panel) {
            other.classList.remove("active");
            other.setAttribute("aria-hidden", "true");
          }
        });
        [menuButton, searchButton, accountButton, bagButton].forEach(button => {
          if (button && button !== trigger) button.setAttribute("aria-expanded", "false");
        });
      }
      panel.classList.toggle("active", open);
      panel.setAttribute("aria-hidden", String(!open));
      if (trigger) trigger.setAttribute("aria-expanded", String(open));
      syncPanelState();
      if (open) panel.querySelector(".panel-close")?.focus({ preventScroll: true });
      else if (trigger) trigger.focus({ preventScroll: true });
    }

    const menuButton = $("#menuBtn");
    const searchButton = $("#searchBtn");
    const accountButton = $("#accountBtn");
    const bagButton = $("#bagBtn");
    menuButton?.addEventListener("click", () => setPanel(menu, true, menuButton));
    $("#closeMenu")?.addEventListener("click", () => setPanel(menu, false, menuButton));
    menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setPanel(menu, false, menuButton)));
    searchButton?.addEventListener("click", () => {
      setPanel(search, true, searchButton);
      window.setTimeout(() => $("#searchInput")?.focus(), 100);
    });
    $("#closeSearch")?.addEventListener("click", () => setPanel(search, false, searchButton));
    accountButton?.addEventListener("click", () => setPanel(account, true, accountButton));
    $("#closeAccount")?.addEventListener("click", () => setPanel(account, false, accountButton));
    bagButton?.addEventListener("click", () => setPanel(drawer, true, bagButton));
    $("#closeBag")?.addEventListener("click", () => setPanel(drawer, false, bagButton));
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      [menu, search, account, drawer].forEach(panel => setPanel(panel, false));
      [menuButton, searchButton, accountButton, bagButton].forEach(button => button?.setAttribute("aria-expanded", "false"));
    });

    // A single, shared product catalog keeps search, cards and detail pages in sync.
    const searchInput = $("#searchInput");
    const searchResults = $("#searchResults");
    searchInput?.addEventListener("input", () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      if (!searchResults) return;
      searchResults.replaceChildren();
      if (!query) return;
      const matches = products.filter(product => `${product.name} ${product.category}`.toLocaleLowerCase().includes(query));
      if (!matches.length) {
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = "No pieces found. Try “bag” or “top”.";
        searchResults.append(empty);
        return;
      }
      matches.forEach(product => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = `product.html?category=${product.category}&id=${product.index}`;
        const name = document.createElement("span");
        name.textContent = product.name;
        const price = document.createElement("span");
        price.textContent = money(product.price);
        link.append(name, price);
        searchResults.append(link);
      });
    });

    // Cart data is normalized so older saved carts keep working after this upgrade.
    const savedBag = readStore("seleneBag", []);
    let bag = [];
    if (Array.isArray(savedBag)) {
      savedBag.forEach(item => {
        const product = products.find(entry => entry.name === item?.name) || getProduct(item?.category, Number(item?.index));
        if (!product) return;
        const quantity = Math.max(1, Math.min(99, Number(item.qty) || 1));
        const existing = bag.find(entry => entry.key === keyFor(product));
        if (existing) existing.qty = Math.min(99, existing.qty + quantity);
        else bag.push({ ...product, key: keyFor(product), qty: quantity });
      });
    }

    function saveBag() {
      writeStore("seleneBag", bag.map(({ key, category, index, name, price, image, qty }) => ({ key, category, index, name, price, image, qty })));
      renderBag();
      document.dispatchEvent(new CustomEvent("selene:bag-change", { detail: { count: bag.reduce((sum, item) => sum + item.qty, 0) } }));
    }
    function renderBag() {
      const count = bag.reduce((sum, item) => sum + item.qty, 0);
      const countEl = $("#bagCount");
      if (countEl) countEl.textContent = String(count);
      if (bagButton) bagButton.setAttribute("aria-label", `Open shopping bag, ${count} item${count === 1 ? "" : "s"}`);
      const items = $("#bagItems");
      const totalEl = $("#bagTotal");
      if (!items) return;
      items.replaceChildren();
      if (!bag.length) {
        const empty = document.createElement("p");
        empty.className = "empty-bag";
        empty.textContent = "Your bag is empty.";
        items.append(empty);
        if (totalEl) totalEl.textContent = money(0);
        return;
      }
      bag.forEach(item => {
        const row = document.createElement("article");
        row.className = "bag-item";
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        const info = document.createElement("div");
        info.className = "bag-item-info";
        const name = document.createElement("strong");
        name.textContent = item.name;
        const price = document.createElement("p");
        price.textContent = money(item.price);
        const controls = document.createElement("div");
        controls.className = "bag-quantity";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.className = "quantity-button";
        minus.setAttribute("aria-label", `Remove one ${item.name}`);
        minus.textContent = "−";
        minus.addEventListener("click", () => changeQuantity(item.key, -1));
        const quantity = document.createElement("span");
        quantity.textContent = String(item.qty);
        quantity.setAttribute("aria-label", `Quantity ${item.qty}`);
        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "quantity-button";
        plus.setAttribute("aria-label", `Add one ${item.name}`);
        plus.textContent = "+";
        plus.addEventListener("click", () => changeQuantity(item.key, 1));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item";
        remove.textContent = "REMOVE";
        remove.addEventListener("click", () => {
          bag = bag.filter(entry => entry.key !== item.key);
          saveBag();
        });
        controls.append(minus, quantity, plus, remove);
        info.append(name, price, controls);
        row.append(image, info);
        items.append(row);
      });
      if (totalEl) totalEl.textContent = money(bag.reduce((sum, item) => sum + item.price * item.qty, 0));
    }
    function changeQuantity(key, amount) {
      const item = bag.find(entry => entry.key === key);
      if (!item) return;
      item.qty += amount;
      if (item.qty <= 0) bag = bag.filter(entry => entry.key !== key);
      else item.qty = Math.min(99, item.qty);
      saveBag();
    }
    function addToBag(product) {
      if (!product) return;
      const key = keyFor(product);
      const existing = bag.find(item => item.key === key);
      if (existing) existing.qty = Math.min(99, existing.qty + 1);
      else bag.push({ ...product, key, qty: 1 });
      saveBag();
      setPanel(drawer, true, bagButton);
    }
    renderBag();
    window.addEventListener("storage", event => {
      if (event.key !== "seleneBag") return;
      bag = [];
      const next = readStore("seleneBag", []);
      if (Array.isArray(next)) next.forEach(item => {
        const product = products.find(entry => entry.name === item?.name);
        if (product) bag.push({ ...product, key: keyFor(product), qty: Math.max(1, Number(item.qty) || 1) });
      });
      renderBag();
    });

    $$(".quick-add").forEach(button => button.addEventListener("click", event => {
      event.preventDefault();
      const card = button.closest(".product-card");
      const product = products.find(entry => entry.name === card?.dataset.name);
      addToBag(product);
    }));
    $$(".checkout-btn").forEach(button => button.addEventListener("click", () => {
      if (bag.length) window.location.href = "checkout.html";
      else {
        button.textContent = "YOUR BAG IS EMPTY";
        window.setTimeout(() => { button.textContent = "CHECKOUT"; }, 1400);
      }
    }));

    // Product detail pages remain useful for valid links and explain invalid ones.
    const detailImage = $("#detailImage");
    if (detailImage) {
      const params = new URLSearchParams(window.location.search);
      const product = getProduct(params.get("category"), Number(params.get("id")));
      if (product) {
        detailImage.src = product.image;
        detailImage.alt = product.name;
        $("#detailCategory").textContent = product.category.toUpperCase();
        $("#detailName").textContent = product.name;
        $("#detailPrice").textContent = money(product.price);
        document.title = `${product.name} — SELENE`;
        $("#detailDescription").textContent = product.category === "bags"
          ? "A handmade SELENE bag, created slowly with a considered shape and tactile finish."
          : "A handmade SELENE crochet piece, created slowly with a considered shape and tactile finish.";
        $("#backCollection").href = `${product.category}.html`;
        $("#detailAdd")?.addEventListener("click", () => addToBag(product));
      } else {
        $("#productDetail").innerHTML = '<div class="product-unavailable"><p class="section-label">SELENE COLLECTION</p><h1>PIECE NOT FOUND</h1><p>This product link may have changed. Explore the collection to find your next favorite.</p><a class="text-link" href="shop.html">SHOP ALL PIECES</a></div>';
      }
    }

    // A local account preview stores only a name and email, never a password.
    const storedAccount = readStore("seleneAccount", null);
    const savedAccount = storedAccount && typeof storedAccount.email === "string"
      ? { name: String(storedAccount.name || ""), email: storedAccount.email.trim().toLowerCase() }
      : null;
    if (savedAccount && (storedAccount.password || Object.keys(storedAccount).some(key => !["name", "email"].includes(key)))) {
      writeStore("seleneAccount", savedAccount);
    }
    const loginForm = $("#loginForm");
    const registerForm = $("#registerForm");
    const accountCard = $("#loggedInCard");
    const loggedIn = readFlag("seleneLoggedIn") === "1";
    function renderAccountCard(profile) {
      if (!accountCard || !profile) return;
      loginForm?.setAttribute("hidden", "");
      registerForm?.setAttribute("hidden", "");
      $(".account-divider")?.setAttribute("hidden", "");
      accountCard.hidden = false;
      accountCard.replaceChildren();
      const label = document.createElement("p");
      label.className = "section-label";
      label.textContent = "YOUR PREVIEW PROFILE";
      const name = document.createElement("h2");
      name.textContent = profile.name || "SELENE CUSTOMER";
      const email = document.createElement("p");
      email.textContent = profile.email;
      const actions = document.createElement("div");
      actions.className = "account-actions";
      const ordersLink = document.createElement("a");
      ordersLink.className = "detail-add";
      ordersLink.href = "orders.html";
      ordersLink.textContent = "MY ORDERS";
      const logout = document.createElement("button");
      logout.className = "outline-btn";
      logout.type = "button";
      logout.textContent = "LOG OUT";
      logout.addEventListener("click", () => {
        removeStored("seleneLoggedIn");
        window.location.reload();
      });
      actions.append(ordersLink, logout);
      accountCard.append(label, name, email, actions);
    }
    if (loggedIn && savedAccount) renderAccountCard(savedAccount);
    loginForm?.addEventListener("submit", event => {
      event.preventDefault();
      const email = $("#loginEmail").value.trim().toLowerCase();
      const message = $("#loginMessage");
      if (!savedAccount || savedAccount.email !== email) {
        message.textContent = "No preview profile matches this email in this browser. Create one below.";
        message.className = "form-message error";
        return;
      }
      if (!writeFlag("seleneLoggedIn", "1")) {
        message.textContent = "Browser storage is unavailable. The preview profile could not be opened.";
        message.className = "form-message error";
        return;
      }
      message.textContent = "Preview profile opened.";
      message.className = "form-message success";
      window.setTimeout(() => window.location.reload(), 350);
    });
    registerForm?.addEventListener("submit", event => {
      event.preventDefault();
      const profile = {
        name: $("#registerName").value.trim(),
        email: $("#registerEmail").value.trim().toLowerCase()
      };
      if (!writeStore("seleneAccount", profile)) {
        $("#registerMessage").textContent = "Browser storage is unavailable. Your profile could not be saved.";
        $("#registerMessage").className = "form-message error";
        return;
      }
      if (!writeFlag("seleneLoggedIn", "1")) {
        $("#registerMessage").textContent = "Browser storage is unavailable. The preview profile could not be opened.";
        $("#registerMessage").className = "form-message error";
        return;
      }
      $("#registerMessage").textContent = "Preview profile created on this device.";
      $("#registerMessage").className = "form-message success";
      window.setTimeout(() => window.location.reload(), 350);
    });

    // Orders and checkout are explicitly a local preview. Nothing is transmitted or paid.
    const ordersList = $("#ordersList");
    const savedOrders = readStore("seleneOrders", []);
    if (Array.isArray(savedOrders)) {
      const privateFields = ["name", "email", "phone", "address"];
      const cleanedOrders = savedOrders.map(order => {
        const clean = { ...order };
        privateFields.forEach(field => delete clean[field]);
        return clean;
      });
      if (savedOrders.some(order => privateFields.some(field => Object.prototype.hasOwnProperty.call(order, field)))) {
        writeStore("seleneOrders", cleanedOrders);
      }
    }
    if (ordersList) {
      const orders = Array.isArray(savedOrders) ? savedOrders : [];
      ordersList.replaceChildren();
      if (!Array.isArray(orders) || !orders.length) {
        ordersList.innerHTML = '<div class="empty-state"><p class="section-label">NO PREVIEW ORDERS YET</p><h2>YOUR SELENE STORY STARTS HERE.</h2><a href="shop.html" class="text-link">SHOP THE COLLECTION</a></div>';
      } else {
        orders.slice().reverse().forEach(order => {
          const card = document.createElement("article");
          card.className = "order-card";
          const details = document.createElement("div");
          const label = document.createElement("p");
          label.className = "section-label";
          label.textContent = `PREVIEW ${order.id}`;
          const itemCount = document.createElement("h2");
          const count = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0) : 0;
          itemCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
          const date = document.createElement("p");
          date.textContent = order.date || "";
          details.append(label, itemCount, date);
          const summary = document.createElement("div");
          const total = document.createElement("strong");
          total.textContent = money(order.total);
          const status = document.createElement("p");
          status.className = "order-status";
          status.textContent = "Saved on this device · not submitted";
          summary.append(total, status);
          card.append(details, summary);
          ordersList.append(card);
        });
      }
    }

    const checkoutItems = $("#checkoutItems");
    if (checkoutItems) {
      checkoutItems.replaceChildren();
      const checkoutForm = $("#checkoutForm");
      if (!bag.length) {
        checkoutItems.innerHTML = '<p>Your bag is empty. <a href="shop.html">Shop the collection.</a></p>';
        checkoutForm?.setAttribute("hidden", "");
      } else {
        bag.forEach(item => {
          const row = document.createElement("div");
          row.className = "checkout-item";
          const image = document.createElement("img");
          image.src = item.image;
          image.alt = item.name;
          const details = document.createElement("div");
          const name = document.createElement("strong");
          name.textContent = `${item.name} × ${item.qty}`;
          const price = document.createElement("span");
          price.textContent = money(item.price * item.qty);
          details.append(name, price);
          row.append(image, details);
          checkoutItems.append(row);
        });
        $("#checkoutTotal").textContent = money(bag.reduce((sum, item) => sum + item.price * item.qty, 0));
      }
      checkoutForm?.addEventListener("submit", event => {
        event.preventDefault();
        if (!bag.length) return;
        const id = `SEL-${String(Date.now()).slice(-6)}`;
        const orders = readStore("seleneOrders", []);
        const order = {
          id,
          items: bag.map(({ category, index, name, price, image, qty }) => ({ category, index, name, price, image, qty })),
          total: bag.reduce((sum, item) => sum + item.price * item.qty, 0),
          status: "Preview only",
          date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        };
        if (!writeStore("seleneOrders", [...(Array.isArray(orders) ? orders : []), order])) {
          $("#checkoutMessage").textContent = "Browser storage is unavailable. This preview order was not saved.";
          $("#checkoutMessage").className = "form-message error";
          return;
        }
        bag = [];
        saveBag();
        $("#checkoutMessage").textContent = `Preview ${id} saved on this device. No payment was taken and no order was sent.`;
        $("#checkoutMessage").className = "form-message success";
        const submit = checkoutForm.querySelector('[type="submit"]');
        if (submit) submit.disabled = true;
        window.setTimeout(() => { window.location.href = "orders.html"; }, 1600);
      });
    }

    // Hero slider pauses for reduced-motion preferences, keyboard focus and hidden tabs.
    const slider = $("#heroSlider");
    if (slider) {
      const slides = $$(".hero-slide");
      const dots = $$(".hero-dot");
      const current = $("#heroCurrent");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let index = Math.max(0, slides.findIndex(slide => slide.classList.contains("is-active")));
      let timer;
      let animating = false;
      const transitionDuration = reduceMotion ? 650 : 1000;
      slides.forEach((slide, position) => {
        slide.style.setProperty("--image-x", position === index ? "0%" : "100%");
        slide.setAttribute("aria-hidden", String(position !== index));
      });
      function goTo(requested, userInitiated = true) {
        if (animating || slides.length < 2) return;
        const next = (requested + slides.length) % slides.length;
        if (next === index) return;
        animating = true;
        const direction = next > index || (index === slides.length - 1 && next === 0) ? 1 : -1;
        const leaving = slides[index];
        const arriving = slides[next];
        slides.forEach((slide, position) => {
          slide.classList.remove("is-active", "is-leaving-left", "is-leaving-right", "is-entering-left", "is-entering-right");
          slide.setAttribute("aria-hidden", String(position !== next));
          if (position !== index && position !== next) slide.style.setProperty("--image-x", direction > 0 ? "100%" : "-100%");
        });
        arriving.style.setProperty("--image-x", direction > 0 ? "100%" : "-100%");
        arriving.classList.add("is-active", direction > 0 ? "is-entering-right" : "is-entering-left");
        leaving.classList.add(direction > 0 ? "is-leaving-left" : "is-leaving-right");
        dots.forEach((dot, position) => {
          dot.classList.toggle("is-active", position === next);
          dot.setAttribute("aria-selected", String(position === next));
        });
        if (current) current.textContent = String(next + 1).padStart(2, "0");
        index = next;
        window.setTimeout(() => {
          leaving.classList.remove("is-leaving-left", "is-leaving-right", "is-active");
          leaving.style.setProperty("--image-x", direction > 0 ? "100%" : "-100%");
          arriving.classList.remove("is-entering-left", "is-entering-right");
          animating = false;
        }, transitionDuration + 50);
        if (userInitiated) restartHero();
      }
      function restartHero() {
        window.clearInterval(timer);
        if (!document.hidden) timer = window.setInterval(() => goTo(index + 1, false), 4500);
      }
      $(".hero-next")?.addEventListener("click", () => goTo(index + 1));
      $(".hero-prev")?.addEventListener("click", () => goTo(index - 1));
      dots.forEach(dot => dot.addEventListener("click", () => goTo(Number(dot.dataset.slide))));
      slider.addEventListener("mouseenter", () => window.clearInterval(timer));
      slider.addEventListener("mouseleave", restartHero);
      slider.addEventListener("focusin", () => window.clearInterval(timer));
      slider.addEventListener("focusout", restartHero);
      document.addEventListener("visibilitychange", restartHero);
      slider.addEventListener("keydown", event => {
        if (event.key === "ArrowRight") goTo(index + 1);
        if (event.key === "ArrowLeft") goTo(index - 1);
      });
      let startX = 0;
      slider.addEventListener("touchstart", event => { startX = event.changedTouches[0].clientX; }, { passive: true });
      slider.addEventListener("touchend", event => {
        const distance = event.changedTouches[0].clientX - startX;
        if (Math.abs(distance) > 45) goTo(index + (distance < 0 ? 1 : -1));
      }, { passive: true });
      restartHero();
    }

    const shopGrid = $("#shopProductGrid");
    if (shopGrid) {
      const tabs = $$(".shop-tab");
      const count = $("#shopProductCount");
      const cards = [...shopGrid.querySelectorAll(".product-card")];
      const shopHero = $("#shopHeroImage");
      const heroCampaigns = {
        all: { src: "shop-hero.png", alt: "SELENE campaign showing a crochet top and navy bag beside the words Tops & Bags." },
        bags: { src: "bags-hero.png", alt: "Two campaign portraits featuring SELENE navy crochet bags, with the message Bags That Move With You." },
        tops: { src: "tops-hero.png", alt: "Two campaign portraits featuring SELENE black crochet tops, with the message Tops That Feel Like You." }
      };
      let heroRequest = 0;
      function updateShopHero(filter) {
        const campaign = heroCampaigns[filter];
        if (!shopHero || !campaign) return;
        const request = ++heroRequest;
        if (shopHero.getAttribute("src") === campaign.src) {
          shopHero.classList.remove("is-changing");
          return;
        }
        shopHero.classList.add("is-changing");
        const nextImage = new Image();
        let swapped = false;
        const swapImage = () => {
          if (swapped || request !== heroRequest) return;
          swapped = true;
          shopHero.src = campaign.src;
          shopHero.alt = campaign.alt;
          requestAnimationFrame(() => {
            if (request === heroRequest) shopHero.classList.remove("is-changing");
          });
        };
        nextImage.onload = swapImage;
        nextImage.onerror = () => {
          if (request === heroRequest) shopHero.classList.remove("is-changing");
        };
        nextImage.src = campaign.src;
        if (nextImage.complete && nextImage.naturalWidth > 0) swapImage();
      }
      function applyFilter(filter) {
        let visible = 0;
        cards.forEach(card => {
          const show = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-hidden", !show);
          if (show) visible++;
        });
        if (count) count.textContent = String(visible);
        tabs.forEach(tab => {
          const active = tab.dataset.filter === filter;
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-pressed", String(active));
        });
        updateShopHero(filter);
      }
      tabs.forEach(tab => tab.addEventListener("click", () => applyFilter(tab.dataset.filter)));
      applyFilter("all");
    }

    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.12 });
      $$(".reveal").forEach(element => observer.observe(element));
    } else {
      $$(".reveal").forEach(element => element.classList.add("revealed"));
    }
  });
})();
