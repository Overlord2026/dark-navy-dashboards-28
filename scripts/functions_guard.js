const fs=require("fs"),path=require("path");
const ROOT=process.cwd(); const BAD=[/["']@\/|["']\/src\/|["']\.\.\/\.\.\/src\//];
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
const files=walk(path.join(ROOT,"supabase","functions")).filter(f=>/\.(ts|tsx|js|jsx)$/.test(f));
const hits=[]; for(const f of files){const s=fs.readFileSync(f,"utf8"); for(const p of BAD){ if(p.test(s)){hits.push(f); break; } } }
if(hits.length){ console.error("Invalid imports in functions:", hits.join("\n")); process.exit(2); } else { console.log("Functions import guard: OK"); }