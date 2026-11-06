// Use the existing Kaasi property only on the public website.
if (['kaasi.com.lk','www.kaasi.com.lk'].includes(location.hostname)) {
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments);};
 gtag('js',new Date());
 gtag('config','G-2FSRSWZB28');
 const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id=G-2FSRSWZB28';document.head.append(tag);
 // Send fixed action names, never account numbers, article text or form values.
 document.addEventListener('click',event=>{
  const el=event.target.closest('button,a');if(!el)return;
  let action;
  if(el.matches('[data-scene]'))action='highlight_'+el.dataset.scene;
  else if(el.matches('.scene-mobile-nav button'))action='highlight_navigation';
  else if(el.matches('.motion-toggle'))action='feature_motion_toggle';
  else if(el.matches('[data-copy-account]'))action='donation_copy';
  else if(el.matches('[data-copy-article]'))action='article_copy';
  else if(el.matches('.article-sharing a'))action='article_share';
  else if(el.matches('.menu-toggle'))action='menu_toggle';
  else if(el.matches('.primary,.launch'))action='launch_app';
  if(action)gtag('event',action,{event_category:'site_interaction'});
 });
}
