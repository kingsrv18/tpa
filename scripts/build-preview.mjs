// Package a private visual preview of the public redesign. The complete Next.js
// platform remains in source and has its own production build.
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const root=path.resolve('.'),out=path.resolve(root,'dist');
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Unsafe preview output path.');
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
await fs.cp('public',out,{recursive:true});
const frontend=load(await fs.readFile('theme/index.html','utf8'));
frontend('[data-inquiry-slot]').html('<div class="tpa-static-inquiry-note"><span class="tpa-small-label">A CONVERSATION WITH TPA</span><h3>Tell us what’s on your mind.</h3><p>Membership, an event or a potential collaboration—continue to the association’s contact form to send your inquiry.</p><a href="https://tpassociation.org/contact">Continue to the TPA contact form ↗</a></div>');
const platformPaths=/^\/(?:join|login|signup|member|admin|account|invitation|forgot-password|reset-password|email-verification)(?:[/?#]|$)/;
const platformLinks=$=>{$('a[href]').each((_,e)=>{const q=$(e),href=q.attr('href');if(platformPaths.test(href))q.attr('href','https://tpassociation.org'+href);});};
platformLinks(frontend);
await fs.writeFile(path.join(out,'index.html'),frontend.html());
// Original visual styles use absolute asset URLs. Keep the same self-hosted font.
for(const f of await fs.readdir(path.join(out,'theme/assets'))){if(f.endsWith('.css')){const p=path.join(out,'theme/assets',f);await fs.writeFile(p,(await fs.readFile(p,'utf8')).replaceAll('/assets/','/theme/assets/'));}}

const origin=process.env.TPA_PREVIEW_ORIGIN||'http://127.0.0.1:5173';
const snapshots=[];
// These share one Next dynamic route and compiler/cache on a cold dev server.
for(const slug of ['about','governance','membership','events','resources','contact']){
  const response=await fetch(origin+'/'+slug);
  if(!response.ok)throw new Error('Public preview page failed: '+slug+' ('+response.status+')');
  snapshots.push({slug,html:await response.text()});
}
const assetUrls=new Set();
for(const {slug,html} of snapshots){
  const $=load(html);
  $('script,nextjs-portal,.account-controls').remove();
  $('link[rel=preload],link[rel=modulepreload]').remove();
  $('link[rel=stylesheet]').each((_,e)=>assetUrls.add($(e).attr('href')));
  $('head').append('<link rel="stylesheet" href="/theme/assets/eae8f268b874f452.css"><link rel="stylesheet" href="/theme/tpa.css"><style>:root{--font-inter:Inter,Arial,sans-serif}body{font-family:Inter,Arial,sans-serif}</style>');
  $('.inquiry-intake').html('<div class="tpa-static-inquiry-note"><h3>Start a conversation.</h3><p>Continue to the association’s contact form to send an inquiry about membership, events or collaboration.</p><a href="https://tpassociation.org/contact">Open the TPA contact form ↗</a></div>');
  platformLinks($);
  await fs.mkdir(path.join(out,slug),{recursive:true});
  await fs.writeFile(path.join(out,slug,'index.html'),$.html());
}
for(const url of assetUrls){
  if(!url.startsWith('/_next/'))continue;
  const response=await fetch(origin+url);if(!response.ok)throw new Error('Missing public stylesheet '+url);
  const css=await response.text(),pathname=new URL(url,origin).pathname;
  const destination=path.resolve(out,'.'+pathname);
  if(!destination.startsWith(out+path.sep))throw new Error('Unsafe stylesheet path.');
  await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,css);
}
// Local font files referenced by Next's public styles.
for(const candidate of ['.next/dev/static/media','.next/static/media']){
  try{await fs.access(candidate);await fs.mkdir(path.join(out,'_next/static/media'),{recursive:true});await fs.cp(candidate,path.join(out,'_next/static/media'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
}
console.log('Private visual preview ready: homepage + six public pages. Account and inquiry actions retain the existing TPA destination.');
