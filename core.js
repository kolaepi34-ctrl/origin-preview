
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
  var CHATWOOT_BASE='https://wedoo24.145-79-6-111.sslip.io/public/api/v1/inboxes/z4kPG6UpgkTVonnBZaTAarjZ';
  async function submitQuote(e){
    e.preventDefault();
    var form=e.target, btn=form.querySelector('[type="submit"]');
    var g=function(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
    btn.disabled=true; btn.textContent='Sending…';
    var content='🟥 New Denver quote request\n'
      +'Name: '+g('name')+'\n'
      +'Phone: '+g('phone')+'\n'
      +'Email: '+(g('email')||'—')+'\n'
      +'Move date: '+(g('date')||'—')+'\n'
      +'Moving from: '+(g('from')||'—')+'\n'
      +'Moving to: '+(g('to')||'—')+'\n'
      +'Service: '+g('service')+'\n'
      +'Notes: '+(g('message')||'—')+'\n'
      +'Source: Denver landing page';
    try{
      var c=await fetch(CHATWOOT_BASE+'/contacts',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:g('name'),email:g('email'),phone_number:g('phone')})});
      var cj=await c.json();
      var sid=cj.source_id || (cj.contact&&cj.contact.source_id) || (cj.payload&&cj.payload.contact&&cj.payload.contact.source_id);
      if(sid){
        var cv=await fetch(CHATWOOT_BASE+'/contacts/'+sid+'/conversations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({})});
        var cvj=await cv.json();
        await fetch(CHATWOOT_BASE+'/contacts/'+sid+'/conversations/'+cvj.id+'/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:content})});
      }
    }catch(err){ /* even if inbox fails, still send the user to the thank-you page */ }
    // The Google Ads form-submit conversion is fired ONCE on thanks.html (avoid double counting)
    try{fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'form-name':'denver-quote',name:g('name'),phone:g('phone'),email:g('email'),date:g('date'),from:g('from'),to:g('to'),service:g('service'),message:g('message')}).toString()});}catch(e){}
    window.location='thanks.html';
    return false;
  }
