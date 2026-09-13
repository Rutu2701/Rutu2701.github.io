const theme=document.createElement('link');theme.rel='stylesheet';theme.href='../neutral-theme.css';document.head.appendChild(theme);

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.exploring').forEach(el=>el.remove());
  document.querySelectorAll('footer label').forEach((el,i)=>{if(i===0)el.textContent='ENGINEERING PORTFOLIO'});

  const notes=document.querySelector('.notes-placeholder'),grid=document.querySelector('.case-grid');
  if(notes&&grid){const heading=notes.querySelector('h2');if(heading)heading.textContent='My notes';grid.parentNode.insertBefore(notes,grid);}

  const path=location.pathname;
  const addAction=(label,href,cls='proof-link')=>{const actions=document.querySelector('.repo-actions');if(!actions||actions.querySelector(`[data-proof="${cls}"]`))return;const a=document.createElement('a');a.className='button';a.dataset.proof=cls;a.href=href;a.target='_blank';a.rel='noreferrer';a.textContent=label;actions.appendChild(a)};

  if(path.endsWith('/projects/infinity-sketcher.html')){
    addAction('Repository ↗','https://github.com/Rutu2701/Infinity-Sketcher','infinity-repo');
    const actions=document.querySelector('.repo-actions');
    if(actions&&!actions.querySelector('.udaan-related')){const a=document.createElement('a');a.className='button udaan-related';a.href='udaan.html';a.textContent='UDAAN 2K26 ↗';actions.appendChild(a);}
  }

  if(path.endsWith('/projects/circuitforge.html')){
    addAction('Repository ↗','https://github.com/Rutu2701/Auto-Circuit-for-KiCad','circuit-repo');
  }

  if(path.endsWith('/projects/udaan.html')){
    const first=document.querySelector('.case-grid .case-card p');
    if(first)first.textContent='Served as Project Lead, driving the end-to-end lifecycle from foundational research and system architecture through hands-on fabrication, integration and exhibition, while guiding the team through completion.';
    const content=document.querySelector('.case-content');
    if(content&&!content.querySelector('.infinity-related')){
      const block=document.createElement('div');block.className='case-block infinity-related';
      block.innerHTML='<h2>Related engineering work</h2><p>Infinity Sketcher documents another physical-system build spanning mechanics, electronics, firmware, computer vision and motion control.</p><div class="repo-actions"><a class="button" href="infinity-sketcher.html">Open Infinity Sketcher ↗</a></div>';
      content.appendChild(block);
    }
  }

  if(path.endsWith('/projects/color-tracking.html')){
    const title=document.querySelector('.case-hero h1'),lede=document.querySelector('.case-lede'),eyebrow=document.querySelector('.case-eyebrow'),overview=document.querySelector('.overview-media div'),skills=document.querySelector('.skills'),tags=document.querySelector('.case-tags'),pipeline=document.querySelector('.case-content .impact'),blocks=document.querySelectorAll('.case-content .case-block');
    if(title)title.textContent='Hand-Controlled Cursor Movement';
    if(eyebrow)eyebrow.textContent='PROJECT 07 · COMPUTER VISION · MEDIAPIPE · PYTHON';
    if(lede)lede.textContent='Real-time hand tracking system using MediaPipe landmarks and PyAutoGUI to translate hand position and gestures into desktop cursor control.';
    if(overview)overview.innerHTML='MEDIAPIPE HAND<br>→ CURSOR CONTROL';
    if(skills)skills.innerHTML='<span class="skill">Python</span><span class="skill">MediaPipe</span><span class="skill">OpenCV</span><span class="skill">PyAutoGUI</span><span class="skill">21 Hand Landmarks</span><span class="skill">Coordinate Mapping</span><span class="skill">Smoothing</span><span class="skill">Gesture Control</span>';
    if(tags)tags.innerHTML='<span class="case-tag">COMPUTER VISION</span><span class="case-tag">MEDIAPIPE</span><span class="case-tag">PYAUTOGUI</span>';
    const cs=document.querySelectorAll('.case-grid .case-card');
    if(cs.length>=4){
      const text=[['Landmark detection','MediaPipe Hands provides 21 hand landmarks per detected hand for real-time interaction.'],['Smoothing','Dead-zone rejection and smoothing reduce small tracking movements before cursor output.'],['Coordinate mapping','Camera-space hand movement is mapped into desktop cursor coordinates.'],['Gesture control','Pinch and multi-finger gestures are interpreted through PyAutoGUI for click, drag, right-click and scroll actions.']];
      text.forEach((v,i)=>{const h=cs[i].querySelector('h3'),p=cs[i].querySelector('p');if(h)h.textContent=v[0];if(p)p.textContent=v[1];});
    }
    if(pipeline)pipeline.textContent='camera input → MediaPipe 21 landmarks → smoothing/dead-zone → coordinate mapping → PyAutoGUI';
    if(blocks[1]){const p=blocks[1].querySelector('p');if(p)p.textContent='The engineering focus is the sensing-to-action loop: extracting stable hand landmarks from live camera frames and turning them into controlled desktop input without a physical mouse.';}
  }

  if(path.endsWith('/projects/corexy.html')){
    const content=document.querySelector('.case-content'),media=document.querySelector('.media-grid');
    if(media&&!media.querySelector('[data-corexy-printed]')){const figure=document.createElement('figure');figure.className='figure';figure.dataset.corexyPrinted='';figure.innerHTML='<img class="zoomable" src="../assets/corexy/images/printed%20obj.jpg" alt="3D printed object from the CoreXY project" loading="lazy"><figcaption>Printed object · click to expand</figcaption>';media.appendChild(figure);}
    if(content&&!content.querySelector('.corexy-source-files')){const block=document.createElement('div');block.className='case-block corexy-source-files';block.innerHTML='<h2>Original project files</h2><table class="tech-table"><tr><th>PRINTER CONFIG</th><td><a href="../assets/corexy/config/Printer%20config.txt" target="_blank">Open original printer configuration ↗</a></td></tr><tr><th>PRINTED OBJECT</th><td><a href="../assets/corexy/images/printed%20obj.jpg" target="_blank">Open original printed-object image ↗</a></td></tr><tr><th>SCHEMATIC</th><td><a href="../assets/corexy/schematics/3D%20printer%20corexy%20Schematic.pdf" target="_blank">Open original CoreXY schematic ↗</a></td></tr></table>';content.appendChild(block);}
  }

  const box=document.createElement('div');box.className='lightbox';box.innerHTML='<button class="lightbox-close" aria-label="Close image">×</button><img alt="">';document.body.appendChild(box);
  const img=box.querySelector('img'),close=()=>{box.classList.remove('open');img.removeAttribute('src')};
  document.querySelectorAll('.zoomable').forEach(el=>el.addEventListener('click',()=>{img.src=el.dataset.full||el.currentSrc||el.src;img.alt=el.alt||'';box.classList.add('open')}));
  box.addEventListener('click',e=>{if(e.target===box||e.target===img||e.target===box.querySelector('.lightbox-close'))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
});