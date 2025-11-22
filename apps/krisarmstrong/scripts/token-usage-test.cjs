const fs = require('fs');
const path = require('path');

function read(p){ try { return fs.readFileSync(p,'utf8'); } catch { return ''; } }
function walk(dir, exts, acc=[]){
  if(!fs.existsSync(dir)) return acc;
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    const full = path.join(dir, item.name);
    if(item.isDirectory()) acc = walk(full, exts, acc);
    else {
      const ext = path.extname(item.name).toLowerCase();
      if(exts.includes(ext)) acc.push(full);
    }
  }
  return acc;
}

function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'); }
function tokensFromCss(cssPath){
  const content = fs.readFileSync(cssPath,'utf8');
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
  function countIn(text, token){
    const esc = escapeRegExp(token);
    const patterns = [
      new RegExp(`var\\(--theme-${esc}\\)`, 'g'),
      new RegExp(`'var\\(--theme-${esc}\\)'`, 'g'),
      new RegExp("`var(--theme-".replace(/-/g,'-') + esc + "`)" , 'g')
    ];
    let total = 0;
    for(const pat of patterns){
      const m = text.match(pat);
      if(m) total += m.length;
    }
    return total;
  }
  for(const f of files){
    const text = read(f);
    for(const t of tokens){
      usage[t] += countIn(text, t);
    }
  }
  const unused = tokens.filter(t => usage[t] <= 0);
  return { usage, unused };
}

(function run(){
  const repoRoot = path.resolve(__dirname, '..');
  const tokensPath = path.join(repoRoot, 'src','shared-tokens.css');
  const altPath = path.join(repoRoot, 'src','themes','shared-tokens.css');
  const tokens = (fs.existsSync(tokensPath) ? tokensFromCss(tokensPath) : tokensFromCss(altPath));
  const { usage, unused } = countUsage(repoRoot, tokens);
  const out = { repo: 'krisarmstrong-org', tokens, usage, unused };
  console.log(JSON.stringify(out, null, 2));
  if(unused && unused.length>0){ process.exit(1); }
})();
