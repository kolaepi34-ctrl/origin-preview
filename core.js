window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  function trackCall(){}
  function scrollToQuote(){
    var f=document.getElementById('quote-form'); if(!f) return false;
    var h=document.querySelector('header.site');
    var off=(h?h.getBoundingClientRect().height:0)+10;
    var y=f.getBoundingClientRect().top+(window.pageYOffset||0)-off;
    window.scrollTo({top:Math.max(0,y), behavior:'instant'});
    return false;
  }
  function pickCity(city){
    var f=document.getElementById('quote-form'); if(!f) return false;
    var from=f.querySelector('input[name="from"]'); if(from) from.value=city+', CO';
    var t=document.getElementById('quote-title'); if(t) t.textContent='Free quote — moving in '+city;
    scrollToQuote();
    return false;
  }
  function toggleMenu(){ var n=document.querySelector('nav.main'); if(n) n.classList.toggle('open'); }
  function toggleTheme(){
    var d=document.documentElement;
    var dark=d.getAttribute('data-theme')==='dark';
    d.setAttribute('data-theme', dark?'light':'dark');
  }
  
  async function submitQuote(e){
    var btn=e.target.querySelector('[type="submit"]');
    if(btn){ btn.disabled=true; btn.textContent="Sending…"; }
    return true;
  }
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
    btn.textContent = 'Read more about moving in Denver';
    btn.setAttribute('aria-expanded', 'false');
    p.after(btn);
    btn.addEventListener('click', function(){
      var open = p.classList.toggle('prose--open');
      var сек = p.closest('.seo-content');
      if (сек) сек.classList.toggle('is-open', open);
      p.classList.toggle('prose--clamped', !open);
      if (open){ p.style.setProperty('max-height','none','important');
        p.style.setProperty('overflow','visible','important');
        p.style.setProperty('-webkit-mask-image','none','important');
        p.style.setProperty('mask-image','none','important');
      } else { p.style.removeProperty('max-height'); p.style.removeProperty('overflow');
        p.style.removeProperty('-webkit-mask-image'); p.style.removeProperty('mask-image'); }
      btn.textContent = open ? 'Hide the text' : 'Read more about moving in Denver';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) p.scrollIntoView({block:'start', behavior:'smooth'});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
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
(function(){
  function boot(){
    var h = document.querySelector('.topband__title');
    if (!h) return;
    var svc = h.classList.contains('topband__title--svc');
    var sp = svc ? h : h.querySelector('span');
    if (!sp) return;
    var одно = sp.textContent.trim().split(/\s+/).length === 1;
    function fit(){
      var box = sp.parentElement.clientWidth;
      if (!box) return;
      sp.style.setProperty('white-space', (одно && !svc) ? 'nowrap' : 'normal', 'important');
      sp.style.removeProperty('font-size');
      var size = parseFloat(getComputedStyle(sp).fontSize);
      var guard = 0;
      while (guard < 60){
        var шире = sp.scrollWidth > box;
        var строк = Math.round(sp.getBoundingClientRect().height / (size * 0.98));
        var предел = svc ? 2 : (одно ? 1 : 2);
        if (!шире && строк <= предел) break;
        size -= 2;
        if (size < (svc ? 30 : 22)) break;
        sp.style.setProperty('font-size', size + 'px', 'important');
        guard++;
      }
    }
    fit();
    window.addEventListener('resize', fit, { passive:true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('load', fit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
(function(){
  function boot(){
    document.querySelectorAll('form[action*="formsubmit"]').forEach(function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        var было = btn ? btn.textContent : '';
        if (btn){ btn.disabled = true; btn.textContent = 'Sending…' }
        var сообщение = form.querySelector('.form-msg');
        if (!сообщение){
          сообщение = document.createElement('p');
          сообщение.className = 'form-msg';
          form.appendChild(сообщение);
        }
        сообщение.textContent = '';
        сообщение.classList.remove('form-msg--error');
        var стоп = new AbortController();
        var таймер = setTimeout(function(){ стоп.abort() }, 12000);   /* не висим дольше 12 с */
        fetch(form.action, { method:'POST', body:new FormData(form),
                             headers:{ 'Accept':'application/json' }, signal:стоп.signal })
          .then(function(r){
            clearTimeout(таймер);
            if (!r.ok) throw new Error('bad status');
            var next = form.querySelector('[name="_next"]');
            window.location.href = next ? next.value : 'thanks.html';
          })
          .catch(function(){
            clearTimeout(таймер);
            if (btn){ btn.disabled = false; btn.textContent = было }
            сообщение.classList.add('form-msg--error');
            сообщение.innerHTML = 'We could not send the form just now. '
              + 'Please call <a href="tel:+17204620407">720-462-0407</a> — we answer every day, 8am – 6pm.';
          });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
(function(){function b(){var c=document.getElementById("cookie");if(!c)return;var k=c.querySelector("button");if(k)k.addEventListener("click",function(){document.body.classList.add("cookies-ok");c.style.setProperty("display","none","important")});try{if(localStorage.getItem("ck"))document.body.classList.add("cookies-ok")}catch(e){}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",b);else b()})();
