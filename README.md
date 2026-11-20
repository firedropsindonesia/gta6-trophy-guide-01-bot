[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/firedropsindonesia/gta6-trophy-guide-01-bot/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/firedropsindonesia/gta6-trophy-guide-01-bot/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum Guide — GTA 6 trophy guide & tracker

An offline web app that guides and tracks all **55 PlayStation 5 trophies of Grand Theft Auto VI** (1 platinum, 2 gold, 6 silver, 46 bronze), built for the make.fun bounty **gta6-trophy-guide-01** ($250, 50 places; entries close 21 Nov 2026 18:00 WIB).

## What it is

- **Tracker** — checklist of all 55 trophies with official name, description and grade; progress saved in localStorage; export progress to a file and import it back; per-trophy notes; keyboard shortcuts (`/` search, `t` theme, `e` export); search box.
- **Filters** — by grade, by kind (story, missable, collectibles, activities, combat, exploration, money), by earned/unearned, plus text search.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned ("Hidden story trophy — earn it to reveal").
- **Guide pane** — click a trophy for its full guide in our own words, its steps, its sources, its missable note, its roadmap stage and its PSN count where the list has one.
- **Roadmap** — the platinum route in six stages with per-stage trophy lists and progress counters.
- **Missables page** — every flagged trophy, why it is flagged, and when to do it.
- **Next up planner** — the next 3 unearned trophies from the current roadmap stage.
- **Progress counters everywhere** — total earned / 55 in the header, per grade, per roadmap stage, per kind.
- **Two themes** — light "paper" (#f6f3ee) and dark "night" (#0f1218), one coral accent each; system sans body, serif display titles.

## How to run

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open http://localhost:8080 in desktop Chrome. It works with the network off: every file the app loads is under `app/`, and it makes no network request at runtime.

To hand the entry in (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `buildDossier` library. Run it twice — the outputs must be byte-identical.

## How the guides, sources and missables were derived

- **The list** is the official PlayStation list as Exophase and PSNProfiles published it before the bounty opened: all 55 names, descriptions and grades exactly as published (including "T**s Ass Drug Money").
- **Every guide is in our own words, written for this entry**, and cites its sources per trophy: the official list on Exophase (name, description, grade), PSNProfiles (PSN count where the list has one), and "our own advice, derived from the official description only — not yet checked in the game".
- **Honesty rule:** the game released 19 Nov 2026 and nobody on this team has played it. Where a place or step is not pinned down by the official description, the guide says so plainly instead of inventing one. The only counts used are the ones the official descriptions state (42 Shooting Range challenges, 14 Top Fun drone locations, 18 meditation spots, 52 Leonida areas, 9 gangs, 8 garage properties, 9 activity types, 250 stunts, 100 vehicles, 100 WAiNK locations, 50 challenges, 3 card sets, 20 races, 10 Scooter Bros vehicles, $250,000 marked bills, $100,000 shop spend, 500 choices).
- **Missable flags** come from the official descriptions alone: a trophy is flagged only when its description ties it to a one-time story moment or a finite character strand (chapter completions, named single missions, "final mission for X" strands) — 17 trophies. Collectibles and grinds are never flagged.
- **Roadmap:** story chapters first, then character strands, then activities, then collectibles/exploration, then money/crime, then cleanup and grind — 100% completion last, platinum last.
- No Rockstar logo, no official artwork, no game screenshots, no copied guide text.

## Layout

```
main.ts                  entry program (Node 22, stdlib only)
serve.ts                 local static server for app/
app/index.html           page shell
app/js/main.js           boot, routing, keyboard shortcuts
app/js/config.js         names the parts; stages, kinds, source links
app/js/data.js           loads app/data/trophies.json
app/js/store.js          localStorage progress, export/import, notes
app/js/filters.js        grade/kind/earned/search + spoiler rule
app/js/views/            checklist, detail, roadmap, missables, planner, settings, marks
app/css/base.css         layout
app/css/theme.css        paper / night themes
app/data/trophies.json   all 55 trophies + guides, sources, steps
screenshots/            4 real browser renders (1280×800 JPEG), taken by tools/shots.mjs
                     with Playwright Chromium and progress seeded to 13 of 55 earned:
                     1-checklist.jpg (checklist + filters + progress),
                     2-guide.jpg (trophy guide detail, sources visible),
                     3-roadmap.jpg (roadmap to the platinum),
                     4-missables.jpg (missables page)
vendor/makefun-frontend.ts  kit's dossier library, unchanged
```

## License

MIT — see LICENSE.
