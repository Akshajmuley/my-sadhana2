const $=id=>document.getElementById(id);
const durations=[['sravanam','Sravanam time'],['reading','Reading time'],['sangha','Sangha Time']];
durations.forEach(([id,label])=>{const field=document.createElement('div');field.className='field';field.innerHTML=`<label for="${id}">${label} <span style="font-weight:400;color:#788271">(minutes)</span></label><input id="${id}" type="number" min="0" step="1" placeholder="Enter minutes"><div class="chips">${[0,15,30,45,60].map(n=>`<button type="button" data-field="${id}" data-value="${n}">${n} min</button>`).join('')}</div>`;$('durations').append(field)});
const ids=['bed','wake','rounds','start','end','sravanam','reading','sangha','seva'];
const now=new Date();$('date').value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const key=()=>`sadhana-card-v1:${$('date').value}`;
function time(v){if(!v)return '—';const [h,m]=v.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
function minutes(id){return $(id).value!==''?`${$(id).value} minutes`:'—'}
function message(){const [y,m,d]=$('date').value.split('-');return `*Daily Sadhana Card*\nDate: ${y?`${m}/${d}/${y}`:'—'}\nTo bed: ${time($('bed').value)}\nWake up: ${time($('wake').value)}\nJapa (No of Rounds): ${$('rounds').value||'—'}\nJapa time: ${time($('start').value)} to ${time($('end').value)}\nSravanam time: ${minutes('sravanam')}\nReading time: ${minutes('reading')}\nSeva: ${$('seva').value.trim()||'—'}\nSangha Time: ${minutes('sangha')}`}
function update(save=true){$('message').textContent=message();$('whatsapp').href=`https://wa.me/?text=${encodeURIComponent(message())}`;if(save){try{localStorage.setItem(key(),JSON.stringify(Object.fromEntries(ids.map(id=>[id,$(id).value]))))}catch{$('status').textContent='Browser storage is unavailable. You can still copy your card.'}}}
function load(){let data={};try{data=JSON.parse(localStorage.getItem(key())||'{}')}catch{}ids.forEach(id=>$(id).value=data[id]??'');$('status').textContent='';update(false)}
$('date').addEventListener('change',load);
$('card').addEventListener('submit',e=>e.preventDefault());
ids.forEach(id=>$(id).addEventListener('input',()=>{if($(id).type==='number'&&$(id).value!=='')$(id).value=Math.max(0,Math.floor(Number($(id).value)));update()}));
document.querySelectorAll('[data-field]').forEach(btn=>btn.addEventListener('click',()=>{$(btn.dataset.field).value=btn.dataset.value;update()}));
['minus','plus'].forEach(id=>$(id).addEventListener('click',()=>{$('rounds').value=Math.max(0,Number($('rounds').value)+(id==='plus'?1:-1));update()}));
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message());$('status').textContent='Copied! Paste into your WhatsApp chat.'}catch{const range=document.createRange();range.selectNodeContents($('message'));const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);$('status').textContent='Message selected. Use Copy on your device, then paste into WhatsApp.'}});
$('reset').addEventListener('click',()=>{if(confirm('Clear the entries for this date?')){ids.forEach(id=>$(id).value='');update();$('status').textContent='Entries cleared.'}});
load();
