// Next up: the next 3 unearned trophies from the current roadmap stage,
// plus per-stage progress so the player sees what is left everywhere.
import { STAGES } from '../config.js';
import { stageTrophies, nextStage } from '../data.js';
import { displayName } from '../filters.js';
import { mark, gradeLabel } from './marks.js';

export function renderPlanner(container, ctx) {
  const { trophies, store } = ctx;
  container.innerHTML = '';
  const stageId = nextStage(trophies, store.earned);
  if (stageId === null) {
    const done = document.createElement('p');
    done.className = 'page-intro';
    done.textContent = 'Every trophy is earned. Leonida Legend — the platinum is yours.';
    container.appendChild(done);
    return;
  }
  const stage = STAGES[stageId - 1];
  const h = document.createElement('h2');
  h.textContent = `Next up — Stage ${stage.id}: ${stage.title}`;
  const blurb = document.createElement('p');
  blurb.className = 'page-intro';
  blurb.textContent = stage.blurb;
  container.append(h, blurb);

  const upcoming = stageTrophies(trophies, stageId).filter((t) => !store.earned.has(t.id)).slice(0, 3);
  const ol = document.createElement('ol');
  ol.className = 'next-list';
  for (const t of upcoming) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#/trophy/' + t.id;
    a.appendChild(mark(t.grade));
    const name = document.createElement('span');
    name.textContent = displayName(t, store.earned, store.spoiler) +
      ` — ${gradeLabel(t.grade)}` + (t.missable ? ' · Missable — do it before its story moment passes' : '');
    a.appendChild(name);
    li.appendChild(a);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    li.appendChild(guide);
    ol.appendChild(li);
  }
  container.appendChild(ol);

  const sh = document.createElement('h2');
  sh.textContent = 'Progress by stage';
  container.appendChild(sh);
  for (const s of STAGES) {
    const list = stageTrophies(trophies, s.id);
    const got = list.filter((t) => store.earned.has(t.id)).length;
    const p = document.createElement('p');
    p.textContent = `Stage ${s.id} — ${s.title}: ${got}/${list.length} earned`;
    container.appendChild(p);
  }
}
