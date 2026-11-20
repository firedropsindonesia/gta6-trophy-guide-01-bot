// Leonida Platinum Guide — the parts, named in one place.
// The stages are the platinum route, built from the official descriptions:
// story chapters first, then character strands, then activities,
// then collectibles and exploration, then money and crime, then cleanup.
export const APP_NAME = 'Leonida Platinum Guide';
export const STORAGE_KEY = 'leonida-platinum-guide-v1';

export const STAGES = [
  { id: 1, title: 'Story chapters', blurb: 'The four chapters and the named story missions, in order. Every one of these is a one-time story moment — finish them as they come.' },
  { id: 2, title: 'Character strands', blurb: 'The final mission for each stranger — Andy, Kenton, Billy, Randy, Tyrone — plus the eight stranger strands. A strand ends when its final mission is done.' },
  { id: 3, title: 'Activities & combat', blurb: 'The range, the races, the stunts, the challenges and the combat feats. Grindable, repeatable, and best done while the story is still running.' },
  { id: 4, title: 'Collectibles & exploration', blurb: 'Cards, WAiNK spots, vehicles, animals and the 52 areas of Leonida. Slow hunts — pair them with the story so you are not backtracking at the end.' },
  { id: 5, title: 'Money & crime', blurb: 'Robberies, vaults, gangs, laundering and shopping. This stage needs cash flowing, so it comes after the story pays out.' },
  { id: 6, title: 'Cleanup & platinum', blurb: '100% completion last, platinum last. The final sweep of whatever the checklist still shows unearned.' },
];

export const KINDS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  combat: 'Combat',
  exploration: 'Exploration',
  money: 'Money',
};

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export const SOURCE_LINKS = {
  exophase: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  psnprofiles: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
};

export const MISSABLE_RULE =
  'A trophy is flagged missable only when its official description ties it to a one-time story moment or a finite character strand — chapter completions, named single missions, and "final mission for X" strands. Collectibles and grinds are never flagged.';

export const HONEST_NOTE =
  'Grand Theft Auto VI released 19 Nov 2026 and nobody on this team has played it. Where a place or step is not pinned down by the official description, the guide says so plainly instead of inventing one. The only counts used are the ones the official descriptions state.';
