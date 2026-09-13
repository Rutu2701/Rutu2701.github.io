const theme=document.createElement('link');theme.rel='stylesheet';theme.href='neutral-theme.css';document.head.appendChild(theme);
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');
menu?.addEventListener('click',()=>{nav?.classList.toggle('open');if(nav)nav.style.display=nav.classList.contains('open')?'flex':''});
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');if(nav&&innerWidth<=700)nav.style.display='none'}));
const buttons=document.querySelectorAll('[data-filter]'),cards=document.querySelectorAll('.card[data-type]');
buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;cards.forEach(card=>card.style.display=filter==='all'||card.dataset.type===filter?'flex':'none')}));

document.addEventListener('DOMContentLoaded',()=>{
  const rootPage=!document.body.classList.contains('case-page');
  if(rootPage){
    const exploring=document.querySelector('.intro .exploring');
    if(exploring)exploring.textContent='Exploring my capabilities!';
    const hero=document.querySelector('.intro-main');
    if(hero&&!hero.querySelector('.availability')){const p=document.createElement('p');p.className='availability';p.textContent='Seeking Embedded Systems & Robotics Internships · Expected Graduation: 2029';hero.insertBefore(p,hero.querySelector('.pill'));}
  }
  document.querySelectorAll('footer label').forEach((el,i)=>{if(i===0)el.textContent='ENGINEERING PORTFOLIO'});
  const involvement=document.querySelector('.platform');
  if(involvement){
    const head=involvement.querySelector('.platform-head span');if(head)head.remove();
    involvement.setAttribute('role','link');involvement.tabIndex=0;
    involvement.addEventListener('click',e=>{if(!e.target.closest('a'))location.hash='highlights'});
    involvement.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a'))location.hash='highlights'});
  }
  const colorCard=[...cards].find(c=>c.querySelector('h3')?.textContent.trim()==='Color Tracking Cursor');
  if(colorCard){
    const b=colorCard.querySelector('.thumb b'),s=colorCard.querySelector('.thumb span'),h=colorCard.querySelector('h3'),p=colorCard.querySelector('p'),small=colorCard.querySelector('.card-body>small');
    if(b)b.innerHTML='HAND<br>CONTROL';
    if(s)s.textContent='MediaPipe → PyAutoGUI';
    if(h)h.textContent='Hand-Controlled Cursor Movement';
    if(p)p.textContent='Real-time hand tracking using MediaPipe and PyAutoGUI to map hand landmarks and gestures into desktop cursor control.';
    if(small)small.textContent='PROJECT · COMPUTER VISION';
  }
});