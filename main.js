const artWrap = document.getElementById('artWrap');
const mainArt = document.getElementById('mainArt');
const rotateToggle = document.getElementById('rotateToggle');
const rotateRange = document.getElementById('rotateRange');
const viewCount = document.getElementById('viewCount');
const buttons = document.querySelectorAll('.view-menu button');
let rotating = true;
let angle = 0;
let currentView = 1;

artWrap.classList.add('rotating');

rotateToggle.addEventListener('click', () => {
  rotating = !rotating;
  rotateToggle.textContent = rotating ? 'ON' : 'OFF';
  artWrap.classList.toggle('rotating', rotating);
});

rotateRange.addEventListener('input', (e) => {
  artWrap.classList.remove('rotating');
  rotating = false;
  rotateToggle.textContent = 'OFF';
  angle = e.target.value;
  mainArt.style.transform = `rotateY(${angle}deg)`;
});

buttons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentView = index + 1;
    viewCount.textContent = `${currentView} / 6`;
    const transforms = [
      'rotateY(-28deg) scale(.96)',
      'rotateY(0deg) scale(1)',
      'rotateY(28deg) scale(.96)',
      'rotateY(180deg) scale(.92)',
      'rotateX(18deg) scale(.94)',
      'scale(1.22)'
    ];
    artWrap.classList.remove('rotating');
    rotating = false;
    rotateToggle.textContent = 'OFF';
    mainArt.style.transform = transforms[index];
  });
});

document.getElementById('nextView').addEventListener('click', () => {
  currentView = currentView >= 6 ? 1 : currentView + 1;
  buttons[currentView - 1].click();
});

document.getElementById('prevView').addEventListener('click', () => {
  currentView = currentView <= 1 ? 6 : currentView - 1;
  buttons[currentView - 1].click();
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
});

document.getElementById('soundBtn').addEventListener('click', (e) => {
  e.target.textContent = e.target.textContent === '🔈' ? '🔇' : '🔈';
});

let dragging = false;
let startX = 0;
let startAngle = 0;
artWrap.addEventListener('mousedown', (e) => {
  dragging = true;
  startX = e.clientX;
  startAngle = angle;
  artWrap.style.cursor = 'grabbing';
  artWrap.classList.remove('rotating');
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  angle = Number(startAngle) + (e.clientX - startX) * 0.7;
  mainArt.style.transform = `rotateY(${angle}deg)`;
  rotateRange.value = ((angle % 360) + 360) % 360;
  rotating = false;
  rotateToggle.textContent = 'OFF';
});
window.addEventListener('mouseup', () => {
  dragging = false;
  artWrap.style.cursor = 'grab';
});
