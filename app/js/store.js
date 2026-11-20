// Progress, notes and settings, saved in localStorage and exportable.
// Nothing here leaves the browser: export writes a file the player keeps.
import { STORAGE_KEY } from './config.js';

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: [], notes: {}, spoiler: true, theme: 'paper' };
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      spoiler: parsed.spoiler !== false,
      theme: parsed.theme === 'night' ? 'night' : 'paper',
    };
  } catch {
    return { earned: [], notes: {}, spoiler: true, theme: 'paper' };
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createStore() {
  const state = readState();
  const earned = new Set(state.earned);
  const notes = { ...state.notes };

  return {
    earned,
    notes,
    get spoiler() { return state.spoiler; },
    get theme() { return state.theme; },
    isEarned(id) { return earned.has(id); },
    toggleEarned(id) {
      if (earned.has(id)) earned.delete(id);
      else earned.add(id);
      this.save();
    },
    setNote(id, text) {
      if (text.trim()) notes[id] = text;
      else delete notes[id];
      this.save();
    },
    getNote(id) { return notes[id] || ''; },
    setSpoiler(on) { state.spoiler = !!on; this.save(); },
    setTheme(theme) { state.theme = theme === 'night' ? 'night' : 'paper'; this.save(); },
    save() {
      writeState({ earned: [...earned], notes, spoiler: state.spoiler, theme: state.theme });
    },
    exportFile() {
      const blob = new Blob(
        [JSON.stringify({ earned: [...earned], notes }, null, 2)],
        { type: 'application/json' },
      );
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'leonida-platinum-progress.json';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    async importFile(file) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.earned)) throw new Error('no earned list in file');
      earned.clear();
      for (const id of parsed.earned) if (typeof id === 'number') earned.add(id);
      if (parsed.notes && typeof parsed.notes === 'object') {
        for (const key of Object.keys(notes)) delete notes[key];
        Object.assign(notes, parsed.notes);
      }
      this.save();
    },
    resetAll() {
      earned.clear();
      for (const key of Object.keys(notes)) delete notes[key];
      this.save();
    },
  };
}
