#!/bin/sh
# Копирует главную страницу из origin-site в origin-preview и чинит пути
cd "$(dirname "$0")/.."
N="C:/Users/HP/AppData/Local/node-portable/node-v24.18.0-win-x64/node.exe"
cp origin-site/index.html origin-site/core.css origin-preview/
[ -f origin-site/core.js ] && cp origin-site/core.js origin-preview/
"$N" -e "
const fs=require('fs'),p=require('path');
let s=fs.readFileSync('origin-preview/index.html','utf8');
s=s.replace(/(src|href)=\"\/(?!\/)/g,'\$1=\"').replace(/url\((['\"]?)\/(?!\/)/g,'url(\$1');
fs.writeFileSync('origin-preview/index.html',s);
// cssFix: пути в стилях тоже делаем относительными
let css=fs.readFileSync('origin-preview/core.css','utf8');
css=css.replace(/url((['"]?)/assets//g,'url($1assets/');
fs.writeFileSync('origin-preview/core.css',css);
const need=new Set([...s.matchAll(/assets\/([A-Za-z0-9._-]+)/g)].map(m=>m[1]));
let ok=0,miss=[];
for(const f of need){const from=p.join('origin-site/assets',f);
  if(fs.existsSync(from)){fs.copyFileSync(from,p.join('origin-preview/assets',f));ok++}else miss.push(f)}
console.log('файлов: '+ok, miss.length?('НЕТ: '+miss.join(', ')):'');
"
