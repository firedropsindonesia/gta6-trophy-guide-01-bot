// The checklist: every trophy, a tick box, and a guide pane beside it.
// Clicking a row opens its guide in the side pane; ticking it earns it.
import { GRADES, KINDS, STAGES } from '../config.js';
import { applyFilters, displayName, displayDescription, isSpoilerHidden } from '../filters.js';
import { mark, gradeLabel } from './marks.js';

export function renderChecklist(container, ctx) {
  const { trophies, store } = ctx;
  const state = { grade: 'all', kind: 'all', earned: 'all', query: '' };
  let selectedId = null;

  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'checklist-wrap';

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.innerHTML = `
    <input type="search" id="q" placeholder="Search trophies, descriptions, guides…" aria-label="Search trophies">
    <label>Grade <select id="grade"><option value="all">All grades</option>${GRADES.map((g) => `<option value="${g}">${gradeLabel(g)}</option>`).join('')}</select></label>
    <label>Kind <select id="kind"><option value="all">All kinds</option><option value="missable">Missable</option>${Object.entries(KINDS).filter(([k]) => k !== 'missable').map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
    <label>Progress <select id="earned"><option value="all">All</option><option value="earned">Earned</option><option value="unearned">Unearned</option></select></label>
    <label class="spoiler-toggle"><input type="checkbox" id="spoiler"> Spoilers off</label>
    <button id="export" type="button">Export progress</button>
    <label class="import-btn">Import progress <input id="import" type="file" accept="application/json"></label>
  `;
  wrap.appendChild(toolbar);

  const summary = document.createElement('p');
  summary.className = 'summary';
  wrap.appendChild(summary);

  const columns = document.createElement('div');
  columns.className = 'columns';
  const list = document.createElement('div');
  list.className = 'trophy-list';
  list.setAttribute('role', 'list');
  const pane = document.createElement('aside');
  pane.className = 'guide-pane';
  pane.innerHTML = '<p class="pane-hint">Click a trophy to read its guide, sources and missable note here.</p>';
  columns.appendChild(list);
  columns.appendChild(pane);
  wrap.appendChild(columns);
  container.appendChild(wrap);

  const q = toolbar.querySelector('#q');
  const gradeSel = toolbar.querySelector('#grade');
  const kindSel = toolbar.querySelector('#kind');
  const earnedSel = toolbar.querySelector('#earned');
  const spoilerBox = toolbar.querySelector('#spoiler');
  spoilerBox.checked = store.spoiler;

  function updateHeader() {
    const headerCount = document.getElementById('header-count');
    if (!headerCount) return;
    headerCount.textContent = `${store.earned.size} / ${trophies.length} earned`;
    headerCount.classList.toggle('done', store.earned.size === trophies.length);
  }

  function refresh() {
    const filtered = applyFilters(trophies, { ...state, earnedSet: store.earned });
    const earnedCount = store.earned.size;
    summary.textContent = `${earnedCount} of ${trophies.length} earned — showing ${filtered.length} trophies. ` +
      GRADES.map((g) => {
        const total = trophies.filter((t) => t.grade === g).length;
        const got = trophies.filter((t) => t.grade === g && store.earned.has(t.id)).length;
        return `${gradeLabel(g)} ${got}/${total}`;
      }).join(' · ');
    list.replaceChildren();
    for (const t of filtered) {
      const row = document.createElement('div');
      row.className = 'trophy-row' + (store.earned.has(t.id) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
      row.setAttribute('role', 'listitem');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = store.earned.has(t.id);
      box.setAttribute('aria-label', `Earned: ${t.name}`);
      box.addEventListener('change', () => {
        store.toggleEarned(t.id);
        refresh();
        updateHeader();
        if (selectedId === t.id) showGuide(t);
      });
      const body = document.createElement('button');
      body.type = 'button';
      body.className = 'trophy-body';
      const name = document.createElement('span');
      name.className = 'trophy-name';
      name.textContent = displayName(t, store.earned, store.spoiler);
      const desc = document.createElement('span');
      desc.className = 'trophy-desc';
      desc.textContent = displayDescription(t, store.earned, store.spoiler);
      const tags = document.createElement('span');
      tags.className = 'trophy-tags';
      tags.textContent = `${gradeLabel(t.grade)} · ${KINDS[t.kind]} · Stage ${t.stage}` +
        (t.missable ? ' · Missable' : '') + (t.count ? ` · PSN count ${t.count}` : '');
      body.append(name, desc, tags);
      body.addEventListener('click', () => { selectedId = t.id; showGuide(t); refresh(); });
      row.append(mark(t.grade), box, body);
      list.appendChild(row);
    }
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'No trophies match these filters.';
      list.appendChild(empty);
    }
  }

  function showGuide(t) {
    pane.replaceChildren();
    const hidden = isSpoilerHidden(t, store.earned, store.spoiler);
    const title = document.createElement('h2');
    title.textContent = hidden ? 'Hidden story trophy' : t.name;
    const meta = document.createElement('p');
    meta.className = 'guide-meta';
    meta.textContent = `${gradeLabel(t.grade)} · ${KINDS[t.kind]} · Roadmap stage ${t.stage} — ${STAGES[t.stage - 1].title}` +
      (t.count ? ` · PSN count ${t.count}` : '') + (t.missable ? ' · Missable' : '');
    pane.append(title, meta);
    if (t.missable && t.missableNote) {
      const note = document.createElement('p');
      note.className = 'missable-note';
      note.textContent = 'Missable: ' + t.missableNote;
      pane.appendChild(note);
    }
    if (hidden) {
      const p = document.createElement('p');
      p.textContent = 'Spoilers are off: the name, description and guide of this story trophy stay hidden until you earn it. Tick it off in the checklist to reveal it.';
      pane.appendChild(p);
      return;
    }
    const desc = document.createElement('p');
    desc.className = 'official-desc';
    desc.textContent = 'Official description: “' + t.description + '”';
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = t.guide;
    pane.append(desc, guide);
    if (t.steps && t.steps.length) {
      const h = document.createElement('h3');
      h.textContent = 'Steps';
      const ol = document.createElement('ol');
      for (const s of t.steps) {
        const li = document.createElement('li');
        li.textContent = s;
        ol.appendChild(li);
      }
      pane.append(h, ol);
    }
    const sh = document.createElement('h3');
    sh.textContent = 'Sources';
    const ul = document.createElement('ul');
    for (const s of t.sources) {
      const li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    }
    pane.append(sh, ul);
    const links = document.createElement('p');
    links.className = 'source-links';
    links.innerHTML = 'Official list: <a href="https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/">Exophase</a> · <a href="https://psnprofiles.com/trophies/43531-grand-theft-auto-vi">PSNProfiles</a>';
    pane.appendChild(links);
    const open = document.createElement('a');
    open.className = 'button-link';
    open.href = '#/trophy/' + t.id;
    open.textContent = 'Open full guide page →';
    pane.appendChild(open);
  }

  q.addEventListener('input', () => { state.query = q.value; refresh(); });
  gradeSel.addEventListener('change', () => { state.grade = gradeSel.value; refresh(); });
  kindSel.addEventListener('change', () => { state.kind = kindSel.value; refresh(); });
  earnedSel.addEventListener('change', () => { state.earned = earnedSel.value; refresh(); });
  spoilerBox.addEventListener('change', () => { store.setSpoiler(spoilerBox.checked); refresh(); });
  toolbar.querySelector('#export').addEventListener('click', () => store.exportFile());
  toolbar.querySelector('#import').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await store.importFile(file);
      refresh();
    } catch {
      alert('That file is not a progress export from this guide.');
    }
    e.target.value = '';
  });

  refresh();
}
