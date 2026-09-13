const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');
menu?.addEventListener('click',()=>{nav?.classList.toggle('open')});
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
const buttons=document.querySelectorAll('[data-filter]'),cards=document.querySelectorAll('.card[data-type]');
buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;cards.forEach(card=>card.style.display=filter==='all'||card.dataset.type===filter?'flex':'none')}));