// Leonida Platinum Guide — boot, hash routing, keyboard shortcuts.
// Routes: #/ checklist, #/trophy/<id> guide page, #/roadmap, #/missables,
// #/planner, #/settings. The header always shows the earned count.
import { APP_NAME } from './config.js';
import { loadTrophies } from './data.js';
import { createStore } from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderSettings } from './views/settings.js';

const store = createStore();
document.documentElement.dataset.theme = store.theme;

const view = document.getElementById('view');
const headerCount = document.getElementById('header-count');
const navLinks = [...document.querySelectorAll('nav a')];

let trophies = [];

function renderHeader() {
  const got = store.earned.size;
  headerCount.textContent = `${got} / ${trophies.length} earned`;
  headerCount.classList.toggle('done', got === trophies.length && trophies.length > 0);
}

function rerender() {
  renderHeader();
  route();
}

function route() {
  const hash = location.hash || '#/';
  const ctx = { trophies, store, rerender };
  for (const a of navLinks) a.classList.toggle('active', a.getAttribute('href') === hash);
  if (hash.startsWith('#/trophy/')) {
    const id = Number(hash.slice('#/trophy/'.length));
    renderDetail(view, ctx, id);
  } else if (hash === '#/roadmap') {
    renderRoadmap(view, ctx);
  } else if (hash === '#/missables') {
    renderMissables(view, ctx);
  } else if (hash === '#/planner') {
    renderPlanner(view, ctx);
  } else if (hash === '#/settings') {
    renderSettings(view, ctx);
  } else {
    renderChecklist(view, ctx);
  }
  renderHeader();
  window.scrollTo(0, 0);
}

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === '/') {
    e.preventDefault();
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    const q = document.getElementById('q');
    if (q) q.focus();
  } else if (e.key === 't') {
    const next = store.theme === 'night' ? 'paper' : 'night';
    store.setTheme(next);
    document.documentElement.dataset.theme = next;
  } else if (e.key === 'e') {
    store.exportFile();
  }
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = store.theme === 'night' ? 'paper' : 'night';
  store.setTheme(next);
  document.documentElement.dataset.theme = next;
});

loadTrophies().then((list) => {
  trophies = list;
  document.title = `${APP_NAME} — GTA 6 trophy guide & tracker`;
  window.addEventListener('hashchange', route);
  route();
});
