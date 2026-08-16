
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // Счётчик Google Ads отключён: аккаунт AW-16920751041 принадлежит другой
  // компании, а подмена номера показывала клиентам чужой телефон.
  // Свой идентификатор Origin Movers подставить сюда, когда заведут аккаунт.
  function trackCall(){}
  // scroll to the quote form and focus the first field
  function scrollToQuote(){
    var f=document.getElementById('quote-form'); if(!f) return false;
    var h=document.querySelector('header.site');
    var off=(h?h.getBoundingClientRect().height:0)+10;
    var y=f.getBoundingClientRect().top+(window.pageYOffset||0)-off;
    window.scrollTo({top:Math.max(0,y), behavior:'instant'});
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
    if (!p || p.dataset.collapsible || document.querySelector('.prose__more')) return;
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
    function animateTo(y){
      var start = window.scrollY, dist = y - start, t0 = null;
      function step(t){
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / 420);
        var e = p < .5 ? 2*p*p : -1 + (4 - 2*p) * p;      /* плавный вход и выход */
        window.scrollTo(0, Math.round(start + dist * e));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function headOffset(){
      var h = document.querySelector('header.site');
      return (h ? h.getBoundingClientRect().height : 0) + 10;
    }
    function goTo(target, smooth){
      var y = target.getBoundingClientRect().top
            + (window.pageYOffset || document.documentElement.scrollTop)
            - headOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'instant' });
    }
    document.addEventListener('click', function(e){
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (id === '#top' || a.classList.contains('chatbubble')){
        animateTo(0);
        return;
      }
      var distance = Math.abs(target.getBoundingClientRect().top);
      goTo(target, false);          /* далеко — сразу, иначе скролл срывается */
      setTimeout(function(){ goTo(target, false) }, distance < 3000 ? 800 : 120);
      setTimeout(function(){ goTo(target, false) }, 1400);
      setTimeout(function(){ goTo(target, false) }, 2400);
      if (history.replaceState) history.replaceState(null, '', id);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* Подсказки при проверке полей. Тексты «Заполните это поле» рисует сам браузер
   на языке своего интерфейса — в разметке их нет. Задаём свои, английские. */
(function(){
  function boot(){
    var TEXT = {
      valueMissing:    'Please fill in this field.',
      typeMismatchEmail:'Please enter a valid email address, for example you@example.com.',
      typeMismatchUrl: 'Please enter a valid web address.',
      tooShort:        'Please make this a little longer.',
      tooLong:         'Please make this shorter.',
      patternMismatch: 'Please check the format of this field.',
      badInput:        'Please check what you typed here.',
      rangeUnderflow:  'Please choose a later value.',
      rangeOverflow:   'Please choose an earlier value.',
      stepMismatch:    'Please choose a valid value.'
    };
    function message(el){
      var v = el.validity;
      if (v.valueMissing){
        if (el.type === 'checkbox' || el.type === 'radio') return 'Please select this option.';
        if (el.tagName === 'SELECT') return 'Please choose one of the options.';
        if (el.type === 'tel') return 'Please enter a phone number we can call you back on.';
        return TEXT.valueMissing;
      }
      if (v.typeMismatch) return el.type === 'email' ? TEXT.typeMismatchEmail : TEXT.typeMismatchUrl;
      if (v.tooShort) return TEXT.tooShort;
      if (v.tooLong) return TEXT.tooLong;
      if (v.patternMismatch) return TEXT.patternMismatch;
      if (v.badInput) return TEXT.badInput;
      if (v.rangeUnderflow) return TEXT.rangeUnderflow;
      if (v.rangeOverflow) return TEXT.rangeOverflow;
      if (v.stepMismatch) return TEXT.stepMismatch;
      return '';
    }
    function refresh(el){
      if (!el.setCustomValidity || !el.willValidate) return;
      el.setCustomValidity('');
      if (!el.validity.valid) el.setCustomValidity(message(el));
    }
    function refreshAll(){ document.querySelectorAll('input, select, textarea').forEach(refresh) }
    refreshAll();
    document.addEventListener('invalid', function(e){ refresh(e.target) }, true);
    document.addEventListener('input',  function(e){ refresh(e.target) }, true);
    document.addEventListener('change', function(e){ refresh(e.target) }, true);
    document.addEventListener('blur',    function(e){ refresh(e.target) }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* Первый экран на телефоне должен быть чистым: оранжевая полоса звонка
   и плашка о куки раньше висели поверх него и съедали половину высоты.
   Показываем их только после того, как человек начал листать. */
(function(){
  function boot(){
    if (window.innerWidth > 820) return;
    var bar = document.getElementById('callbar');
    var cookie = document.getElementById('cookie');
    var hidden = false;
    try { hidden = localStorage.getItem('cb') === '1' } catch(e){}
    if (bar && !hidden) bar.classList.add('is-hidden');
    if (cookie) cookie.classList.add('is-hidden');
    function onScroll(){
      if (window.scrollY > 480){
        if (bar && !hidden) bar.classList.remove('is-hidden');
        if (cookie) cookie.classList.remove('is-hidden');
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* Кнопка «наверх» висела поверх текста с самого начала и мешала листать.
   Показываем её только когда действительно есть куда возвращаться. */
(function(){
  function boot(){
    var btn = document.querySelector('.chatbubble');
    if (!btn) return;
    function upd(){
      var надо = window.scrollY > 1000;
      btn.classList.toggle('is-hidden', !надо);
    }
    window.addEventListener('scroll', upd, { passive:true });
    upd();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* Названия городов из двух слов («Commerce City», «Highlands Ranch») не влезали
   в строку на телефоне. Подгоняем кегль под ширину полосы. */
(function(){
  function boot(){
    var sp = document.querySelector('.topband__title span');
    if (!sp) return;
    function fit(){
      var box = sp.parentElement.clientWidth;
      if (!box) return;
      sp.style.fontSize = '';
      var size = parseFloat(getComputedStyle(sp).fontSize);
      var guard = 0;
      while ((sp.scrollWidth > box - 4 || sp.getBoundingClientRect().height > size * 2.2) && size > 26 && guard < 40){
        size -= 2; sp.style.fontSize = size + 'px'; guard++;
      }
    }
    fit();
    window.addEventListener('resize', fit, { passive:true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
