import * as pdfjs from './vendor/build/pdf.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/build/pdf.worker.min.mjs',import.meta.url).href;
const reader=document.querySelector('#reader'),pagesEl=document.querySelector('#pages'),status=document.querySelector('#status'),contents=document.querySelector('#contents'),zoom=document.querySelector('#zoom');
const key=document.body.dataset.material;
let pdf,material,targets={},entries=[],epoch=0,queue=Promise.resolve();
const visible=new Set();
function tell(text){status.textContent=text;}
function size(entry){const s=zoom.value==='fit'?Math.max(.1,(reader.clientWidth-32)/entry.spec.width):Number(zoom.value);entry.scale=s;entry.el.style.width=entry.spec.width*s+'px';entry.el.style.height=entry.spec.height*s+'px';}
function schedule(entry){queue=queue.then(()=>render(entry)).catch(error=>{console.error(error);tell('Impossibile visualizzare una pagina. Puoi usare “Apri PDF”.');});return queue;}
async function render(entry){
 if(entry.rendered===epoch)return;
 const token=epoch,page=await pdf.getPage(entry.number),viewport=page.getViewport({scale:entry.scale});
 const output=Math.min(window.devicePixelRatio||1,2,Math.sqrt(24000000/(viewport.width*viewport.height)));
 const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*output);canvas.height=Math.ceil(viewport.height*output);canvas.setAttribute('aria-label',material.title+' — pagina '+entry.number);
 await page.render({canvasContext:canvas.getContext('2d'),viewport,transform:[output,0,0,output,0,0],annotationMode:pdfjs.AnnotationMode.DISABLE}).promise;
 if(token!==epoch){canvas.width=1;return;}
 canvas.dataset.epoch=String(token);entry.el.querySelector('canvas')?.remove();entry.el.prepend(canvas);entry.rendered=token;entry.el.dataset.loading='';
 // Retain only a small set of raster canvases; the source remains the original PDF.
 const cached=entries.filter(e=>e.el.querySelector('canvas')&&!visible.has(e));
 while(cached.length>2){const e=cached.shift();e.el.querySelector('canvas').remove();e.rendered=-1;}
}
async function navigate(){
 const id=decodeURIComponent(location.hash.slice(1)||'pagina-1');
 const entry=entries.find(e=>e.spec.anchor===id||'pagina-'+e.number===id);
 if(!entry){tell('Riferimento non trovato. Scegli una voce dall’indice.');return;}
 entry.el.scrollIntoView({block:'start'});contents.value='#'+entry.spec.anchor;await schedule(entry);tell('');
}
try{
 const response=await fetch(new URL('./materials.json',import.meta.url));if(!response.ok)throw Error('Manifest non disponibile');
 material=(await response.json())[key];if(!material)throw Error('Materiale sconosciuto');
 const destinations=await fetch(new URL('../destinazioni-home.json',import.meta.url));if(!destinations.ok)throw Error('Destinazioni non disponibili');targets=await destinations.json();
 const loading=pdfjs.getDocument({url:new URL('../'+material.pdf,import.meta.url).href,standardFontDataUrl:new URL('./vendor/standard_fonts/',import.meta.url).href,wasmUrl:new URL('./vendor/wasm/',import.meta.url).href});
 pdf=await loading.promise;if(pdf.numPages!==material.pages.length)throw Error('Numero pagine incoerente');
 for(const [i,spec] of material.pages.entries()){
  const el=document.createElement('section');el.className='pdf-page';el.dataset.loading='Caricamento pagina '+(i+1)+'…';el.setAttribute('aria-label','Pagina '+(i+1));
  for(const id of new Set([spec.anchor,'pagina-'+(i+1)])){const marker=document.createElement('span');marker.id=id;marker.className='page-anchor';el.append(marker);}
  const layer=document.createElement('div');layer.className='hotspots';
  for(const link of spec.links){
   const a=document.createElement('a');a.className='hotspot';a.href=link.material?(targets[link.material]||link.href.split('#')[0])+'#pagina-1':link.href;a.title=link.label;a.setAttribute('aria-label',link.label);
   if(link.external){a.target='_blank';a.rel='noopener';}
   const [x0,y0,x1,y1]=link.rect;Object.assign(a.style,{left:x0/spec.width*100+'%',top:y0/spec.height*100+'%',width:(x1-x0)/spec.width*100+'%',height:(y1-y0)/spec.height*100+'%'});layer.append(a);
  }
  el.append(layer);pagesEl.append(el);const entry={el,spec,number:i+1,rendered:-1};entries.push(entry);size(entry);
 }
 const options=material.toc.slice();
 for(let n=1;n<=pdf.numPages;n++)if(!options.some(o=>o.href==='#'+material.pages[n-1].anchor))options.push({label:'Pagina '+n,href:'#'+material.pages[n-1].anchor});
 if(key==='index')for(const [slug,label] of Object.entries(targets))options.push({label:'Apri '+slug.replaceAll('-',' '),href:label+'#pagina-1'});
 for(const opt of options){const el=document.createElement('option');el.value=opt.href;el.textContent=opt.label;contents.append(el);}
 contents.addEventListener('change',()=>{if(contents.value.startsWith('#'))location.hash=contents.value;else location.href=contents.value;});
 const observer=new IntersectionObserver(items=>{for(const item of items){const entry=entries.find(e=>e.el===item.target);if(item.isIntersecting){visible.add(entry);schedule(entry);}else visible.delete(entry);}},{root:reader,rootMargin:'400px'});
 entries.forEach(e=>observer.observe(e.el));
 zoom.addEventListener('change',()=>{epoch++;entries.forEach(e=>{size(e);e.rendered=-1;e.el.querySelector('canvas')?.remove();e.el.dataset.loading='Caricamento pagina '+e.number+'…';});navigate();});
 let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{if(zoom.value==='fit'){epoch++;entries.forEach(e=>{size(e);e.rendered=-1;});navigate();}},180);});
 new ResizeObserver(()=>{reader.style.top=document.querySelector('.toolbar').offsetHeight+'px';}).observe(document.querySelector('.toolbar'));
 window.addEventListener('hashchange',navigate);await navigate();document.body.dataset.ready='true';
}catch(error){console.error(error);tell('Il PDF non è stato caricato. Usa “Apri PDF”. Se stai aprendo file locali, avvia il server indicato nel README.');document.body.dataset.error='true';}
