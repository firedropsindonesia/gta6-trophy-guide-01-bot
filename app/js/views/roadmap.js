// The roadmap to the platinum: six stages in order, each with its
// trophies, its progress counter and its own blurb. Built from the
// official descriptions — story first, cleanup last.
import { STAGES, KINDS } from '../config.js';
import { stageTrophies } from '../data.js';
import { displayName, isSpoilerHidden } from '../filters.js';
import { mark, gradeLabel } from './marks.js';

export function renderRoadmap(container, ctx) {
  const { trophies, store } = ctx;
  container.innerHTML = '';
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = 'The platinum route in six stages, built from the official descriptions: story chapters first, then character strands, then activities, then collectibles and exploration, then money and crime, then cleanup — 100% completion last, platinum last.';
  container.appendChild(intro);

  for (const stage of STAGES) {
    const list = stageTrophies(trophies, stage.id);
    const got = list.filter((t) => store.earned.has(t.id)).length;
    const section = document.createElement('section');
    section.className = 'stage';
    const h = document.createElement('h2');
    h.textContent = `Stage ${stage.id} — ${stage.title} (${got}/${list.length} earned)`;
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = list.length ? `${Math.round((got / list.length) * 100)}%` : '0%';
    bar.appendChild(fill);
    section.append(h, blurb, bar);
    const ul = document.createElement('ul');
    ul.className = 'stage-list';
    for (const t of list) {
      const li = document.createElement('li');
      li.className = store.earned.has(t.id) ? 'earned' : '';
      const a = document.createElement('a');
      a.href = '#/trophy/' + t.id;
      a.appendChild(mark(t.grade));
      const name = document.createElement('span');
      name.textContent = (store.earned.has(t.id) ? '✓ ' : '') +
        displayName(t, store.earned, store.spoiler) +
        ` — ${gradeLabel(t.grade)} · ${KINDS[t.kind]}` +
        (t.missable ? ' · Missable' : '');
      a.appendChild(name);
      li.appendChild(a);
      ul.appendChild(li);
    }
    section.appendChild(ul);
    container.appendChild(section);
  }
}
