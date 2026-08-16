
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-16920751041');
  // call-from-website tracking (swaps & counts calls)
  gtag('config', 'AW-16920751041/4qy3CMr96rsaEMHXuIQ_', { 'phone_conversion_number': '206-717-7177' });
  // fire call conversion when a phone link is clicked
  function trackCall(){ gtag('event','conversion',{'send_to':'AW-16920751041/4qy3CMr96rsaEMHXuIQ_'}); }
  // scroll to the quote form and focus the first field
  function scrollToQuote(){
    var f=document.getElementById('quote-form');
    if(f){ f.scrollIntoView({behavior:'smooth',block:'center'});
      var n=f.querySelector('input[name="name"]');
      if(n){ setTimeout(function(){ n.focus({preventScroll:true}); },450); }
    }
    return false;
  }
  // Click a city chip -> prefill the form and set the city in the form title, then scroll
  function pickCity(city){
    var f=document.getElementById('quote-form'); if(!f) return false;
    var from=f.querySelector('input[name="from"]'); if(from) from.value=city+', CO';
    var t=document.getElementById('quote-title'); if(t) t.textContent='Free quote — moving in '+city;
    scrollToQuote();
    return false;
  }
  // Mobile menu toggle
  function toggleMenu(){ var n=document.querySelector('nav.main'); if(n) n.classList.toggle('open'); }
  // Dark / light theme toggle (like the main site's moon button)
  function toggleTheme(){
    var d=document.documentElement;
    var dark=d.getAttribute('data-theme')==='dark';
    d.setAttribute('data-theme', dark?'light':'dark');
  }
  // Send the lead to the SAME wedoo24 inbox the main airusmovers.com form uses,
  // then fire the Colorado Ads conversion and go to the thank-you page.
  
  async function submitQuote(e){
    // Форма отправляется обычным POST на почту компании (FormSubmit),
    // поэтому перехватывать её не нужно — только блокируем двойной клик.
    var btn=e.target.querySelector('[type="submit"]');
    if(btn){ btn.disabled=true; btn.textContent="Sending…"; }
    return true;
  }

/* Длинный SEO-текст на телефоне: сворачиваем до трёх строк, читать по кнопке.
   Раньше, начав читать, закрыть его было нельзя — приходилось листать до конца. */
(function(){
  function init(){
    if (window.innerWidth > 820) return;
    var p = document.querySelector('.prose');
    if (!p || p.dataset.collapsible) return;
    p.dataset.collapsible = '1';
    p.classList.add('prose--clamped');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'prose__more';
    btn.textContent = 'Read more';
    btn.setAttribute('aria-expanded', 'false');
    p.after(btn);
    btn.addEventListener('click', function(){
      var open = p.classList.toggle('prose--open');
      p.classList.toggle('prose--clamped', !open);
      btn.textContent = open ? 'Hide' : 'Read more';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) p.scrollIntoView({block:'start', behavior:'smooth'});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Мобильное меню. core.js подключён в <head> без defer, поэтому обработчики
   ставим после разбора страницы — иначе nav ещё не существует и код молча выходил.
   Панель закрывается по пункту, по тапу мимо и по Esc; SERVICES и LOCATIONS
   раскрывают свой список, а не уводят на якорь. */
(function(){
  function boot(){
    var nav = document.querySelector('header.site nav.main');
    if (!nav) return;

    function close(){
      nav.classList.remove('open');
      nav.querySelectorAll('.navdrop.is-open').forEach(function(d){ d.classList.remove('is-open') });
      document.body.classList.remove('menu-open');
    }

    nav.addEventListener('click', function(e){
      if (window.innerWidth > 1080 || !nav.classList.contains('open')) return;
      var head = e.target.closest('.navdrop > a');
      if (!head) return;
      e.preventDefault();
      e.stopPropagation();
      var drop = head.parentElement;
      var wasOpen = drop.classList.contains('is-open');
      nav.querySelectorAll('.navdrop.is-open').forEach(function(d){ d.classList.remove('is-open') });
      if (!wasOpen) drop.classList.add('is-open');
    }, true);

    nav.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (a && !a.parentElement.classList.contains('navdrop')) close();
    });

    document.addEventListener('click', function(e){
      if (!nav.classList.contains('open')) return;
      if (e.target.closest('nav.main') || e.target.closest('.hamburger')) return;
      close();
    });

    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });

    var burger = document.querySelector('.hamburger');
    if (burger) burger.addEventListener('click', function(){
      setTimeout(function(){
        document.body.classList.toggle('menu-open', nav.classList.contains('open'));
      }, 0);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* Кнопки-якоря («Get a quote», пункты подвала). Родной переход по якорю попадал
   мимо: закреплённая шапка закрывала цель, а на длинных прокрутках плавный скролл
   срывался из-за подгрузки картинок. Считаем позицию сами и дважды поправляем. */
(function(){
  function boot(){
    function headOffset(){
      var h = document.querySelector('header.site');
      return (h ? h.getBoundingClientRect().height : 0) + 10;
    }
    function goTo(target, smooth){
      var y = target.getBoundingClientRect().top
            + (window.pageYOffset || document.documentElement.scrollTop)
            - headOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
    }
    document.addEventListener('click', function(e){
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var distance = Math.abs(target.getBoundingClientRect().top);
      goTo(target, distance < 3000);          /* далеко — сразу, иначе скролл срывается */
      setTimeout(function(){ goTo(target, false) }, distance < 3000 ? 800 : 120);
      setTimeout(function(){ goTo(target, false) }, 1400);
      if (history.replaceState) history.replaceState(null, '', id);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
