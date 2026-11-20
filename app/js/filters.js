// Filtering and the spoiler rule, kept apart from the views so every
// list on every page filters the same way.
export function applyFilters(trophies, { grade = 'all', kind = 'all', earned = 'all', query = '', earnedSet = new Set() } = {}) {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind === 'missable' && !t.missable) return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (earned === 'earned' && !earnedSet.has(t.id)) return false;
    if (earned === 'unearned' && earnedSet.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// The spoiler rule: a story trophy whose name and description stay hidden
// until it is earned, when the spoiler setting is on.
export function isSpoilerHidden(trophy, earnedSet, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !earnedSet.has(trophy.id);
}

export function displayName(trophy, earnedSet, spoilerOn) {
  return isSpoilerHidden(trophy, earnedSet, spoilerOn)
    ? 'Hidden story trophy'
    : trophy.name;
}

export function displayDescription(trophy, earnedSet, spoilerOn) {
  return isSpoilerHidden(trophy, earnedSet, spoilerOn)
    ? 'Hidden story trophy — earn it to reveal.'
    : trophy.description;
}
