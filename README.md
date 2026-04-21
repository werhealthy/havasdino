# Invoice Escape Runner

A small pixel-art endless runner inspired by Chrome Dino, with a satirical office/freelance theme: run forever while dodging invoices, reminders, and notifications.

## How to run

### Option 1: Open directly
Open `index.html` in a modern browser.

### Option 2: Local server (recommended)
From the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Controls

- `Space` / `ArrowUp`: jump
- `ArrowDown`: duck
- On game over, `Space` or `Enter`: restart
- In menu, click character button to start

## File structure

```text
.
├── index.html
├── style.css
├── README.md
└── js/
    ├── main.js        # bootstrap, input wiring, game loop (non-module scripts)
    ├── game.js        # state machine, update/render orchestration
    ├── player.js      # player movement, animation state, hitbox
    ├── obstacle.js    # obstacle generation, rendering, hitboxes
    ├── assets.js      # sprite loading + fallback handling
    └── config.js      # resolution, physics, sprite frame map
```

## Where to edit sprite coordinates

All sprite frame rectangles are centralized in:

- `js/config.js` → `SPRITES`

Each character has explicit rectangles for:

- `idle`
- `run` (three frames)
- `jump`
- `duck`
- `gameOver`

If your sheets use different coordinates, only update those rectangles.

## How to add more obstacles

1. Add a new obstacle type in `js/config.js` under `OBSTACLE_TYPES` with:
   - size (`w`, `h`)
   - unlock score (`minScore`)
   - optional rarity gate (`rare`)
2. Add its pixel drawing logic in `js/obstacle.js` inside `Obstacle.draw()`.
3. Optionally tune collision forgiveness in `Obstacle.getHitbox()`.

## How to replace character assets

1. Replace files in:
   - `assets/characters/boss.png`
   - `assets/characters/francesco.png`
2. Keep the same file names, or update paths in `js/config.js`.
3. Adjust frame rectangles in `js/config.js` (`SPRITES`) to match the new sheet layout.

## Notes

- Internal game resolution is fixed (`384x160`) and scaled with crisp pixel rendering.
- Gameplay loop is delta-time based and separated into `update()` and `render()`.
- `best` score persists in `localStorage`.
- Audio hooks are stubbed in `js/main.js` for future sound effects.
