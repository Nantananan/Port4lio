const hoverImg = document.getElementById('hoverImg');
const words = document.querySelectorAll('.name span');
const themeToggle = document.getElementById('themeToggle');

let mouseX = 0, mouseY = 0;
let isTouchDevice = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
let isTouch = isTouchDevice();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

// Only enable hover image on non-touch devices
if (!isTouch) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverImg.style.left = mouseX + 'px';
    hoverImg.style.top = mouseY + 'px';
  });

  words.forEach(word => {
    word.addEventListener('mouseenter', () => {
      hoverImg.style.backgroundImage = `url(${word.dataset.img})`;
      hoverImg.classList.add('active');
    });
    word.addEventListener('mouseleave', () => {
      hoverImg.classList.remove('active');
    });
  });
} else {
  // On touch devices, disable the hover image element
  if (hoverImg) hoverImg.style.display = 'none';
}

const stack = document.getElementById('stack');
const cards = document.querySelectorAll('.stack-card');

const REPEL_RADIUS = 160;   // how close the mouse needs to be to affect a card
const MAX_PUSH = 55;        // max distance a card gets pushed away

function setBaseTransform(card) {
  const x = card.dataset.baseX;
  const y = card.dataset.baseY;
  const r = card.dataset.rot;
  card.style.transform =
    `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${r}deg)`;
}

// set initial resting position for each card
cards.forEach(setBaseTransform);

// Only enable repel effect on non-touch devices
if (!isTouch && stack) {
  stack.addEventListener('mousemove', (e) => {
    const rect = stack.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    cards.forEach(card => {
      const baseX = parseFloat(card.dataset.baseX);
      const baseY = parseFloat(card.dataset.baseY);
      const rot = card.dataset.rot;

      // card's resting center, relative to the stack container
      const cardCenterX = rect.width / 2 + baseX;
      const cardCenterY = rect.height / 2 + baseY;

      const dx = cardCenterX - mouseX;
      const dy = cardCenterY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < REPEL_RADIUS) {
        const strength = (1 - dist / REPEL_RADIUS) * MAX_PUSH;
        const pushX = (dx / dist) * strength;
        const pushY = (dy / dist) * strength;

        card.style.transform =
          `translate(-50%, -50%) translate(${baseX + pushX}px, ${baseY + pushY}px) rotate(${rot}deg)`;
      } else {
        setBaseTransform(card);
      }
    });
  });

  stack.addEventListener('mouseleave', () => {
    cards.forEach(setBaseTransform);
  });
}

/* ---- Floating Card with Repel Effect ---- */
const floatingCard = document.getElementById('floatingCard');
if (floatingCard && !isTouch) {
  const REPEL_RADIUS = 200;
  const MAX_PUSH = 45;

  function setFloatingCardTransform(card, pushX = 0, pushY = 0, pushRot = 0) {
    const baseRot = parseFloat(card.dataset.rot);
    card.style.transform =
      `translate(-50%, -50%) translate(${pushX}px, ${pushY}px) rotate(${baseRot + pushRot}deg)`;
  }

  setFloatingCardTransform(floatingCard);

  document.addEventListener('mousemove', (e) => {
    const rect = floatingCard.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const dx = cardCenterX - e.clientX;
    const dy = cardCenterY - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist < REPEL_RADIUS) {
      const strength = (1 - dist / REPEL_RADIUS);
      const pushX = (dx / dist) * strength * MAX_PUSH;
      const pushY = (dy / dist) * strength * MAX_PUSH;
      const pushRot = strength * 8;

      setFloatingCardTransform(floatingCard, pushX, pushY, pushRot);
    } else {
      setFloatingCardTransform(floatingCard);
    }
  });
}

/* ---- Card Modal / Details Popup ---- */
const cardModal = document.getElementById('cardModal');
const cardModalClose = document.getElementById('cardModalClose');
const cardClickableCards = document.querySelectorAll('.card-clickable');

function openCardModal(card) {
  const img = card.dataset.img;
  const title = card.querySelector('h3').textContent;
  const description = card.dataset.description;

  document.getElementById('cardModalImg').src = img;
  document.getElementById('cardModalTitle').textContent = title;
  document.getElementById('cardModalDescription').textContent = description;

  cardModal.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // prevent scrolling when modal is open
}

function closeCardModal() {
  cardModal.classList.remove('is-open');
  document.body.style.overflow = 'auto'; // re-enable scrolling
}

cardClickableCards.forEach(card => {
  card.addEventListener('click', () => openCardModal(card));
  // Add touch event for better mobile support
  card.addEventListener('touchend', (e) => {
    e.preventDefault();
    openCardModal(card);
  });
});

cardModalClose.addEventListener('click', closeCardModal);
cardModalClose.addEventListener('touchend', (e) => {
  e.preventDefault();
  closeCardModal();
});

cardModal.addEventListener('click', (e) => {
  if (e.target === cardModal) {
    closeCardModal();
  }
});

cardModal.addEventListener('touchend', (e) => {
  if (e.target === cardModal) {
    closeCardModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cardModal.classList.contains('is-open')) {
    closeCardModal();
  }
});
(function(){
  const cat = document.getElementById('catSprite');

  // ---- Frame sets ----
  const frames = {
    idle: { right: 'Sprites/posa idle right.jpg',  left: 'Sprites/posa idle left.jpg' },
    walk: { right: ['Sprites/posa run1 right.jpg','Sprites/posa run2 right.jpg'],
             left: ['Sprites/posa run1 left.jpg','Sprites/posa run2 left.jpg'] },
    run:  { right: ['Sprites/posa gallop right.jpg','Sprites/posa run1 right.jpg','Sprites/posa run2 right.jpg'],
             left: ['Sprites/posa gallop left.jpg','Sprites/posa run1 left.jpg','Sprites/posa run2 left.jpg'] }
  };

  // ---- State ----
  const BOTTOM_OFFSET = 20;   // px from the bottom of the screen
  let x = 100;                       // current horizontal position
  let direction = 1;                 // 1 = facing right, -1 = facing left
  let mode = 'idle';                 // 'idle' | 'walk' | 'run'
  let frameIndex = 0;

  const WALK_SPEED = 1.0;     // px per tick
  const RUN_SPEED = 2.4;
  const FRAME_INTERVAL = 150; // ms per animation frame
  const MOVE_INTERVAL = 16;   // ms per position update (~60fps)

  function bounds(){
    return {
      maxX: window.innerWidth - cat.offsetWidth,
      y: window.innerHeight - cat.offsetHeight - BOTTOM_OFFSET
    };
  }

  function setSprite(){
    const facing = direction === 1 ? 'right' : 'left';
    if (mode === 'idle'){
      cat.src = frames.idle[facing];
      return;
    }
    const set = frames[mode][facing];
    cat.src = set[frameIndex % set.length];
  }

  function pickNewAction(){
    // decide idle vs walk vs run for this stretch
    const roll = Math.random();
    if (roll < 0.3){
      mode = 'idle';
    } else if (roll < 0.75){
      mode = 'walk';
      direction = Math.random() < 0.5 ? 1 : -1;
    } else {
      mode = 'run';
      direction = Math.random() < 0.5 ? 1 : -1;
    }
    frameIndex = 0;

    const duration = mode === 'idle'
      ? 1200 + Math.random() * 2500   // idle 1.2–3.7s
      : 1500 + Math.random() * 3500;  // move 1.5–5s
    setTimeout(pickNewAction, duration);
  }

  // ---- Animation frame cycling ----
  setInterval(() => {
    frameIndex++;
    setSprite();
  }, FRAME_INTERVAL);

  // ---- Movement loop (horizontal only, along the bottom) ----
  setInterval(() => {
    const { maxX, y } = bounds();

    if (mode !== 'idle'){
      const speed = mode === 'run' ? RUN_SPEED : WALK_SPEED;
      x += speed * direction;

      // loop around screen edges
      if (x > maxX){
        x = -cat.offsetWidth;
      } else if (x < -cat.offsetWidth){
        x = maxX;
      }
    }

    cat.style.transform = `translate(${x}px, ${y}px)`;
  }, MOVE_INTERVAL);

  window.addEventListener('resize', () => {
    const { maxX } = bounds();
    x = Math.min(x, maxX);
  });

  // init
  const initial = bounds();
  cat.style.transform = `translate(${x}px, ${initial.y}px)`;
  setSprite();
  pickNewAction();
})();