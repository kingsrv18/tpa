const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const set=(s,styles,root=document)=>$$(s,root).forEach(e=>Object.assign(e.style,styles));
const visible=(s,on,root=document)=>set(s,{opacity:on?'1':'0',visibility:on?'visible':'hidden'},root);
const animate=(el,frames,options={})=>{if(el&&!reduced)return el.animate(frames,{duration:650,easing:'cubic-bezier(.2,.7,.2,1)',...options});};

// Start and stop animation timers when their section enters/leaves the viewport.
function sequence(root,steps,duration){
  if(!root)return;
  let timers=[],active=false;
  const stop=()=>{timers.forEach(clearTimeout);timers=[];active=false;};
  const play=()=>{if(!active||document.hidden)return;steps.forEach(([at,fn])=>timers.push(setTimeout(()=>{if(active)fn();},at)));timers.push(setTimeout(play,duration));};
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!reduced){if(!active){active=true;play();}}else stop();},{threshold:.1});io.observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(root.getBoundingClientRect().bottom>0&&root.getBoundingClientRect().top<innerHeight){active=true;play();}});
}

// Navigation and the compact mobile drawer.
const nav=$('body>nav')||$('.layernote-theme>nav'),menuButton=$('button[aria-label="Open menu"]',nav);
const navHover=document.createElement('span');navHover.className='tpa-nav-hover-highlight';navHover.setAttribute('aria-hidden','true');nav.append(navHover);
$$('[data-nav-id]',nav).forEach(link=>{link.style.position='relative';link.style.zIndex='1';const hover=()=>{const rect=link.getBoundingClientRect(),base=nav.getBoundingClientRect();Object.assign(navHover.style,{width:rect.width+20+'px',height:rect.height+12+'px',transform:`translate(${rect.left-base.left-10}px,${rect.top-base.top-6}px)`,opacity:'1'});};link.addEventListener('pointerenter',hover);link.addEventListener('focus',hover);link.addEventListener('blur',()=>navHover.style.opacity='0');});nav.addEventListener('pointerleave',()=>navHover.style.opacity='0');
const mobile=document.createElement('div');mobile.className='mobile-menu';mobile.hidden=true;mobile.id='mobile-navigation';
mobile.innerHTML='<a href="#about">Our community</a><a href="#pricing">Membership</a><a href="/events">Events</a><a href="#capabilities">Resources</a><a href="#connect">Contact</a><a href="#faq">FAQ</a><a href="/login">Member login ↗</a>';
nav.append(mobile);menuButton.setAttribute('aria-controls',mobile.id);
function closeMenu(){mobile.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton.addEventListener('click',()=>{const open=mobile.hidden;mobile.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');if(open)animate(mobile,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}]);});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closePreferences();closeDropdowns();}});

// Heading reveals and staggered entry of product illustrations.
const reveals=$$('[data-reveal-heading],[data-reveal-eyebrow],[data-reveal-intro],[data-reveal-line],[data-solution-heading],[data-solution-eyebrow],[data-solution-intro],[data-trio-card],[data-power-card]');
const revealObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;target.classList.add('reveal-seen');animate(target,[{opacity:0,translate:'0 28px'},{opacity:1,translate:'0 0'}],{duration:800});revealObserver.unobserve(target);}),{rootMargin:'0px 0px -35px 0px',threshold:.12});
reveals.forEach(e=>{e.classList.add('reveal-ready');revealObserver.observe(e);});
$$('[data-hero-line],[data-hero-copy]').forEach((e,i)=>animate(e,[{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0'}],{delay:80+i*80,duration:850}));
animate($('[data-hero-mark-bg]'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{delay:350,duration:900});
animate($('[data-hero-mark-check]'),[{opacity:0,scale:'0.5'},{opacity:1,scale:'1'}],{delay:1100,duration:400});

// Hero: pin a comment, hand the feedback to Claude, and resolve it on the page.
const hero=$('[data-hero-visual]');
function heroReset(){
  hero?.classList.remove('hero-resolved','hero-terminal');
  set('[data-mock-active-count],[data-mock-open-count]',{},hero);$$('[data-mock-active-count],[data-mock-open-count]',hero).forEach(x=>x.textContent='3');$$('[data-mock-resolved-count]',hero).forEach(x=>x.textContent='0');
  visible('[data-mock-popup],[data-mock-composer],[data-scene-terminal],[data-mock-scrim],[data-mock-empty]',false,hero);visible('[data-mock-note-row],[data-mock-anno],[data-mock-note]',true,hero);visible('[data-mock-pin-num],[data-mock-note-num],[data-mock-status-open]',true,hero);visible('[data-mock-pin-check],[data-mock-note-check],[data-mock-status-done]',false,hero);
  set('[data-mock-note-row]',{height:'auto'},hero);set('[data-mock-headline]',{fontWeight:'400'},hero);
  visible('[data-mock-pin],[data-mock-note],[data-mock-row-pin]',true,hero);visible('[data-mock-row-status]',false,hero);set('[data-mock-pin],[data-mock-note],[data-mock-row-pin]',{backgroundColor:'#6af3ff'},hero);
  set('[data-mock-tab-active]',{borderBottom:'2px solid #05131a',fontWeight:'500'},hero);set('[data-mock-tab-resolved]',{borderBottom:'2px solid transparent',fontWeight:'400'},hero);
}
function heroResolve(){hero?.classList.add('hero-resolved');visible('[data-mock-pin-num],[data-mock-note-num],[data-mock-status-open]',false,hero);visible('[data-mock-pin-check],[data-mock-note-check],[data-mock-status-done],[data-mock-row-status]',true,hero);$$('[data-mock-active-count],[data-mock-open-count]',hero).forEach(x=>x.textContent='0');$$('[data-mock-resolved-count]',hero).forEach(x=>x.textContent='3');set('[data-mock-headline]',{fontWeight:'500'},hero);set('[data-mock-tab-active]',{borderBottom:'2px solid transparent',fontWeight:'400'},hero);set('[data-mock-tab-resolved]',{borderBottom:'2px solid #05131a',fontWeight:'500'},hero);}
function typeText(el,text){if(!el)return;if(reduced){el.textContent=text;return;}const start=performance.now();const frame=now=>{if(!el.isConnected)return;const ratio=Math.min(1,(now-start)/1000);el.textContent=text.slice(0,Math.round(ratio*text.length));if(ratio<1)requestAnimationFrame(frame);};requestAnimationFrame(frame);}
const heroSteps=[
  [0,heroReset],
  [900,()=>{visible('[data-mock-amelia]',true,hero);animate($('[data-mock-amelia]',hero),[{transform:'translate(500px,200px)'},{transform:'translate(380px,120px)'}],{duration:1500,fill:'forwards'});} ],
  [1900,()=>visible('[data-mock-composer]',true,hero)],
  [2100,()=>{typeText($('[data-mock-typed]',hero),'Bring your experience and your curiosity.');visible('[data-mock-placeholder]',false,hero);}],
  [4100,()=>{visible('[data-mock-composer]',false,hero);visible('[data-mock-popup]',true,hero);visible('[data-mock-amelia]',false,hero);}],
  [6200,()=>{hero?.classList.add('hero-terminal');visible('[data-term-line]',false,hero);}],
  ...Array.from({length:12},(_,i)=>[6600+i*290,()=>{const e=$$('[data-term-line]',hero)[i];if(e){e.style.opacity='1';e.style.visibility='visible';}}]),
  [10800,()=>{hero?.classList.remove('hero-terminal');heroResolve();visible('[data-mock-popup]',true,hero);}],
  [14200,()=>visible('[data-mock-popup]',false,hero)]
];
if(hero){heroReset();sequence(hero,heroSteps,17000);$$('[data-mock-pin],[data-mock-note]',hero).forEach(e=>{e.style.cursor='pointer';e.addEventListener('click',()=>visible('[data-mock-popup]',true,hero));});$('[data-mock-resolve-btn]',hero)?.addEventListener('click',heroResolve);}

// Workflow tabs scroll to their stacked section, and track scroll position.
const workflow=$('#how-it-works'),panels=$$('[data-index]',workflow),tabs=$$('button',workflow).slice(0,3);
const panelTop=p=>p.parentElement.getBoundingClientRect().top+scrollY+p.offsetTop;
tabs.forEach((b,i)=>{b.setAttribute('aria-controls','workflow-step-'+i);panels[i].id='workflow-step-'+i;b.addEventListener('click',()=>{window.scrollTo({top:panelTop(panels[i])-132,behavior:reduced?'auto':'smooth'});});});
let scrollQueued=false;
function updateScroll(){
  scrollQueued=false;let active=0;panels.forEach((p,i)=>{if(panelTop(p)-scrollY<=innerHeight*.45)active=i;});
  tabs.forEach((b,i)=>{b.style.color=i===active?'#05131A':'#05131A66';b.setAttribute('aria-current',i===active?'step':'false');});
  const progress=workflow?.children[0]?.children[1]?.lastElementChild;if(progress?.tagName==='SPAN')progress.style.width=((active+1)/3*100)+'%';
  const photo=$('[data-gap-photo]');if(photo&&!reduced){const r=$('#the-gap').getBoundingClientRect();photo.style.transform=`translateY(${Math.max(-24,Math.min(24,(innerHeight/2-r.top)*.04))}px) scale(1.12)`;}
  $$('[data-nav-id]',nav).forEach(a=>{const id=a.getAttribute('href')?.replace('#','');const s=document.getElementById(id);a.style.background=s&&s.getBoundingClientRect().top<180&&s.getBoundingClientRect().bottom>180?'#05131a05':'';a.style.borderRadius='6px';});
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();

// Functional project form, with the reference's dropdown animations.
let demoTouched=false;
const sourceSelect=$('[data-select]'),sourceMenu=$('[data-dropdown]'),folderSelect=$('[data-folder-select]'),folderMenu=$('[data-folder-dropdown]');
function closeDropdowns(){[sourceMenu,folderMenu].forEach(e=>e?.classList.remove('dropdown-open'));[sourceSelect,folderSelect].forEach(e=>e?.setAttribute('aria-expanded','false'));}
function dropdown(button,menu){if(!button||!menu)return;button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');menu.setAttribute('role','listbox');button.addEventListener('click',e=>{e.stopPropagation();demoTouched=true;const open=!menu.classList.contains('dropdown-open');closeDropdowns();menu.classList.toggle('dropdown-open',open);button.setAttribute('aria-expanded',String(open));});}
dropdown(sourceSelect,sourceMenu);dropdown(folderSelect,folderMenu);
function chooseSource(e){const val=$('[data-select-value]');val.textContent=e.textContent.trim();val.style.color='#05131a';closeDropdowns();}
$$('[data-option]').forEach(e=>{if(e.textContent.includes('Coming soon'))e.setAttribute('aria-disabled','true');e.addEventListener('click',()=>chooseSource(e));e.addEventListener('keydown',ev=>{if(ev.key==='Enter')chooseSource(e);});});
$$('[data-folder-option]').forEach(e=>{const choose=()=>{const v=$('[data-folder-value]');v.textContent=e.textContent.trim();v.style.color='#05131a';closeDropdowns();};e.addEventListener('click',choose);e.addEventListener('keydown',ev=>{if(ev.key==='Enter')choose();});});
document.addEventListener('click',e=>{if(!sourceMenu?.contains(e.target)&&!folderMenu?.contains(e.target))closeDropdowns();});
$$('[contenteditable]',workflow).forEach(e=>{e.textContent=e.textContent.trim();e.addEventListener('input',()=>demoTouched=true);});
function createProject(){if($('[data-select-value]').textContent.includes('Choose'))chooseSource($$('[data-option]')[0]);visible('[data-create-label]',false);visible('[data-create-done]',true);$('[data-create]').setAttribute('aria-label','Application preview ready');setTimeout(()=>{visible('[data-create-label]',true);visible('[data-create-done]',false);$('[data-create]').removeAttribute('aria-label');},2500);}
$('[data-create]')?.addEventListener('click',()=>{demoTouched=true;createProject();});
sequence(panels[0],[[1600,()=>{if(!demoTouched){sourceMenu.classList.add('dropdown-open');}}],[3000,()=>{if(!demoTouched)chooseSource($$('[data-option]')[0]);}],[4800,()=>{if(!demoTouched)createProject();}]],11000);

// Switch between manual resolution and Claude's animated code changes.
const fix=panels[2];let fixTouched=false;
function fixMode(claude){if(!fix)return;fix.classList.toggle('fix-claude',claude);fix.classList.toggle('fix-you',!claude);set('[data-toggle-thumb]',{transform:claude?'translateX(100%)':'translateX(0)'},fix);$('[data-toggle-you]',fix)?.setAttribute('aria-pressed',String(!claude));$('[data-toggle-claude]',fix)?.setAttribute('aria-pressed',String(claude));}
function manualResolve(){visible('[data-you-open]',false,fix);visible('[data-you-done]',true,fix);set('[data-you-done]',{display:'block'},fix);set('[data-you-resolve]',{background:'#66eec1',borderColor:'#66eec1'},fix);}
['you','claude'].forEach(mode=>{const e=$('[data-toggle-'+mode+']',fix);const choose=()=>{fixTouched=true;fixMode(mode==='claude');};e?.addEventListener('click',choose);e?.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}});});
$('[data-you-resolve]',fix)?.addEventListener('click',()=>{fixTouched=true;manualResolve();});
fixMode(false);sequence(fix,[[0,()=>{if(!fixTouched){fixMode(false);visible('[data-you-open]',true,fix);visible('[data-you-done]',false,fix);}}],[1800,()=>{if(!fixTouched)manualResolve();}],[4500,()=>{if(!fixTouched){fixMode(true);visible('[data-claude-open]',true,fix);visible('[data-claude-done]',false,fix);}}],...[0,1,2].map(i=>[5500+i*700,()=>{if(!fixTouched){const r=$$('[data-claude-row]',fix)[i];visible('[data-claude-open]',false,r);visible('[data-claude-done]',true,r);}}])],11500);

// Accessible, draggable, touch-native carousels.
function carousel(id,label){const root=$(id),swiper=$('.swiper',root),track=$('.swiper-wrapper',root);if(!track)return;swiper.classList.add('replica-carousel');const slides=$$('.swiper-slide',track),prev=$(`button[aria-label="Previous ${label}"]`,root),next=$(`button[aria-label="Next ${label}"]`,root);track.setAttribute('tabindex','0');track.setAttribute('aria-label',label+' carousel');
 const sync=()=>{prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;};const move=dir=>track.scrollBy({left:dir*(slides[0].getBoundingClientRect().width+20),behavior:reduced?'auto':'smooth'});prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',sync,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});new ResizeObserver(sync).observe(track);
 let start=null;track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&!e.target.closest('button,a,input')){start={x:e.clientX,left:track.scrollLeft};track.classList.add('dragging');track.setPointerCapture(e.pointerId);}});track.addEventListener('pointermove',e=>{if(start)track.scrollLeft=start.left+start.x-e.clientX;});const stop=()=>{start=null;track.classList.remove('dragging');};track.addEventListener('pointerup',stop);track.addEventListener('pointercancel',stop);sync();}
carousel('#who-its-for','audiences');carousel('#capabilities','capabilities');

// Cross-fade testimonials, with a progress indicator and manual navigation.
const testimonials=$('#testimonials'),quotes=$$('.swiper-slide',testimonials),dots=$$('button[aria-label^="Go to"]',testimonials);let quoteIndex=0;
function testimonial(n){quoteIndex=(n+quotes.length)%quotes.length;quotes.forEach((q,i)=>{q.classList.toggle('is-active',i===quoteIndex);q.setAttribute('aria-hidden',String(i!==quoteIndex));q.inert=i!==quoteIndex;});dots.forEach((d,i)=>{d.classList.toggle('is-active',i===quoteIndex);d.setAttribute('aria-pressed',String(i===quoteIndex));});}
dots.forEach((d,i)=>d.addEventListener('click',()=>testimonial(i)));$('button[aria-label="Previous purpose"]',testimonials)?.addEventListener('click',()=>testimonial(quoteIndex-1));$('button[aria-label="Next purpose"]',testimonials)?.addEventListener('click',()=>testimonial(quoteIndex+1));testimonial(0);sequence(testimonials,[[8000,()=>testimonial(quoteIndex+1)]],8001);

// Membership options / application journey control.
const pricing=$('#pricing'),billing=$$('button',pricing).slice(0,2);
function membershipView(i){billing.forEach((x,j)=>{x.setAttribute('aria-pressed',String(i===j));x.style.color=i===j?'#05131a':'#ffffff99';});const b=billing[i],thumb=billing[0].parentElement.firstElementChild;thumb.style.width=b.getBoundingClientRect().width+'px';thumb.style.transform=`translateX(${b.offsetLeft}px)`;thumb.style.transition='transform .3s,width .3s';$$('[data-plan-card]',pricing).forEach(card=>{$('.tpa-plan-front',card).hidden=Boolean(i);$('.tpa-plan-back',card).hidden=!i;animate(card,[{opacity:.65,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:350});});}
billing.forEach((b,i)=>b.addEventListener('click',()=>membershipView(i)));requestAnimationFrame(()=>membershipView(0));
new ResizeObserver(()=>{const active=billing.findIndex(b=>b.getAttribute('aria-pressed')==='true'),b=billing[Math.max(0,active)],thumb=b.parentElement.firstElementChild;thumb.style.width=b.getBoundingClientRect().width+'px';thumb.style.transform=`translateX(${b.offsetLeft}px)`;}).observe(billing[0].parentElement);

// Single-open FAQ accordion, matching the plus-to-close animation.
const faqButtons=$$('#faq button[aria-expanded]');
function faqToggle(button,open){button.setAttribute('aria-expanded',String(open));const answer=button.nextElementSibling;answer.classList.add('faq-answer');answer.style.height=open?answer.scrollHeight+'px':'0px';answer.style.opacity=open?'1':'0';}
faqButtons.forEach((b,i)=>{const answer=b.nextElementSibling;answer.id='faq-answer-'+i;b.setAttribute('aria-controls',answer.id);faqToggle(b,i===0);b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';faqButtons.forEach(x=>faqToggle(x,x===b&&open));});});
addEventListener('resize',()=>faqButtons.forEach(b=>{if(b.getAttribute('aria-expanded')==='true')b.nextElementSibling.style.height=b.nextElementSibling.scrollHeight+'px';}));

// Cookie settings persist only in this replica's browser storage.
const banner=$('#cookie-banner'),overlay=$('#cookie-overlay');let lastFocus=null;
function preferences(){lastFocus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';$('button[aria-label="Close cookie preferences"]',overlay).focus();}
function closePreferences(){if(!overlay||overlay.hidden)return;overlay.hidden=true;document.body.style.overflow='';lastFocus?.focus();}
function saveConsent(value){try{localStorage.setItem('tpa-theme-consent',JSON.stringify(value));}catch{}banner.hidden=true;closePreferences();}
try{banner.hidden=!!localStorage.getItem('tpa-theme-consent');}catch{}
$$('[data-consent]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.consent==='manage')preferences();else saveConsent({analytics:b.dataset.consent==='all',marketing:b.dataset.consent==='all'});}));
$$('footer button').find(b=>b.textContent.trim()==='Cookies')?.addEventListener('click',preferences);
$('button[aria-label="Close cookie preferences"]',overlay)?.addEventListener('click',closePreferences);
$$('[role=switch]:not(:disabled)',overlay).forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'))));
$$('button',overlay).find(b=>b.textContent==='Save preferences')?.addEventListener('click',()=>saveConsent(Object.fromEntries($$('[role=switch]',overlay).map(b=>[b.getAttribute('aria-label').toLowerCase(),b.getAttribute('aria-checked')==='true']))));
$$('button',overlay).find(b=>b.textContent==='Accept all')?.addEventListener('click',()=>saveConsent({analytics:true,marketing:true}));
overlay.addEventListener('click',e=>{if(e.target===overlay.firstElementChild)closePreferences();});
overlay.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=$$('button:not(:disabled),a',overlay),first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});

// Small animated comparison panel and collaborator cursors.
$$('[data-compare-visual]').forEach(root=>{
  if(!reduced)root.classList.add('compare-running');
  const divider=$('[data-compare-divider]',root),clip=$('[data-compare-clip]',root);if(!divider||!clip)return;
  let value=52,dragging=false;
  const apply=n=>{value=Math.max(0,Math.min(100,n));root.dataset.manual='true';divider.style.left=value+'%';clip.style.clipPath=`inset(0 ${100-value}% 0 0)`;divider.setAttribute('aria-valuenow',String(Math.round(value)));};
  divider.addEventListener('pointerdown',e=>{e.stopPropagation();dragging=true;divider.setPointerCapture(e.pointerId);});
  divider.addEventListener('pointermove',e=>{if(dragging){const rect=root.getBoundingClientRect();apply((e.clientX-rect.left)/rect.width*100);}});
  divider.addEventListener('pointerup',()=>dragging=false);divider.addEventListener('pointercancel',()=>dragging=false);
  divider.addEventListener('keydown',e=>{const keys={ArrowLeft:value-5,ArrowRight:value+5,Home:0,End:100};if(e.key in keys){e.preventDefault();apply(keys[e.key]);}});
});
$$('[data-cursor-marker]').forEach(e=>{e.addEventListener('mouseenter',()=>visible('[data-note]',true,e));e.addEventListener('mouseleave',()=>visible('[data-note]',false,e));});
if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}
