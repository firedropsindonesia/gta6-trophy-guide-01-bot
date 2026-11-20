// Medal marks: a grade's swatch, drawn in CSS, no images.
// Platinum is bright, gold is gold, silver is grey, bronze is copper.
export function mark(grade) {
  const el = document.createElement('span');
  el.className = `mark mark-${grade}`;
  el.textContent = grade === 'platinum' ? 'P' : grade === 'gold' ? 'G' : grade === 'silver' ? 'S' : 'B';
  el.title = grade;
  el.setAttribute('aria-label', `${grade} trophy`);
  return el;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}
