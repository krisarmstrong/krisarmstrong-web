const fs = require('fs');
const path = require('path');

function read(p){ try { return fs.readFileSync(p,'utf8'); } catch { return ''; } }
function walk(dir, exts, acc=[]){
  if(!fs.existsSync(dir)) return acc;
  for(const name of fs.readdirSync(dir, {withFileTypes:true})){
    const full = path.join(dir,name.name);
    if(name.isDirectory()) acc = walk(full, exts, acc);
    else {
      const ext = path.extname(name.name).toLowerCase();
      if(exts.includes(ext)) acc.push(full);
    }
  }
  return acc;
}

function tokensFromCss(cssPath){
  const content = read(cssPath);
  const re = /--theme-([A-Za-z0-9_-]+):/g;
  const tokens = new Set();
  let m;
  while((m = re.exec(content)) !== null){ tokens.add(m[1]); }
  return Array.from(tokens);
}

function countUsage(repoRoot, tokens){
  const files = walk(repoRoot, ['.css','.ts','.tsx','.js','.jsx']);
  const usage = {};
  tokens.forEach(t => usage[t] = 0);
  for(const f of files){
    const data = read(f);
    for(const t of tokens){
      const needle = `var(--theme-${t})`;
      if(data.includes(needle)){
        const re = new RegExp(needle.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&'), 'g');
        const matches = data.match(re) || [];
        usage[t] += matches.length;
      }
    }
  }
  return usage;
}

(function run(){
  const repoRoot = path.resolve(__dirname, '..');
  const tokensPath = path.join(repoRoot, 'src','shared-tokens.css');
  const tokens = tokensFromCss(tokensPath);
  const usage = countUsage(repoRoot, tokens);
  const unused = tokens.filter(t => usage[t] === 0);
  const out = { repo: 'wifivigilante-com', tokens, usage, unused };
  console.log(JSON.stringify(out, null, 2));
  if(unused.length>0){ process.exit(1); }
})();
