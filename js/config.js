export const GAME_WIDTH = 384;
export const GAME_HEIGHT = 160;
export const GROUND_Y = 126;
export const GRAVITY = 1800;

// Sprite frame map.
// NOTE: Tune coordinates/sizes if your source sheets differ.
// The game will still run and fallback to silhouette placeholders if frames are off.
export const SPRITES = {
  boss: {
    label: "Boss",
    image: "assets/characters/boss.png",
    frames: {
      idle: { x: 0, y: 0, w: 24, h: 24 },
      run: [
        { x: 24, y: 0, w: 24, h: 24 },
        { x: 48, y: 0, w: 24, h: 24 },
        { x: 72, y: 0, w: 24, h: 24 }
      ],
      jump: { x: 96, y: 0, w: 24, h: 24 },
      duck: { x: 120, y: 0, w: 28, h: 20 },
      gameOver: { x: 148, y: 0, w: 24, h: 24 }
    }
  },
  francesco: {
    label: "Francesco",
    image: "assets/characters/francesco.png",
    frames: {
      idle: { x: 0, y: 0, w: 24, h: 24 },
      run: [
        { x: 24, y: 0, w: 24, h: 24 },
        { x: 48, y: 0, w: 24, h: 24 },
        { x: 72, y: 0, w: 24, h: 24 }
      ],
      jump: { x: 96, y: 0, w: 24, h: 24 },
      duck: { x: 120, y: 0, w: 28, h: 20 },
      gameOver: { x: 148, y: 0, w: 24, h: 24 }
    }
  }
};

export const OBSTACLE_TYPES = {
  invoice: { label: "Invoice", w: 12, h: 18, minScore: 0, rare: 0 },
  reminder: { label: "Reminder", w: 16, h: 13, minScore: 120, rare: 0 },
  notification: { label: "Notification", w: 14, h: 14, minScore: 220, rare: 0 },
  money: { label: "Money", w: 18, h: 11, minScore: 330, rare: 0 },
  bigInvoice: { label: "Big Invoice", w: 20, h: 30, minScore: 500, rare: 0.12 }
};
