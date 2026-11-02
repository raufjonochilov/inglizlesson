const fs = require('fs');
const file = 'src/app/globals.css';
let css = fs.readFileSync(file, 'utf8');
// Remove the old substring-based recoloring: it also matched dark: and hover: classes.
css = css.replace(/[^{}]*\[class\*=[^{}]*\{[^{}]*\}/g, '');
const colors = ['slate','gray','zinc','indigo','blue','cyan','teal','purple','violet','pink','orange','amber','emerald','green','red','rose'];
const esc = token => '.' + token.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
const rules = [];
const rule = (tokens, declarations) => rules.push(tokens.map(t=>'.app-light '+esc(t)).join(',')+'{'+declarations+'}');
for (const color of colors) {
  const ink = ['red','rose'].includes(color)?'#b42335':['green','emerald'].includes(color)?'#166534':['orange','amber'].includes(color)?'#92400e':['slate','gray','zinc'].includes(color)?'#334155':'#1d4ed8';
  for (const n of [100,200,300,400,500]) rule([`text-${color}-${n}`],`color:${ink}!important`);
  for (const n of [700,800,900,950]) {
    for (const opacity of ['', '/20','/30','/40','/50','/60','/70','/80','/85','/90','/95']) rule([`bg-${color}-${n}${opacity}`],'background-color:#f1f5fc!important');
  }
  for (const n of [400,500,600,700]) {
    for (const opacity of ['/5','/10','/15','/20','/25','/30','/40']) rule([`bg-${color}-${n}${opacity}`],`background-color:${['red','rose'].includes(color)?'#fff1f2':['green','emerald'].includes(color)?'#effaf3':'#eaf2ff'}!important`);
  }
}
rule(['text-white'],'color:inherit!important');
rule(['hover:text-white'],'color:inherit');
rule(['bg-black/20','bg-black/30','bg-black/40','bg-black/50','bg-black/60','bg-white/5','bg-white/10','bg-white/15','bg-white/20'],'background-color:#eef4fc!important');
rule(['border-white/5','border-white/10','border-white/15','border-white/20'],'border-color:#cbd8ea!important');
rules.push('.app-light [class*="bg-gradient-"]{background-image:none;background-color:#edf4ff;color:#17355d}');
// Solid controls and banners own their foreground, including nested labels/icons.
const solid=[];
for(const color of colors.filter(c=>!['slate','gray','zinc'].includes(c))) {
 for(const n of [500,600,700])solid.push(`bg-${color}-${n}`);
 for(const n of [500,600,700,900])solid.push(`from-${color}-${n}`);
}
const selectors=solid.map(t=>'.app-light '+esc(t));
rules.push(selectors.join(',')+'{background:#1d4ed8!important;color:#fff!important}');
rules.push(selectors.map(s=>s+' *').join(',')+'{color:#fff!important}');
rules.push('.app-light input,.app-light textarea,.app-light select{color:#17355d!important;background-color:#fff!important}.app-light input::placeholder,.app-light textarea::placeholder{color:#64748b!important;opacity:1}.app-light .sidebar-link.is-active,.app-light .sidebar-link.is-active *{color:white!important}.app-light .glass-panel,.app-light .glass-card{color:#17355d}.app-light .sidebar-link:not(.is-active){color:#425775}.app-light .sidebar-link:not(.is-active) svg{color:inherit!important}.app-light .hero-copy h2{color:white}.app-light .hero-copy p{color:#e6efff}.app-light .lesson-status,.app-light .lesson-tile-desc,.app-light .voice-status,.app-light .voice-field,.app-light .voice-speed>span,.app-light .unit-title small,.app-light .quest-label small,.app-light .quest-label>span,.app-light .chapter-trophy,.app-light .achievement-badge small{color:#526580}.app-light .voice-tabs button,.app-light .voice-speed button,.app-light .topbar-voice{color:#425775}.app-light .voice-tabs button.selected,.app-light .voice-speed button.selected{color:#1d4ed8}.app-light .quest-node:disabled{color:#526580}.app-light .achievement-badge>span{opacity:.8}.app-light .buster-workspace .text-red-200{color:#b42335!important}');
fs.writeFileSync(file,css+'\n/* Exact light-theme palette. State variants are never matched as active colors. */\n'+rules.join('\n')+'\n');
const page='src/app/page.tsx';
fs.writeFileSync(page,fs.readFileSync(page,'utf8').replace('relative min-h-screen flex flex-col bg-slate-950 text-slate-100','app-light relative min-h-screen flex flex-col bg-slate-50 text-slate-900'));
