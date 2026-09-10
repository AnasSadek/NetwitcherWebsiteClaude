#!/bin/bash
# Hero interaction benchmark, N runs each, desktop + mobile emulation, both sites
RUNS=${RUNS:-3}
for i in $(seq 1 $RUNS); do
  for site in "wp http://127.0.0.1:8081/" "next http://127.0.0.1:3100/"; do
    set -- $site
    node bench-hero.mjs "$2" "$1" desktop > ../bench/hero-$1-desktop-$i.json 2>/dev/null
    node bench-hero.mjs "$2" "$1" mobile > ../bench/hero-$1-mobile-$i.json 2>/dev/null
  done
done
node -e '
const fs=require("fs");const dir="../bench/";const rows={};
for(const f of fs.readdirSync(dir).filter(f=>/^hero-.*\.json$/.test(f))){const d=JSON.parse(fs.readFileSync(dir+f));const k=d.label+"-"+d.mode;(rows[k]=rows[k]||[]).push(d);}
const med=a=>{const v=a.slice().sort((x,y)=>x-y);return v[Math.floor(v.length/2)];};
for(const [k,list] of Object.entries(rows)){const m=list[0].motion;const out={runs:list.length};for(const key of Object.keys(m)){if(typeof m[key]==="number")out[key]=med(list.map(d=>d.motion[key]));}
out.jsBytes=med(list.map(d=>d.initial.js));out.totalBytes=med(list.map(d=>d.initial.bytes));out.requests=med(list.map(d=>d.initial.requests));out.headturnFrames=med(list.map(d=>d.initial.headturnFrames));out.fcp=med(list.map(d=>d.nav.fcp||0));out.load=med(list.map(d=>d.nav.load));console.log(k,JSON.stringify(out));}'
