// Progressive enhancement: all content remains available without JavaScript.
const calm=matchMedia('(prefers-reduced-motion: reduce)');
const motionEase='cubic-bezier(0.23,1,0.32,1)';
const activeMotion=new Map();
function cancelMotion(el){const animation=activeMotion.get(el);if(animation){animation.cancel();activeMotion.delete(el);}}
function animateMotion(el,frames,duration){
 cancelMotion(el);if(!el.animate)return null;
 const animation=el.animate(frames,{duration,easing:motionEase});activeMotion.set(el,animation);
 const forget=()=>{if(activeMotion.get(el)===animation)activeMotion.delete(el);};
 animation.finished.then(forget,forget);return animation;
}
calm.addEventListener('change',()=>{for(const [el] of activeMotion)cancelMotion(el);});
const sceneControls=[...document.querySelectorAll('[data-scene]')];
const scenePanels=[...document.querySelectorAll('[data-scene-panel]')];
let sceneInputOrigin=null;
const sceneOpacity=new WeakMap();
function selectScene(name,origin='auto'){
 const incoming=scenePanels.find(panel=>panel.dataset.scenePanel===name);if(!incoming)return;
 const unchanged=!incoming.hidden&&incoming.classList.contains('scene-selected');
 sceneControls.forEach(control=>control.setAttribute('aria-current',String(control.dataset.scene===name)));
 scenePanels.forEach(panel=>{
  if(activeMotion.has(panel))sceneOpacity.set(panel,parseFloat(getComputedStyle(panel).opacity));
  cancelMotion(panel);panel.classList.remove('is-entering');panel.classList.toggle('scene-selected',panel===incoming);panel.hidden=panel!==incoming;
 });
 if(origin==='keyboard'||origin==='initial')sceneOpacity.delete(incoming);
 if(origin!=='keyboard'&&origin!=='initial'&&!unchanged){
  const from=sceneOpacity.has(incoming)?sceneOpacity.get(incoming):0;
  const animation=animateMotion(incoming,[{opacity:from},{opacity:1}],calm.matches?80:200);
  if(animation)animation.finished.then(()=>sceneOpacity.delete(incoming),()=>{});
 }
}
if(scenePanels.length){selectScene('daily','initial');sceneControls.forEach(control=>control.addEventListener('click',event=>{event.preventDefault();selectScene(control.dataset.scene,sceneInputOrigin||(event.detail===0?'keyboard':'pointer'));}));}
const composition=document.querySelector('.screen-composition');
if(composition){let pending=false;function settleStage(){pending=false;if(calm.matches||innerWidth<700){composition.style.removeProperty('transform');return;}const progress=Math.max(0,Math.min(1,scrollY/650));composition.style.transform=`translateY(${-progress*22}px) rotateX(${7-progress*7}deg) rotateY(${-4+progress*4}deg)`;}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(settleStage);}},{passive:true});addEventListener('resize',settleStage);calm.addEventListener('change',settleStage);settleStage();}
const views=[...document.querySelectorAll('.explorer-view')];
const controls=[...document.querySelectorAll('[data-view]')];
function showView(id){views.forEach(view=>view.hidden=view.id!==id);controls.forEach(control=>control.setAttribute('aria-current',String(control.dataset.view===id)));}
if(views.length){showView('monthly');controls.forEach(control=>control.addEventListener('click',event=>{event.preventDefault();showView(control.dataset.view);}));}
const search=document.querySelector('#article-search');
document.querySelectorAll('[data-copy-account]').forEach(button=>{
 button.hidden=false;let resetTimer=null,request=0;
 const idleLabel=button.getAttribute('aria-label'),idleIcon=button.innerHTML;
 function showIcon(html,origin){const old=button.firstElementChild;const from=old&&button.innerHTML===html?parseFloat(getComputedStyle(old).opacity):0;if(old)cancelMotion(old);button.innerHTML=html;const icon=button.firstElementChild;if(icon&&origin!=='keyboard'&&from<1)animateMotion(icon,[{opacity:from},{opacity:1}],calm.matches?80:120);}
 button.addEventListener('click',async event=>{
  const id=++request,origin=event.detail===0?'keyboard':'pointer';clearTimeout(resetTimer);
  try{await navigator.clipboard.writeText(button.dataset.copyAccount);if(id!==request)return;
   button.setAttribute('aria-label','Account number copied');showIcon('<i class="fas fa-check" aria-hidden="true"></i>',origin);
   resetTimer=setTimeout(()=>{if(id===request){showIcon(idleIcon,origin);button.setAttribute('aria-label',idleLabel);}},2500);
  }catch{if(id!==request)return;const range=document.createRange();range.selectNodeContents(document.getElementById(button.dataset.copyTarget));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);button.setAttribute('aria-label','Copy the highlighted account number');}
 });
});
function revealSupport(){if(location.hash==='#support'){const support=document.querySelector('#support');if(support){support.open=true;support.scrollIntoView({block:'center',behavior:calm.matches?'instant':'smooth'});}}}
addEventListener('hashchange',revealSupport);revealSupport();
if(search){search.addEventListener('input',()=>{let count=0;document.querySelectorAll('[data-article]').forEach(article=>{const match=article.dataset.search.includes(search.value.toLowerCase());article.hidden=!match;if(match)count++;});document.querySelector('#article-count').textContent=`${count} articles`;document.querySelector('#no-results').hidden=count>0;});}
const heroStage=document.querySelector('.screen-stage');
if(heroStage){
 const layers={main:heroStage.querySelector('.main-screen'),budget:heroStage.querySelector('.budget-float'),note:heroStage.querySelector('.offline-note')};
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');let frame=0,width=innerWidth,height=innerHeight,pointer=null;
 function clearDepth(){for(const layer of Object.values(layers))layer?.style.removeProperty('transform');}
 function paintDepth(){frame=0;if(calm.matches){clearDepth();return;}
  if(width<=700){const p=Math.min(1,Math.max(0,scrollY/650));
   layers.main.style.transform='perspective(900px) translateY('+(-14*p)+'px) rotateX('+(4*p)+'deg) rotateY('+(-2*p)+'deg)';
   layers.budget.style.transform='perspective(700px) translateY('+(-48*p)+'px) rotateX('+(7*p)+'deg) rotate(5deg)';
   layers.note.style.transform='perspective(700px) translateY('+(18*p)+'px) rotateY('+(5*p)+'deg) rotate(-2deg)';
  }else if(pointer&&finePointer.matches){const {x,y}=pointer;
   for(const [name,speed,tilt,depth,rotation]of [['main',10,4,20,0],['budget',24,8,70,5],['note',36,11,100,-3]]){
    layers[name].style.transform='translate3d('+(x*speed)+'px,'+(y*speed)+'px,'+depth+'px) rotateX('+(-y*tilt)+'deg) rotateY('+(x*tilt)+'deg)'+(rotation?' rotate('+rotation+'deg)':'');
   }
  }else clearDepth();
 }
 function queueDepth(){if(!frame)frame=requestAnimationFrame(paintDepth);}
 window.addEventListener('pointermove',event=>{if(calm.matches||event.pointerType==='touch'||width<=700||!finePointer.matches)return;pointer={x:event.clientX/width-.5,y:event.clientY/height-.5};queueDepth();},{passive:true});
 addEventListener('scroll',()=>{if(width<=700)queueDepth();},{passive:true});
 function resetDepth(){cancelAnimationFrame(frame);frame=0;clearDepth();pointer=null;width=innerWidth;height=innerHeight;queueDepth();}
 addEventListener('resize',resetDepth);calm.addEventListener('change',resetDepth);finePointer.addEventListener('change',resetDepth);paintDepth();
}
const motionSection=document.querySelector('.main-feature-section'),motionToggle=document.querySelector('.motion-toggle');
if(motionSection&&motionToggle){motionToggle.hidden=false;motionToggle.addEventListener('click',()=>{const paused=motionSection.classList.toggle('is-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.innerHTML=paused?'<i class="fas fa-play" aria-hidden="true"></i>':'<i class="fas fa-pause" aria-hidden="true"></i>';motionToggle.setAttribute('aria-label',paused?'Resume moving cards':'Pause moving cards');motionToggle.title=paused?'Resume moving cards':'Pause moving cards';});document.addEventListener('visibilitychange',()=>{motionSection.classList.toggle('tab-hidden',document.hidden);});}
// One shared offset drives both automatic movement and dragging, wrapped to a full group.
const marqueeRows=[...document.querySelectorAll('.moving-window')].map((el,index)=>{const track=el.querySelector('.moving-track');track.style.animation='none';return {el,track,group:el.querySelector('.moving-group'),index,x:0,drag:null,hover:false,width:0};});
for(const row of marqueeRows){
 row.el.classList.add('touch-draggable');
 row.el.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')row.hover=true;});
 row.el.addEventListener('pointerleave',()=>row.hover=false);
 row.el.addEventListener('pointerdown',event=>{
  if(event.button!==0||calm.matches)return;
  const touch=event.pointerType==='touch';
  row.drag={clientX:event.clientX,clientY:event.clientY,x:row.x,pointerId:event.pointerId,active:!touch};
  if(!touch){row.el.setPointerCapture(event.pointerId);row.el.classList.add('is-dragging');event.preventDefault();}
 });
 row.el.addEventListener('pointermove',event=>{
  const drag=row.drag;if(!drag||drag.pointerId!==event.pointerId)return;
  const dx=event.clientX-drag.clientX,dy=event.clientY-drag.clientY;
  if(!drag.active){
   if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
   if(Math.abs(dy)>=Math.abs(dx)){row.drag=null;return;}
   drag.active=true;row.el.setPointerCapture(event.pointerId);row.el.classList.add('is-dragging');
  }
  row.x=drag.x+dx;paintRow(row);
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])row.el.addEventListener(event,()=>{row.drag=null;row.hover=false;row.el.classList.remove('is-dragging');});
}
function paintRow(row){const width=row.width;if(!width||calm.matches){row.track.style.transform='';return;}const x=((row.x%width)+width)%width-width;row.track.style.transform='translateX('+x+'px)';}
if(marqueeRows.length){
 let marqueeInView=false;
 new IntersectionObserver(entries=>{marqueeInView=entries[0].isIntersecting;motionSection.classList.toggle('motion-offscreen',!marqueeInView);},{rootMargin:'100px'}).observe(motionSection);
 function measureRows(){for(const row of marqueeRows)row.width=row.group.getBoundingClientRect().width+parseFloat(getComputedStyle(row.track).columnGap||0);}
 new ResizeObserver(measureRows).observe(motionSection);document.fonts.ready.then(measureRows);measureRows();
 let marqueeTime=performance.now();function tickMarquees(now){const dt=Math.min(64,now-marqueeTime);marqueeTime=now;
 if(marqueeInView&&!document.hidden&&!calm.matches){for(const row of marqueeRows){if(!row.drag&&!row.hover&&!motionSection.classList.contains('is-paused'))row.x+=(row.index===1?1:-1)*dt*(innerWidth<=700?row.width/[65000,75000,80000][row.index]:.025);paintRow(row);}}
 requestAnimationFrame(tickMarquees);}
 calm.addEventListener('change',()=>{if(calm.matches)marqueeRows.forEach(row=>row.track.style.transform='');});
 matchMedia('(max-width:700px)').addEventListener('change',()=>{measureRows();marqueeRows.forEach(paintRow);});requestAnimationFrame(tickMarquees);
}
const privacyArt=document.querySelector('#privacy-animation');
if(privacyArt){let anim=null,inView=false,delay=null,loading=false;function clearLoop(){clearTimeout(delay);delay=null;}function restart(){clearLoop();if(anim&&inView&&!document.hidden&&!calm.matches)anim.goToAndPlay(0,true);}function syncPrivacy(){clearLoop();if(!anim)return;if(calm.matches){anim.goToAndStop(45,true);return;}if(!inView||document.hidden){anim.pause();return;}if(anim.currentFrame>=anim.totalFrames-1){delay=setTimeout(restart,2000);}else anim.play();}
async function loadPrivacy(){if(loading||anim)return;loading=true;try{const data=await fetch('/assets/animations/privacy.json').then(r=>{if(!r.ok)throw Error('Animation unavailable');return r.json();});if(!window.lottie)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/assets/vendor/lottie-light.min.js';script.onload=resolve;script.onerror=reject;document.head.appendChild(script);});privacyArt.replaceChildren();anim=window.lottie.loadAnimation({container:privacyArt,renderer:'svg',loop:false,autoplay:false,animationData:data});anim.setSpeed(.65);anim.addEventListener('DOMLoaded',syncPrivacy);anim.addEventListener('complete',()=>{clearLoop();if(inView&&!document.hidden&&!calm.matches)delay=setTimeout(restart,2000);});}catch{loading=false;}}
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)loadPrivacy();syncPrivacy();},{threshold:.15}).observe(privacyArt);calm.addEventListener('change',syncPrivacy);document.addEventListener('visibilitychange',syncPrivacy);}

// Reveal only below-the-fold elements; visible content and no-script layouts stay intact.
if ('IntersectionObserver' in window) {
 const targets = [...document.querySelectorAll('.main-feature-section .section-head, .ownership-spread > div, .main-upcoming .section-head, .upcoming-grid > article, .maker-note > div, .donate-section .container > div, .closing-layout > div')];
 let observer;
 function updateReveals() {
  observer?.disconnect();
  targets.forEach(el => el.classList.remove('scroll-reveal-pending'));
  if (calm.matches) return;
  observer = new IntersectionObserver(entries => {
   entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('scroll-reveal-pending'); observer.unobserve(entry.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -10% 0px' });
  targets.forEach(el => { if(el.getBoundingClientRect().top > innerHeight) { el.classList.add('scroll-reveal-pending'); observer.observe(el); } });
 }
 updateReveals();
 calm.addEventListener('change', updateReveals);
}

// Read at your own pace: manual selection holds for 20 seconds before cycling resumes.
const sceneSection=document.querySelector('.first-feature');
const scenePlayback=document.querySelector('.scene-playback');
if(sceneSection&&scenePlayback&&sceneControls.length){
 const bar=scenePlayback.querySelector('.scene-timer span');
 let elapsed=0,holdUntil=0,visible=false,started=false,last=performance.now();
 scenePlayback.hidden=false;
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0}).observe(sceneSection);
 const arrival=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){started=true;elapsed=0;last=performance.now();arrival.disconnect();}},{threshold:.8,rootMargin:'0px 0px -12% 0px'});
 arrival.observe(sceneSection.querySelector('.first-feature-head'));
 sceneControls.forEach(control=>control.addEventListener('click',()=>{elapsed=0;holdUntil=performance.now()+20000;bar.style.transform='scaleX(0)';}));
 function cycle(now){const dt=Math.min(now-last,100);last=now;
  if(started&&visible&&!calm.matches&&!document.hidden&&now>=holdUntil&&!sceneSection.querySelector('.feature-step:focus-visible')){
   elapsed+=dt;
   if(elapsed>=5000){const current=sceneControls.findIndex(control=>control.getAttribute('aria-current')==='true');selectScene(sceneControls[(current+1)%sceneControls.length].dataset.scene);elapsed=0;}
  }
  bar.style.transform='scaleX('+elapsed/5000+')';requestAnimationFrame(cycle);
 }
 calm.addEventListener('change',()=>{elapsed=0;});requestAnimationFrame(cycle);
}

// Phone navigation and a single product highlight at a time.
const menuToggle=document.querySelector('.menu-toggle'),mast=document.querySelector('.mast');
if(menuToggle){
 const menu=mast.querySelector('nav');mast.classList.add('menu-ready');menuToggle.hidden=false;
 function closeMenu(){cancelMotion(menu);mast.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open menu');}
 menuToggle.addEventListener('click',event=>{
  mast.classList.toggle('menu-keyboard',event.detail===0);
  if(mast.classList.contains('menu-open')){closeMenu();return;}
  cancelMotion(menu);mast.classList.add('menu-open');menuToggle.setAttribute('aria-expanded','true');menuToggle.setAttribute('aria-label','Close menu');
  if(event.detail!==0&&innerWidth<=700)animateMotion(menu,calm.matches?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],calm.matches?80:180);
 });
 matchMedia('(min-width:701px)').addEventListener('change',closeMenu);
 document.addEventListener('click',event=>{if(!mast.contains(event.target))closeMenu();});
 mast.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mast.classList.contains('menu-open')){mast.classList.add('menu-keyboard');closeMenu();menuToggle.focus();}});
}
if(sceneSection){
 sceneSection.classList.add('mobile-carousel');
 const navigation=document.createElement('div');navigation.className='scene-mobile-nav';navigation.innerHTML='<button type="button" aria-label="Previous highlight"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><span class="scene-position" aria-live="off">1 / 6</span><button type="button" aria-label="Next highlight"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>';
 sceneSection.querySelector('.feature-theatre').append(navigation);
 const position=navigation.querySelector('span');function current(){return sceneControls.findIndex(c=>c.getAttribute('aria-current')==='true');}
 function advance(delta,origin='pointer'){sceneInputOrigin=origin;try{sceneControls[(current()+delta+sceneControls.length)%sceneControls.length].click();}finally{sceneInputOrigin=null;}}
 navigation.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();advance(event.key==='ArrowLeft'?-1:1,'keyboard');}});
 navigation.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',event=>advance(i===0?-1:1,event.detail===0?'keyboard':'pointer')));
 new MutationObserver(()=>{position.textContent=(current()+1)+' / '+sceneControls.length;}).observe(sceneSection.querySelector('.feature-controls'),{attributes:true,subtree:true,attributeFilter:['aria-current']});
 let touch=null;const surface=sceneSection.querySelector('.feature-scenes');surface.addEventListener('touchstart',e=>{touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});surface.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)advance(dx<0?1:-1);touch=null;},{passive:true});
}

const blogStrip=document.querySelector('.journal-band .article-grid');
if(blogStrip){const hint=document.createElement('p');hint.className='blog-swipe-hint';hint.innerHTML='<span>Swipe to browse</span><span aria-hidden="true">1 / 6</span>';blogStrip.before(hint);blogStrip.addEventListener('scroll',()=>{const step=blogStrip.firstElementChild.getBoundingClientRect().width+20;hint.lastElementChild.textContent=(blogStrip.scrollLeft+blogStrip.clientWidth>=blogStrip.scrollWidth-2?blogStrip.children.length:Math.min(blogStrip.children.length,Math.round(blogStrip.scrollLeft/step)+1))+' / '+blogStrip.children.length;},{passive:true});}

const copyArticle=document.querySelector('[data-copy-article]');
if(copyArticle){copyArticle.hidden=false;copyArticle.addEventListener('click',async()=>{const url=location.href.split('#')[0];const status=document.querySelector('.share-status');try{await navigator.clipboard.writeText(url);status.textContent='Link copied';setTimeout(()=>status.textContent='',2500);}catch{status.textContent='Copy this link: '+url;}});}

// Retain native details semantics; pointer changes bridge the layout with FLIP.
const faqItems=[...document.querySelectorAll('#faq details')];
if(faqItems.length){
 const faq=document.querySelector('#faq');
 const moving=[...faqItems,...document.querySelectorAll('#faq ~ *,body > .site-footer')];
 const faqAnimations=new Map();let movingTimer=null;
 function stopFaq(){clearTimeout(movingTimer);for(const [element,animation]of faqAnimations){if(activeMotion.get(element)===animation)cancelMotion(element);else animation.cancel();}faqAnimations.clear();document.body.classList.remove('faq-motion-active');}
 function animateFaq(element,frames,duration){const animation=animateMotion(element,frames,duration);if(animation){faqAnimations.set(element,animation);const forget=()=>{if(faqAnimations.get(element)===animation)faqAnimations.delete(element);};animation.finished.then(forget,forget);}}
 faqItems.forEach(item=>{
  item.querySelector('summary').addEventListener('click',event=>{
   const keyboard=event.detail===0;faq.classList.toggle('faq-keyboard',keyboard);
   if(keyboard){stopFaq();return;}
   event.preventDefault();const before=new Map(moving.map(element=>[element,element.getBoundingClientRect().top]));
   stopFaq();document.body.classList.add('faq-motion-active');const opening=!item.open;
   faqItems.forEach(other=>{other.open=other===item&&opening;});
   if(!calm.matches)for(const element of moving){const dy=before.get(element)-element.getBoundingClientRect().top;if(Math.abs(dy)>.5)animateFaq(element,[{transform:'translateY('+dy+'px)'},{transform:'translateY(0)'}],200);}
   if(opening){const answer=item.querySelector('p');if(answer)animateFaq(answer,[{opacity:0},{opacity:1}],calm.matches?80:200);}
   movingTimer=setTimeout(()=>document.body.classList.remove('faq-motion-active'),calm.matches?80:200);
  });
  item.addEventListener('toggle',()=>{if(item.open)faqItems.forEach(other=>{if(other!==item)other.open=false;});});
 });
 faq.addEventListener('keydown',stopFaq);calm.addEventListener('change',stopFaq);
}

// Pointer-only feedback; keyboard activation never scales these controls.
const pressSelector='.scene-mobile-nav button,.journal-band .section-head>a';
const pressed=new Map();
function releasePress(id){const element=pressed.get(id);if(element){element.classList.remove('is-pointer-pressed');pressed.delete(id);}}
document.addEventListener('pointerdown',event=>{if(event.button!==0)return;const element=event.target.closest(pressSelector);if(!element)return;if(calm.matches){animateMotion(element,[{opacity:.85},{opacity:1}],80);return;}pressed.set(event.pointerId,element);element.classList.add('is-pointer-pressed');});
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)for(const id of pressed.keys())releasePress(id);});
for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,event=>releasePress(event.pointerId));
document.addEventListener('scroll',()=>{for(const id of pressed.keys())releasePress(id);},true);
addEventListener('blur',()=>{for(const id of pressed.keys())releasePress(id);});
calm.addEventListener('change',()=>{for(const id of pressed.keys())releasePress(id);});

document.addEventListener('keydown',()=>{for(const id of pressed.keys())releasePress(id);document.querySelectorAll(pressSelector).forEach(cancelMotion);const menu=document.querySelector('#main-navigation');if(menu)cancelMotion(menu);});
