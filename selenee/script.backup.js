document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const header = $("#siteHeader"), menu = $("#mobileMenu"), search = $("#searchPanel"), account = $("#accountPanel"), drawer = $("#bagDrawer");
  const body = document.body;

  function setPanel(el,on){ if(!el) return; el.classList.toggle("active",on); el.setAttribute("aria-hidden",String(!on)); body.classList.toggle("panel-open",[menu,search,account].some(x=>x?.classList.contains("active"))); }
  $("#menuBtn")?.addEventListener("click",()=>setPanel(menu,true)); $("#closeMenu")?.addEventListener("click",()=>setPanel(menu,false)); menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setPanel(menu,false)));
  $("#searchBtn")?.addEventListener("click",()=>{setPanel(search,true);setTimeout(()=>$("#searchInput")?.focus(),120)}); $("#closeSearch")?.addEventListener("click",()=>setPanel(search,false));
  $("#accountBtn")?.addEventListener("click",()=>setPanel(account,true)); $("#closeAccount")?.addEventListener("click",()=>setPanel(account,false));
  $("#bagBtn")?.addEventListener("click",()=>drawer?.classList.add("active")); $("#closeBag")?.addEventListener("click",()=>drawer?.classList.remove("active"));
  window.addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>40),{passive:true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){setPanel(menu,false);setPanel(search,false);setPanel(account,false);drawer?.classList.remove("active")}});

  // Hero slider: autoplay + arrows + dots + keyboard + touch swipe.
  const slider=$("#heroSlider");
  if(slider){
    const track=slider.querySelector(".hero-track"), slides=$$(".hero-slide"), dots=$$(".hero-dot"), current=$("#heroCurrent"); let index=0, timer;
    function goTo(i, user=true){ index=(i+slides.length)%slides.length; track.style.transform=`translateX(-${index*100}%)`; slides.forEach((s,n)=>s.classList.toggle("is-active",n===index)); dots.forEach((d,n)=>{d.classList.toggle("is-active",n===index);d.setAttribute("aria-selected",String(n===index))}); if(current) current.textContent=String(index+1).padStart(2,"0"); if(user) restart(); }
    function restart(){clearInterval(timer);timer=setInterval(()=>goTo(index+1,false),6500)}
    $(".hero-next")?.addEventListener("click",()=>goTo(index+1)); $(".hero-prev")?.addEventListener("click",()=>goTo(index-1)); dots.forEach(d=>d.addEventListener("click",()=>goTo(+d.dataset.slide)));
    slider.addEventListener("mouseenter",()=>clearInterval(timer)); slider.addEventListener("mouseleave",restart); slider.addEventListener("focusin",()=>clearInterval(timer)); slider.addEventListener("focusout",restart);
    document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")goTo(index+1);if(e.key==="ArrowLeft")goTo(index-1)});
    let startX=0; slider.addEventListener("touchstart",e=>{startX=e.changedTouches[0].clientX},{passive:true}); slider.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)goTo(index+(dx<0?1:-1))},{passive:true}); restart();
  }

  // Bag persists across all separate pages.
  const bag=JSON.parse(localStorage.getItem("seleneBag")||"[]");
  function renderBag(){
    if(!$("#bagCount"))return; $("#bagCount").textContent=bag.length;
    if(!bag.length){$("#bagItems").innerHTML='<p class="empty-bag">Your bag is empty.</p>';$("#bagTotal").textContent="₹0";return}
    $("#bagItems").innerHTML=bag.map((x,i)=>`<div class="bag-item"><img src="${x.image}" alt=""><div class="bag-item-info"><strong>${x.name}</strong><p>₹${Number(x.price).toLocaleString("en-IN")}</p><button class="remove-item" data-i="${i}">REMOVE</button></div></div>`).join("");
    $("#bagTotal").textContent="₹"+bag.reduce((a,x)=>a+Number(x.price),0).toLocaleString("en-IN"); $$(".remove-item").forEach(b=>b.onclick=()=>{bag.splice(+b.dataset.i,1);saveBag()});
  }
  function saveBag(){localStorage.setItem("seleneBag",JSON.stringify(bag));renderBag()} renderBag();
  $$(".quick-add").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();const card=btn.closest(".product-card"),img=card?.querySelector(".product-main");if(!card||!img)return;bag.push({name:card.dataset.name,price:card.dataset.price,image:img.src});saveBag();drawer?.classList.add("active")}));

  // Global product search, not just the currently visible page.
  const catalog=[
    ["Bow Crochet Bag","2490","bags",0],["Ribbon Bow Bag","2590","bags",1],["Midnight Shoulder Bag","2790","bags",2],["Noir Chain Bag","2690","bags",3],["Soft Cream Crochet Bag","2390","bags",4],["Pearl Handle Bag","2490","bags",5],["Everyday Crochet Tote","2290","bags",6],["Ivory Mini Bag","2190","bags",7],["Woven Evening Bag","2890","bags",8],["Chocolate Crochet Bag","2590","bags",9],["Classic Shoulder Bag","2690","bags",10],
    ["Red Crochet Cardigan","2290","tops",0],["Olive Crochet Sweater","1990","tops",1],["Cloud Crochet Hoodie","2690","tops",2],["Pink Crochet Wrap","2290","tops",3],["Butter Yellow Sweater","1890","tops",4],["Black Halter Top","1790","tops",5],["Cream Crochet Top","1990","tops",6],["Beige Fringe Top","2090","tops",7],["Blue Crochet Halter","1790","tops",8],["Chocolate Halter","1790","tops",9]
  ];
  $("#searchInput")?.addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase(),results=$("#searchResults");if(!q){results.innerHTML="";return}const matches=catalog.filter(x=>x[0].toLowerCase().includes(q));results.innerHTML=matches.map(x=>`<a class="search-result" href="product.html?category=${x[2]}&id=${x[3]}"><span>${x[0]}</span><span>₹${Number(x[1]).toLocaleString("en-IN")}</span></a>`).join("")||'<p style="margin-top:20px;color:#777">No products found.</p>'});

  // Product detail page.
  const params=new URLSearchParams(location.search),cat=params.get("category"),id=Number(params.get("id"));
  const products={bags:[["Bow Crochet Bag","2490","bags/bag1.jpeg","bags/hover-bag1.jpeg"],["Ribbon Bow Bag","2590","bags/bag2.jpeg","bags/hover-bag2.jpeg"],["Midnight Shoulder Bag","2790","bags/bag3.jpeg","bags/hover-bag3.jpeg"],["Noir Chain Bag","2690","bags/bag4.jpeg","bags/hover-bag4.jpeg"],["Soft Cream Crochet Bag","2390","bags/bag5.jpeg","bags/hover-bag5.jpeg"],["Pearl Handle Bag","2490","bags/bag6.jpeg","bags/hover-bag6.jpeg"],["Everyday Crochet Tote","2290","bags/bag7.jpeg","bags/hover-bag7.jpeg"],["Ivory Mini Bag","2190","bags/bag8.jpeg","bags/hover-bag8.jpeg"],["Woven Evening Bag","2890","bags/bag9.jpeg","bags/hover-bag9.jpeg"],["Chocolate Crochet Bag","2590","bags/bag10.jpeg","bags/hover-bag10.jpeg"],["Classic Shoulder Bag","2690","bags/bag11.jpeg","bags/hover-bag11.jpeg"]],tops:[["Red Crochet Cardigan","2290","tops/top1.jpeg","tops/hover-top1.jpeg"],["Olive Crochet Sweater","1990","tops/top2.jpeg","tops/hover-top2.jpeg"],["Cloud Crochet Hoodie","2690","tops/top3.jpeg","tops/hover-top3.jpeg"],["Pink Crochet Wrap","2290","tops/top4.jpeg","tops/hover-top4.jpeg"],["Butter Yellow Sweater","1890","tops/top5.jpeg","tops/hover-top5.jpeg"],["Black Halter Top","1790","tops/top6.jpeg","tops/hover-top6.jpeg"],["Cream Crochet Top","1990","tops/top7.jpeg","tops/hover-top7.jpeg"],["Beige Fringe Top","2090","tops/top8.jpeg","tops/hover-top8.jpeg"],["Blue Crochet Halter","1790","tops/top9.jpeg","tops/hover-top9.jpeg"],["Chocolate Halter","1790","tops/top10.jpeg","tops/hover-top10.jpeg"]]};
  if($("#detailImage")&&products[cat]?.[id]){const p=products[cat][id];$("#detailImage").src=p[2];$("#detailHover").src=p[3];$("#detailName").textContent=p[0];$("#detailPrice").textContent="₹"+Number(p[1]).toLocaleString("en-IN");$("#detailCategory").textContent=cat.toUpperCase();$("#backCollection").href=cat+".html";$("#detailAdd").onclick=()=>{bag.push({name:p[0],price:p[1],image:p[2]});saveBag();drawer?.classList.add("active")}}

  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");obs.unobserve(e.target)}}),{threshold:.12}); $$(".reveal").forEach(x=>obs.observe(x)); $("#year")&&($("#year").textContent=new Date().getFullYear()); $$("img").forEach(img=>img.addEventListener("dragstart",e=>e.preventDefault()));
});