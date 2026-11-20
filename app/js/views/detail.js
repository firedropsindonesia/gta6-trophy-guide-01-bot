// One trophy's full guide page: the guide, its steps, its sources,
// its missable note, its roadmap stage and its PSN count, plus notes.
import { GRADES, KINDS, STAGES, HONEST_NOTE } from '../config.js';
import { displayName, displayDescription, isSpoilerHidden } from '../filters.js';
import { mark, gradeLabel } from './marks.js';

export function renderDetail(container, ctx, id) {
  const { trophies, store } = ctx;
  const t = trophies.find((x) => x.id === id);
  container.innerHTML = '';
  if (!t) {
    const p = document.createElement('p');
    p.textContent = 'No trophy with that number. Back to the checklist.';
    const a = document.createElement('a');
    a.href = '#/';
    a.textContent = '← Checklist';
    container.append(p, a);
    return;
  }
  const hidden = isSpoilerHidden(t, store.earned, store.spoiler);
  const wrap = document.createElement('article');
  wrap.className = 'detail';

  const back = document.createElement('a');
  back.href = '#/';
  back.textContent = '← All trophies';
  wrap.appendChild(back);

  const head = document.createElement('div');
  head.className = 'detail-head';
  head.appendChild(mark(t.grade));
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : t.name;
  head.appendChild(title);
  wrap.appendChild(head);

  const meta = document.createElement('p');
  meta.className = 'guide-meta';
  meta.textContent = `${gradeLabel(t.grade)} · ${KINDS[t.kind]} · Roadmap stage ${t.stage} — ${STAGES[t.stage - 1].title}` +
    (t.count ? ` · PSN count ${t.count}` : '') + (t.missable ? ' · Missable' : '');
  wrap.appendChild(meta);

  const earnedBtn = document.createElement('button');
  earnedBtn.type = 'button';
  earnedBtn.textContent = store.earned.has(t.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  earnedBtn.addEventListener('click', () => {
    store.toggleEarned(t.id);
    ctx.rerender();
  });
  wrap.appendChild(earnedBtn);

  if (t.missable && t.missableNote) {
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = 'Missable: ' + t.missableNote;
    wrap.appendChild(note);
  }
  if (hidden) {
    const p = document.createElement('p');
    p.textContent = 'Spoilers are off: the name, description and guide of this story trophy stay hidden until you earn it. Tick it off in the checklist to reveal it.';
    wrap.appendChild(p);
    container.appendChild(wrap);
    return;
  }

  const desc = document.createElement('p');
  desc.className = 'official-desc';
  desc.textContent = 'Official description: “' + t.description + '”';
  wrap.appendChild(desc);

  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = t.guide;
  wrap.appendChild(guide);

  if (t.steps && t.steps.length) {
    const h = document.createElement('h3');
    h.textContent = 'Steps';
    const ol = document.createElement('ol');
    for (const s of t.steps) {
      const li = document.createElement('li');
      li.textContent = s;
      ol.appendChild(li);
    }
    wrap.append(h, ol);
  }

  const sh = document.createElement('h3');
  sh.textContent = 'Sources';
  const ul = document.createElement('ul');
  for (const s of t.sources) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.appendChild(li);
  }
  wrap.append(sh, ul);
  const links = document.createElement('p');
  links.className = 'source-links';
  links.innerHTML = 'Official list: <a href="https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/">Exophase</a> · <a href="https://psnprofiles.com/trophies/43531-grand-theft-auto-vi">PSNProfiles</a>';
  wrap.appendChild(links);

  const honest = document.createElement('p');
  honest.className = 'honest';
  honest.textContent = HONEST_NOTE;
  wrap.appendChild(honest);

  const nh = document.createElement('h3');
  nh.textContent = 'Your notes';
  const noteBox = document.createElement('textarea');
  noteBox.rows = 3;
  noteBox.placeholder = 'Your own note for this trophy — saved in your browser.';
  noteBox.value = store.getNote(t.id);
  noteBox.addEventListener('input', () => store.setNote(t.id, noteBox.value));
  wrap.append(nh, noteBox);

  const nav = document.createElement('p');
  nav.className = 'detail-nav';
  const prev = trophies.find((x) => x.id === id - 1);
  const next = trophies.find((x) => x.id === id + 1);
  if (prev) {
    const a = document.createElement('a');
    a.href = '#/trophy/' + prev.id;
    a.textContent = '← ' + prev.name;
    nav.appendChild(a);
  }
  if (next) {
    const a = document.createElement('a');
    a.href = '#/trophy/' + next.id;
    a.textContent = next.name + ' →';
    nav.appendChild(a);
  }
  wrap.appendChild(nav);
  container.appendChild(wrap);
}
