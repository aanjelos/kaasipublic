const fs=require('node:fs');
const path=require('node:path');
const matter=require('gray-matter');
const md=require('markdown-it')({html:true});
module.exports=function(config){
 config.addPassthroughCopy({'revamp/assets':'assets','img':'img','blog/img':'blog/img'});
 config.ignores.add('revamp/README.md');
 config.addGlobalData('posts',()=>fs.readdirSync('blog').filter(n=>n.endsWith('.md')).map(name=>{const raw=fs.readFileSync(path.join('blog',name),'utf8');const {data,content}=matter(raw);let count=0;const headings=[];const html=md.render(content).replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,(_,level,attrs,title)=>{const id=`section-${++count}`;headings.push({id,title:title.replace(/<[^>]+>/g,''),level});return `<h${level}${attrs.replace(/\s+id="[^"]*"/g,'')} id="${id}">${title}</h${level}>`;});return {...data,slug:name.slice(0,-3),url:`/blog/${name.slice(0,-3)}/`,date:new Date(data.date),html,headings,minutes:Math.max(1,Math.ceil(html.replace(/<[^>]+>/g,' ').split(/\s+/).length/220))};}).sort((a,b)=>b.date-a.date));
 config.addFilter('readableDate',date=>new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}));
 config.addFilter('isoDate',date=>new Date(date).toISOString());
 config.addFilter('take',(items,n)=>items.slice(0,n));
 config.addFilter('related',(posts,slug)=>posts.filter(p=>p.slug!==slug).slice(0,3));
 return {dir:{input:'revamp',output:'_revamp',includes:'_includes'},templateFormats:['njk'],htmlTemplateEngine:'njk'};
};
