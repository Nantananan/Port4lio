const hoverImg = document.getElementById('hoverImg');
const words = document.querySelectorAll('.name span');
const themeToggle = document.getElementById('themeToggle');

let mouseX = 0, mouseY = 0;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

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
}

function closeCardModal() {
  cardModal.classList.remove('is-open');
}

cardClickableCards.forEach(card => {
  card.addEventListener('click', () => openCardModal(card));
});

cardModalClose.addEventListener('click', closeCardModal);

cardModal.addEventListener('click', (e) => {
  if (e.target === cardModal) {
    closeCardModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cardModal.classList.contains('is-open')) {
    closeCardModal();
  }
});
