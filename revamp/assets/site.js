// Progressive enhancement: all content remains available without JavaScript.
const sceneControls=[...document.querySelectorAll('[data-scene]')];
const scenePanels=[...document.querySelectorAll('[data-scene-panel]')];
function selectScene(name){sceneControls.forEach(control=>control.setAttribute('aria-current',String(control.dataset.scene===name)));scenePanels.forEach(panel=>{const active=panel.dataset.scenePanel===name;panel.hidden=!active;panel.classList.toggle('is-entering',active);});}
if(scenePanels.length){selectScene('daily');sceneControls.forEach(control=>control.addEventListener('click',event=>{event.preventDefault();selectScene(control.dataset.scene);}));}
const composition=document.querySelector('.screen-composition');
const calm=matchMedia('(prefers-reduced-motion: reduce)');
if(composition){let pending=false;function settleStage(){pending=false;if(calm.matches||innerWidth<700){composition.style.removeProperty('transform');return;}const progress=Math.max(0,Math.min(1,scrollY/650));composition.style.transform=`translateY(${-progress*22}px) rotateX(${7-progress*7}deg) rotateY(${-4+progress*4}deg)`;}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(settleStage);}},{passive:true});addEventListener('resize',settleStage);calm.addEventListener('change',settleStage);settleStage();}
const views=[...document.querySelectorAll('.explorer-view')];
const controls=[...document.querySelectorAll('[data-view]')];
function showView(id){views.forEach(view=>view.hidden=view.id!==id);controls.forEach(control=>control.setAttribute('aria-current',String(control.dataset.view===id)));}
if(views.length){showView('monthly');controls.forEach(control=>control.addEventListener('click',event=>{event.preventDefault();showView(control.dataset.view);}));}
const search=document.querySelector('#article-search');
document.querySelectorAll('[data-copy-account]').forEach(button=>{
 button.hidden=false;
 button.addEventListener('click',async()=>{
  const status=document.querySelector('.copy-status');
  try{await navigator.clipboard.writeText(button.dataset.copyAccount);button.textContent='Copied';status.textContent='Account number copied.';setTimeout(()=>button.textContent='Copy',2500);}
  catch{const range=document.createRange();range.selectNodeContents(document.getElementById(button.dataset.copyTarget));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy the highlighted account number.';}
 });
});
function revealSupport(){if(location.hash==='#support'){const support=document.querySelector('#support');if(support){support.open=true;support.scrollIntoView({block:'center'});}}}
addEventListener('hashchange',revealSupport);revealSupport();
if(search){search.addEventListener('input',()=>{let count=0;document.querySelectorAll('[data-article]').forEach(article=>{const match=article.dataset.search.includes(search.value.toLowerCase());article.hidden=!match;if(match)count++;});document.querySelector('#article-count').textContent=`${count} articles`;document.querySelector('#no-results').hidden=count>0;});}
const heroStage=document.querySelector('.screen-stage');
if(heroStage){let frame=0;function resetDepth(){cancelAnimationFrame(frame);for(const layer of ['main','budget','note'])for(const axis of ['x','y','rx','ry'])heroStage.style.removeProperty('--'+layer+'-'+axis);}window.addEventListener('pointermove',event=>{if(calm.matches||event.pointerType==='touch'||innerWidth<700){resetDepth();return;}cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const x=event.clientX/innerWidth-.5,y=event.clientY/innerHeight-.5;for(const [layer,speed,tilt] of [['main',10,4],['budget',24,8],['note',36,11]]){heroStage.style.setProperty('--'+layer+'-x',x*speed+'px');heroStage.style.setProperty('--'+layer+'-y',y*speed+'px');heroStage.style.setProperty('--'+layer+'-rx',-y*tilt+'deg');heroStage.style.setProperty('--'+layer+'-ry',x*tilt+'deg');}});},{passive:true});document.documentElement.addEventListener('pointerleave',resetDepth);window.addEventListener('blur',resetDepth);calm.addEventListener('change',resetDepth);}
const motionSection=document.querySelector('.main-feature-section'),motionToggle=document.querySelector('.motion-toggle');
if(motionSection&&motionToggle){motionToggle.hidden=false;motionToggle.addEventListener('click',()=>{const paused=motionSection.classList.toggle('is-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.textContent=paused?'Resume moving cards':'Pause moving cards';});document.addEventListener('visibilitychange',()=>{motionSection.classList.toggle('tab-hidden',document.hidden);});}
