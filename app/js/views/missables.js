// The missables page: every flagged trophy, why it is flagged, and
// when to do it — with the derivation rule stated, not assumed.
import { MISSABLE_RULE } from '../config.js';
import { missableTrophies } from '../data.js';
import { displayName } from '../filters.js';
import { mark, gradeLabel } from './marks.js';

export function renderMissables(container, ctx) {
  const { trophies, store } = ctx;
  const flagged = missableTrophies(trophies);
  container.innerHTML = '';
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = `${flagged.length} missable trophies. ` + MISSABLE_RULE;
  container.appendChild(intro);

  const got = flagged.filter((t) => store.earned.has(t.id)).length;
  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = `${got} of ${flagged.length} missables earned. Do the rest before their story moment passes — once a chapter closes or a strand ends, there is no replay in the same playthrough.`;
  container.appendChild(summary);

  const ul = document.createElement('ul');
  ul.className = 'missable-list';
  for (const t of flagged) {
    const li = document.createElement('li');
    li.className = store.earned.has(t.id) ? 'earned' : '';
    const a = document.createElement('a');
    a.href = '#/trophy/' + t.id;
    a.appendChild(mark(t.grade));
    const name = document.createElement('span');
    name.textContent = (store.earned.has(t.id) ? '✓ ' : '') + displayName(t, store.earned, store.spoiler) +
      ` — ${gradeLabel(t.grade)}`;
    a.appendChild(name);
    const why = document.createElement('p');
    why.textContent = t.missableNote + ' Official description: “' + t.description + '”';
    li.append(a, why);
    ul.appendChild(li);
  }
  container.appendChild(ul);
}
