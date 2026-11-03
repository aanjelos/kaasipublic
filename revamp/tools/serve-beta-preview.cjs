// Read-only beta source, a separate localhost origin, and entirely fictional records.
// No account, analytics, cloud SDK, or service-worker registration is loaded.
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=path.resolve(__dirname,'../../../kaasibeta');
const context={window:{addEventListener(){},supabase:{createClient:()=>null}},console:{log(){},error(){}}};
const fixture=JSON.parse(vm.runInNewContext(fs.readFileSync(path.join(root,'js/globals.js'),'utf8')+'\nJSON.stringify(getDefaultState())',context));
Object.assign(fixture.settings,{initialSetupDone:true,backupReminderFrequency:'off',budgetReminderHandledMonth:'2026-10',hideDebts:false,hideInstallments:false});
fixture.accounts[0].balance=8450; fixture.accounts[1].balance=94200; fixture.accounts[2].balance=37500; fixture.accounts[3].hidden=true;
const entries=[
 ['2026-10-01','income',145000,'Salary','Income','bank_1'],
 ['2026-10-02','expense',750,'Coffee and a sandwich','Food & Dining','cash'],
 ['2026-10-03','expense',1650,'Train and tuk-tuk fares','Transportation','cash'],
 ['2026-10-04','expense',28000,'October rent','Housing & Utilities','bank_1'],
 ['2026-10-05','expense',2400,'Pharmacy','Healthcare','cash'],
 ['2026-10-06','expense',1850,'Haircut and essentials','Personal Care','cash'],
 ['2026-10-07','expense',3200,'Online course','Education','bank_2'],
 ['2026-10-08','expense',9450,'Weekly groceries','Groceries','bank_1'],
 ['2026-10-10','expense',1800,'Movie night','Entertainment','bank_1'],
 ['2026-10-11','expense',299,'Music subscription','Subscriptions & Memberships','bank_2'],
 ['2026-10-12','expense',3200,'Dinner with friends','Food & Dining','cash'],
 ['2026-10-13','expense',1400,'Bus fares and parking','Transportation','cash'],
 ['2026-10-14','expense',650,'Mobile top-up','Phone & Internet','bank_2'],
 ['2026-10-15','expense',4200,'A new pair of shoes','Shopping','bank_1'],
 ['2026-10-16','expense',2500,'Birthday gift','Gifts & Donations','bank_1'],
 ['2026-10-17','expense',1300,'Lunch at work','Food & Dining','cash'],
 ['2026-10-18','expense',4900,'Fuel','Transportation','bank_1'],
 ['2026-10-19','expense',25,'Transfer fee','Bank Charges','bank_1'],
 ['2026-10-20','expense',1250,'Books and stationery','Education','cash'],
 ['2026-10-21','expense',6500,'Internet bill','Phone & Internet','bank_2'],
 ['2026-10-22','expense',3100,'Electricity bill','Housing & Utilities','bank_1'],
 ['2026-10-23','expense',1500,'Doctor visit','Healthcare','cash'],
 ['2026-10-24','expense',2200,'Weekend outing','Entertainment','bank_1'],
 ['2026-10-25','expense',2250,'Weekend coffee and lunch','Food & Dining','cash'],
 ['2026-10-26','expense',975,'Household supplies','Shopping','cash'],
 ['2026-10-27','expense',1000,'Community fundraiser','Gifts & Donations','bank_2'],
 ['2026-10-28','expense',8100,'Supermarket','Groceries','bank_1'],
 ['2026-10-30','income',18000,'Freelance project','Income','bank_2'],
 ['2026-10-29','expense',5200,'Weekly groceries','Groceries','bank_1'],
 ['2026-10-30','expense',1800,'Lunch with friends','Food & Dining','cash'],
 ['2026-10-30','expense',4500,'Fuel','Transportation','bank_1'],
 ['2026-10-31','expense',950,'Morning coffee','Food & Dining','cash'],
 ['2026-10-31','expense',2650,'Fruit and vegetables','Groceries','cash']
];
fixture.transactions=entries.map(([date,type,amount,description,category,account],i)=>({id:`preview_${i}`,date,type,amount,description,category,account,timestamp:Date.parse(date)+i*3600000}));
fixture.budgets=[{id:'preview_groceries',name:'Groceries',categories:['Groceries'],limit:22000},{id:'preview_dining',name:'Eating out',categories:['Food & Dining'],limit:18000},{id:'preview_travel',name:'Getting around',categories:['Transportation'],limit:14000}];
fixture.installments=[{id:'preview_plan',description:'Laptop',monthlyAmount:8500,totalMonths:12,monthsLeft:4,startDate:'2026-03-01'}];
fixture.receivables=[{id:'preview_shared',type:'cash',who:'Nimal',why:'Shared weekend trip',amount:4500,originalAmount:4500,remainingAmount:4500,sourceAccount:'cash',dateGiven:'2026-10-30'}];
const bootstrap=`<script>
// A fixed end-of-month clock makes the illustrative month reproducible.
const PreviewDate=Date;window.Date=class extends PreviewDate{constructor(...args){super(...(args.length?args:['2026-10-31T14:30:00+05:30']));}static now(){return PreviewDate.now();}};
localStorage.setItem('kaasi_device_theme','dark');
window.supabase={createClient:()=>null};
Object.defineProperty(navigator,'serviceWorker',{value:{register:async()=>({addEventListener(){},waiting:null}),addEventListener(){},removeEventListener(){}}});
</script>`;
http.createServer((req,res)=>{
 let name=new URL(req.url,'http://127.0.0.1').pathname;if(name==='/')name='/index.html';
 if(!(/^\/(index\.html|style\.css|settings-workspace\.css|onboarding\.css|tailwind\.css|manifest\.json)$/.test(name)||/^\/(js|img|fonts|licenses)\/[a-zA-Z0-9_./-]+$/.test(name))||name.split('/').includes('..')){res.writeHead(404).end();return;}
 try{let body=fs.readFileSync(path.join(root,name));
  if(name==='/index.html')body=body.toString().replace(/<script\b[^>]*src="[^"]*(?:supabase-js|googletagmanager)[^"]*"[^>]*>\s*<\/script>/g,'').replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/,'').replace('<script src="js/globals.js',bootstrap+'<script src="js/globals.js');
  // Substitute only the preview's fresh-install defaults; the source file stays untouched.
  if(name==='/js/globals.js')body=body.toString()+`\ngetDefaultState=()=>JSON.parse(${JSON.stringify(JSON.stringify(fixture))});\n`;
  // Keep the preview dataset separate, including from earlier capture fixtures.
  if(name==='/js/storage.js')body=body.toString().replace('"kaasi-finances"','"kaasi-marketing-preview-october-v2"').replace('"KaasiData"','"KaasiMarketingData"').replace('"kaasi_indexeddb_migrated"','"kaasi_marketing_migrated"');
  const type={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
  res.writeHead(200,{'Content-Type':type[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"connect-src 'self'; form-action 'none'"}).end(body);
 }catch{res.writeHead(404).end();}
}).listen(4330,'127.0.0.1',()=>console.log('Synthetic, offline-only beta capture preview: http://127.0.0.1:4330'));
