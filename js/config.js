window.App = window.App || {};

App.CONFIG = {
  GAME_WIDTH: 384,
  GAME_HEIGHT: 160,
  GROUND_Y: 126,
  GRAVITY: 1800,
  // Sprite frame map: tune these rectangles to match your sheets.
  SPRITES: {
    boss: {
      label: "Boss",
      scale: 0.28,
      image: "assets/characters/boss.png",
      frames: {
        idle: { x: 10, y: 536, w: 84, h: 120 },
        run: [
          { x: 13, y: 659, w: 86, h: 126 },
          { x: 114, y: 658, w: 83, h: 127 },
          { x: 211, y: 658, w: 85, h: 127 }
        ],
        jump: { x: 584, y: 468, w: 84, h: 128 },
        duck: { x: 578, y: 664, w: 95, h: 87 },
        gameOver: { x: 476, y: 757, w: 181, h: 74 }
      }
    },
    francesco: {
      label: "Francesco",
      scale: 0.28,
      image: "assets/characters/francesco.png",
      frames: {
        idle: { x: 8, y: 538, w: 82, h: 117 },
        run: [
          { x: 12, y: 659, w: 86, h: 126 },
          { x: 112, y: 659, w: 87, h: 126 },
          { x: 212, y: 658, w: 87, h: 127 }
        ],
        jump: { x: 582, y: 467, w: 84, h: 126 },
        duck: { x: 578, y: 661, w: 94, h: 91 },
        gameOver: { x: 476, y: 758, w: 183, h: 73 }
      }
    }
  },
  OBSTACLE_TYPES: {
    invoice: { label: "Invoice", w: 12, h: 18, minScore: 0, rare: 0 },
    reminder: { label: "Reminder", w: 16, h: 13, minScore: 120, rare: 0 },
    notification: { label: "Notification", w: 14, h: 14, minScore: 220, rare: 0 },
    money: { label: "Money", w: 18, h: 11, minScore: 330, rare: 0 },
    bigInvoice: { label: "Big Invoice", w: 20, h: 30, minScore: 500, rare: 0.12 }
  }
};
