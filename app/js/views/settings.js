// Settings: theme, spoilers, export/import, reset — and the honesty
// note about where the guides' facts come from.
import { HONEST_NOTE, SOURCE_LINKS } from '../config.js';

export function renderSettings(container, ctx) {
  const { store } = ctx;
  container.innerHTML = '';

  const h = document.createElement('h2');
  h.textContent = 'Settings';
  container.appendChild(h);

  const themeLabel = document.createElement('label');
  themeLabel.className = 'setting-row';
  themeLabel.textContent = 'Theme ';
  const themeSel = document.createElement('select');
  themeSel.innerHTML = '<option value="paper">Paper (light)</option><option value="night">Night (dark)</option>';
  themeSel.value = store.theme;
  themeSel.addEventListener('change', () => {
    store.setTheme(themeSel.value);
    document.documentElement.dataset.theme = store.theme;
  });
  themeLabel.appendChild(themeSel);
  container.appendChild(themeLabel);

  const spoilerLabel = document.createElement('label');
  spoilerLabel.className = 'setting-row';
  const spoilerBox = document.createElement('input');
  spoilerBox.type = 'checkbox';
  spoilerBox.checked = store.spoiler;
  spoilerBox.addEventListener('change', () => store.setSpoiler(spoilerBox.checked));
  spoilerLabel.append(spoilerBox, document.createTextNode(' Spoilers off — hide the names and descriptions of story trophies until they are earned'));
  container.appendChild(spoilerLabel);

  const exp = document.createElement('button');
  exp.type = 'button';
  exp.textContent = 'Export progress';
  exp.addEventListener('click', () => store.exportFile());
  container.appendChild(exp);

  const impLabel = document.createElement('label');
  impLabel.className = 'import-btn';
  impLabel.textContent = 'Import progress ';
  const imp = document.createElement('input');
  imp.type = 'file';
  imp.accept = 'application/json';
  imp.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await store.importFile(file);
      ctx.rerender();
    } catch {
      alert('That file is not a progress export from this guide.');
    }
    e.target.value = '';
  });
  impLabel.appendChild(imp);
  container.appendChild(impLabel);

  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'danger';
  reset.textContent = 'Reset all progress and notes';
  reset.addEventListener('click', () => {
    if (confirm('Clear every earned tick and every note?')) {
      store.resetAll();
      ctx.rerender();
    }
  });
  container.appendChild(reset);

  const about = document.createElement('h2');
  about.textContent = 'About this guide';
  container.appendChild(about);
  const p = document.createElement('p');
  p.textContent = 'Leonida Platinum Guide covers all 55 PlayStation 5 trophies of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver, 46 bronze — with the official name, description and grade of each, a guide in our own words that cites its sources, a roadmap to the platinum and the missable trophies flagged, built from the official descriptions. Progress is saved in your browser and can be exported and imported. The app works offline and makes no network request at run time.';
  container.appendChild(p);
  const honest = document.createElement('p');
  honest.className = 'honest';
  honest.textContent = HONEST_NOTE;
  container.appendChild(honest);
  const src = document.createElement('p');
  src.className = 'source-links';
  src.innerHTML = `Official list: <a href="${SOURCE_LINKS.exophase}">Exophase</a> · <a href="${SOURCE_LINKS.psnprofiles}">PSNProfiles</a>`;
  container.appendChild(src);
}
