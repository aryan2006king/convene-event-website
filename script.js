const events=[
{id:1,name:"CodeSprint 24-Hour Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Innovation Hub, Block A",icon:"💻",c:["#4b3fe4","#8f86ff"],desc:"Build a working product in 24 hours with your team and pitch it to industry mentors.",more:"Teams of 2–4. Prizes, mentorship and free meals included."},
{id:2,name:"Intro to UI/UX Design Workshop",cat:"Workshop",date:"2026-11-21T14:00",venue:"Seminar Hall 2",icon:"🎨",c:["#ff6b6b","#ffb703"],desc:"Learn wireframing and prototyping in Figma through a hands-on session.",more:"Bring a laptop. Certificates provided to all participants."},
{id:3,name:"Rhythm Night Live",cat:"Cultural",date:"2026-12-12T18:30",venue:"Open Air Theatre",icon:"🎸",c:["#7b2ff7","#f107a3"],desc:"An evening of live music from student bands and a headline guest act.",more:"Gates open at 6 PM. Food stalls on site."},
{id:4,name:"Startup Founders Talk",cat:"Talk",date:"2026-11-14T11:00",venue:"Auditorium",icon:"🚀",c:["#0f9d8a","#7ee8c7"],desc:"Three founders share how they went from idea to funded company.",more:"Includes a 30-minute Q&A and networking tea."},
{id:5,name:"Inter-College Football Cup",cat:"Sports",date:"2027-01-09T08:00",venue:"Main Sports Ground",icon:"⚽",c:["#2b9348","#a7e163"],desc:"16 colleges compete across two days for the Convene trophy.",more:"Register your team of 11 plus 4 substitutes."},
{id:6,name:"AI & Machine Learning Bootcamp",cat:"Workshop",date:"2026-12-19T10:00",venue:"Computer Lab 3",icon:"🤖",c:["#0077b6","#90e0ef"],desc:"A beginner-friendly day of training and deploying your first ML model.",more:"Basic Python knowledge recommended."}
];
const $=s=>document.querySelector(s),fmt=d=>new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const store={get:()=>{try{return JSON.parse(localStorage.getItem("regs"))||[]}catch{return[]}},set:v=>localStorage.setItem("regs",JSON.stringify(v))};
let cat="All",q="",current=null;

// theme
const root=document.documentElement;
root.dataset.theme=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
$("#themeToggle").onclick=()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("theme",root.dataset.theme)};

// chips + grid
const cats=["All",...new Set(events.map(e=>e.cat))];
$("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c==="All"}" data-c="${c}">${c}</button>`).join("");
$("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
$("#search").oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
const cover=e=>`style="--c1:${e.c[0]};--c2:${e.c[1]}"`;
function render(){
  const list=events.filter(e=>(cat==="All"||e.cat===cat)&&(e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML=list.map(e=>`<article class="card"><div class="cover" ${cover(e)} aria-hidden="true">${e.icon}</div><div class="card-body"><span class="tag">${e.cat}</span><h3>${e.name}</h3><div class="meta">${fmt(e.date)}<br>${e.venue}</div><p>${e.desc}</p><button class="btn" data-id="${e.id}">View details</button></div></article>`).join("");
  $("#empty").hidden=list.length>0;
}
$("#grid").onclick=e=>{const b=e.target.closest("[data-id]");if(b)openEvent(+b.dataset.id)};

// modal
$("#form").elements.event.innerHTML=events.map(e=>`<option value="${e.id}">${e.name}</option>`).join("");
function openEvent(id){
  const e=events.find(x=>x.id===id);current=e;
  $("#detail").innerHTML=`<div class="cover" ${cover(e)}>${e.icon}</div><span class="tag">${e.cat}</span><h2>${e.name}</h2><p class="meta">${fmt(e.date)} · ${e.venue}</p><p>${e.desc} ${e.more}</p>`;
  $("#form").elements.event.value=id;$("#form").hidden=false;$("#confirm").hidden=true;
  $("#modal").showModal();
}
$("#closeModal").onclick=()=>$("#modal").close();
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")e.target.close()});

// validation
const rules={
  name:v=>/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v.trim())||"Enter your full name using letters only.",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||"Enter a valid email, like name@example.com.",
  phone:v=>/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g,""))||"Enter a 10-digit mobile number starting with 6–9.",
  event:v=>!!v||"Select an event."
};
function check(el){const r=rules[el.name](el.value),ok=r===true;el.classList.toggle("bad",!ok);el.nextElementSibling.textContent=ok?"":r;return ok}
$("#form").addEventListener("input",e=>{if(e.target.classList.contains("bad"))check(e.target)});
$("#form").addEventListener("focusout",e=>{if(rules[e.target.name]&&e.target.value)check(e.target)});
$("#form").onsubmit=e=>{
  e.preventDefault();
  const f=e.target,ok=[...f.elements].filter(x=>rules[x.name]).map(check).every(Boolean);
  if(!ok)return f.querySelector(".bad").focus();
  const ev=events.find(x=>x.id==f.elements.event.value),regs=store.get();
  if(regs.some(r=>r.eventId===ev.id&&r.email.toLowerCase()===f.elements.email.value.toLowerCase())){
    f.elements.email.classList.add("bad");f.elements.email.nextElementSibling.textContent="This email is already registered for this event.";return}
  regs.push({eventId:ev.id,event:ev.name,name:f.elements.name.value.trim(),email:f.elements.email.value,phone:f.elements.phone.value,at:new Date().toISOString()});
  store.set(regs);f.reset();f.hidden=true;
  $("#confirm").innerHTML=`<h3>You're in! 🎉</h3><p>Thanks, ${regs.at(-1).name}. We've registered you for <b>${ev.name}</b> on ${fmt(ev.date)}.</p>`;
  $("#confirm").hidden=false;listRegs();
};

// registrations
function listRegs(){
  const r=store.get();
  $("#regList").innerHTML=r.length?r.map(x=>`<li><span><b>${x.event}</b><br><span class="muted">${x.name} · ${x.email}</span></span><span class="muted">${fmt(x.at)}</span></li>`).join(""):'<li class="muted">No registrations yet. Pick an event above to get started.</li>';
}

// countdown
const nextEvent=()=>events.filter(e=>new Date(e.date)>Date.now()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
function tick(){
  const n=nextEvent();
  if(!n){$("#nextTitle").textContent="No upcoming events";$("#nextBtn").hidden=true;$("#nextClock").innerHTML="";return}
  $("#nextTitle").textContent=n.name;
  let s=Math.floor((new Date(n.date)-Date.now())/1000);
  const p=[["days",86400],["hrs",3600],["min",60],["sec",1]].map(([l,u])=>{const v=Math.floor(s/u);s%=u;return`<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`});
  $("#nextClock").innerHTML=p.join("");
}
$("#nextBtn").onclick=()=>openEvent(nextEvent().id);
render();listRegs();tick();setInterval(tick,1000);
