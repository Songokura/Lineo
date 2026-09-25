/* ============================================================
   LINEO - скрипт страницы.
   Плиты и ящик с доводчиком (герой и плиты услуг) · вкладки шкафов ·
   перевод RU/KZ (словарь kk грузится по кнопке) · меню · бегущие ленты ·
   WhatsApp с готовым текстом · форма в WhatsApp. Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77001112480";              /* для wa.me */

var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.LN_CONV): phone, contact, lead. Пусто - не шлём. */
function conv(key){
  var id = (window.LN_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD", transport_type: "beacon"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Лежит в assets/lang/kk.js и грузится только по выбору KZ (или ?lang=kk / сохранённый выбор).
   В разметке и здесь казахского текста нет - проверка Google Ads видит русский сайт. */
var ASSET_V = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
var KK = null, KZ = {};
function loadKK(done){
  if (KK) return done();
  var s = document.createElement("script");
  s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = function(){ if (window.SITE_KK){ KK = window.SITE_KK; KZ = KK.dict || {}; } done(); };
  s.onerror = function(){ done(); };
  document.head.appendChild(s);
}

/* ---------------- ДАННЫЕ ВКЛАДОК ШКАФОВ (RU) ---------------- */
var SVC_RU = {
  kupe: {t:"Шкафы-купе", b:["Раздвижные двери на алюминиевом профиле, зеркало, стекло, ЛДСП","Встроенные в нишу и отдельно стоящие, до потолка","Наполнение под вещи: штанги, полки, ящики, корзины"]},
  rasp: {t:"Распашные шкафы", b:["Фасады ЛДСП, МДФ в эмали, шпон, со стеклом","Петли с доводчиком, подсветка внутри","Угловые и П-образные решения для спальни и детской"]},
  gard: {t:"Гардеробные", b:["Отдельная комната или угол за раздвижными дверями","Открытые системы: штанги, полки, выдвижные корзины, зона для обуви","Планировка под ваш гардероб: считаем метры полок и штанг"]}
};
function svcData(){ return (curLang() === "kk" && KK && KK.svc) ? KK.svc : SVC_RU; }

var WA_RU = {
  hero:"Здравствуйте! Хочу бесплатный замер корпусной мебели.\nЧто нужно: ",
  svc:"Здравствуйте! Интересует: {t}.\nРазмеры и пожелания: ",
  card:"Здравствуйте! Интересует: {t}.\nРазмеры и пожелания: ",
  kontakty:"Здравствуйте! Пишу с сайта LINEO. Вопрос: "
};
function waTxt(){ return (curLang() === "kk" && KK && KK.wa) ? KK.wa : WA_RU; }

var TICK_RU = ["Кухни","Шкафы-купе","Гардеробные","Прихожие","Гостиные","Спальни","Детские","Кабинеты","Тумбы и комоды","Мебель для бизнеса","Санузлы"];
var BRANDS = ["Egger","Blum","Boyard","DTC","KIRA","Томлесдрев","Maunfield","Greenwood","Decor+","IDGroup"];

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }
function curLang(){ return root.lang === "kk" ? "kk" : "ru"; }

/* ссылки WhatsApp собираются заранее (при смене языка/вкладки), а не в момент клика -
   так трекер LeadBot спокойно дописывает код обращения в href */
function setWaLinks(){
  var W = waTxt();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var key = a.dataset.wa, t = W[key] || W.hero;
    if (t.indexOf("{t}") > -1) {
      var name = "";
      if (a.dataset.t) {
        name = (curLang() === "kk" && KK && KK.t && KK.t[a.dataset.t]) ? KK.t[a.dataset.t] : a.dataset.t;
      } else {
        var box = a.closest(".svc, .card"), h = box ? box.querySelector(".svc-t, h3") : null;
        name = h ? h.textContent.trim() : "";
      }
      t = t.replace("{t}", name);
    }
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

function applyLang(lang){
  var kk = lang === "kk" && !!KK;
  root.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){
    var v = pick(el.dataset.iPh, kk); if (v !== undefined) el.setAttribute("placeholder", v);
  });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, kk); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (kk ? "kk" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("ln-lang", kk ? "kk" : "ru"); } catch(e){}
  plates.forEach(function(p){ renderSvc(p, p.cur, false); });
  setWaLinks();
  fillTicker();
  requestAnimationFrame(fitText);
}
/* ?lang= в URL сильнее localStorage: русское объявление не должно открыть казахскую версию.
   Язык по navigator.language не угадываем - казахский только явным выбором. */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("ln-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  setLang(lang);
}
function setLang(lang){
  if (lang === "kk") loadKK(function(){ applyLang("kk"); });
  else applyLang("ru");
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ setLang(b.getAttribute("data-lang")); });
});

/* дисплейные строки: казахский длиннее - ужимаем, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 span, .kphone").forEach(function(el){
    el.style.fontSize = "";
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.5) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩИЕ СТРОКИ ---------------- */
function fillRow(el, list, speed){
  if (!el) return;
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(14, w / speed) + "s");
}
function fillTicker(){
  var list = (curLang() === "kk" && KK && KK.tick) ? KK.tick : TICK_RU;
  fillRow(document.getElementById("ticker"), list, 46);
  fillRow(document.getElementById("brands1"), BRANDS, 40);
  fillRow(document.getElementById("brands2"), BRANDS.slice().reverse(), 34);
}
var rsTimer;
addEventListener("resize", function(){ clearTimeout(rsTimer); rsTimer = setTimeout(function(){ fillTicker(); fitText(); }, 200); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ВКЛАДКИ В ПЛИТАХ (шкафы) ---------------- */
var plates = [];
document.querySelectorAll(".pp").forEach(function(sec){
  var tabs = [].slice.call(sec.querySelectorAll(".tab"));
  if (!tabs.length) return;
  var p = {sec: sec, pw: sec.closest(".pw"), tabs: tabs, box: sec.querySelector(".svc"), imgs: [].slice.call(sec.querySelectorAll(".dw-ph img")), cur: tabs[0].dataset.svc};
  p.tabs.forEach(function(t){
    t.addEventListener("click", function(){
      renderSvc(p, t.dataset.svc, true);
      try { history.replaceState(null, "", "#" + t.id); } catch(e){}
    });
  });
  plates.push(p);
  renderSvc(p, p.cur, false);
});
function renderSvc(p, id, anim){
  if (!id) return;
  var d = svcData()[id] || SVC_RU[id]; if (!d) return;
  p.cur = id;
  p.tabs.forEach(function(t){ var on = t.dataset.svc === id; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
  p.imgs.forEach(function(im){ im.classList.toggle("is-on", im.dataset.svc === id); });
  var h = p.box.querySelector(".svc-t"), ul = p.box.querySelector(".svc-b");
  h.textContent = d.t;
  ul.innerHTML = d.b.map(function(x){ return "<li>" + x + "</li>"; }).join("");
  if (anim && !RED) { p.box.classList.remove("sw"); void p.box.offsetWidth; p.box.classList.add("sw"); }
  setWaLinks();
}
function findPlateByTab(id){
  for (var i = 0; i < plates.length; i++) for (var j = 0; j < plates[i].tabs.length; j++) if (plates[i].tabs[j].id === id) return plates[i];
  return null;
}

/* ---------------- ЯКОРЯ ----------------
   Якорь вкладки (#garderobnye) ведёт на плиту шкафов и сразу открывает вкладку. */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 66; };
function goTo(id, smooth){
  var t = document.getElementById(id); if (!t) return false;
  var p = findPlateByTab(id);
  if (p) { renderSvc(p, t.dataset.svc, false); t = p.pw; }
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH() + 8);
  /* мгновенный переход: гасим smooth у html, иначе нативная прокрутка к хэшу доедет поверх нашей */
  if (!smooth) root.style.scrollBehavior = "auto";
  scrollTo({ top: Math.max(0, top), behavior: (smooth && !RED) ? "smooth" : "auto" });
  if (!smooth) setTimeout(function(){ root.style.scrollBehavior = ""; }, 50);
  return true;
}
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  if (!document.getElementById(id)) return;
  e.preventDefault();
  closeMenu();
  goTo(id, true);
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ДОВОДЧИК ----------------
   Ход ящика 0..1: первые 72% пути - быстрый выезд (easeOut), последние 6% хода -
   медленное дотягивание, как у демпфера. Без отскока: доводчик не пружинит. */
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 2.6); }
function soft(p){
  p = clamp(p);
  if (p < 0.72) return 0.94 * easeOut(p / 0.72);
  return 0.94 + 0.06 * ((p - 0.72) / 0.28);
}

/* ---------------- ПЛИТЫ ----------------
   Один слушатель scroll через rAF. На каждую .pw пишем --enter/--exit/--stay и
   --slide (ход ящика). Герой получает --f (интро с доводчиком). */
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var pws = [].slice.call(document.querySelectorAll(".pw"));
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    var slide = pw === heroPw ? 1 : soft((enter - 0.18) / 0.62);
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.style.setProperty("--slide", slide.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.6);
    if (pw === heroPw) pw.style.setProperty("--f", soft(introK).toFixed(3));
  });
  hdrState();
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  pws.forEach(function(pw){ pw.classList.add("on"); });
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", update);
  /* интро 1250 мс: ящик выезжает сверху и дотягивается, текст поднимается.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = p;
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ requestAnimationFrame(step); });
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 520);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 1800);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){
  root.classList.add("no-intro");
  var id = location.hash.slice(1); if (!id || !document.getElementById(id)) return;
  goTo(id, false);
  setTimeout(function(){ goTo(id, false); }, 420);   /* добиваем, если нативный smooth ещё ехал */
});

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.08, rootMargin:"0px 0px -5% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- ФОРМА → WhatsApp ---------------- */
var FORM_RU = {hello:"Здравствуйте! Заявка на бесплатный замер с сайта LINEO.", name:"Имя", what:"Что нужно", phone:"Телефон", none:"не выбрано"};
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var phone = form.phone.value.trim();
  if (phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; form.phone.focus(); return; }
  err.hidden = true;
  var F = (curLang() === "kk" && KK && KK.form) ? KK.form : FORM_RU;
  var sel = form.what, what = sel.value ? sel.options[sel.selectedIndex].textContent.trim() : F.none;
  var name = form.name.value.trim();
  var t = F.hello + "\n" + (name ? F.name + ": " + name + "\n" : "") + F.what + ": " + what + "\n" + F.phone + ": " + phone;
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
fillTicker();
fitText();
hdrState();
/* прямой переход по якорю вкладки: открыть вкладку и встать на плиту */
if (location.hash) {
  var hid = location.hash.slice(1);
  if (document.getElementById(hid)) {
    setTimeout(function(){ goTo(hid, false); }, 60);
    /* шрифты догружаются позже и сдвигают раскладку - встаём на якорь ещё раз */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (location.hash.slice(1) === hid) goTo(hid, false); });
  }
}
})();
