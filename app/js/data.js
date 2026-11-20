// Loads the trophy list and answers questions about it.
// The file is the official list with our guides attached; nothing here
// invents a trophy — the gate holds the names to the official 55.
let cache = null;

export async function loadTrophies() {
  if (cache) return cache;
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  cache = doc.trophies;
  return cache;
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function gradeCounts(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) counts[t.grade] = (counts[t.grade] || 0) + 1;
  return counts;
}

export function stageTrophies(trophies, stageId) {
  return trophies.filter((t) => t.stage === stageId);
}

export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}

export function nextStage(trophies, earned) {
  // The first roadmap stage that still has an unearned trophy.
  const stages = [...new Set(trophies.map((t) => t.stage))].sort((a, b) => a - b);
  for (const stage of stages) {
    if (trophies.some((t) => t.stage === stage && !earned.has(t.id))) return stage;
  }
  return null;
}
