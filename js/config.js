window.App = window.App || {};

App.CONFIG = {
  GAME_WIDTH: 384,
  GAME_HEIGHT: 160,
  GROUND_Y: 126,
  GRAVITY: 1800,

  SPRITES: {
    boss: {
      label: "Boss",
      scale: 0.28,
      image: "assets/player 1.png", // <-- il tuo file
      width: 96,   // dimensione originale immagine (modifica se serve)
      height: 128
    },

    francesco: {
      label: "Francesco",
      scale: 0.28,
      image: "assets/player 2.png", // <-- secondo personaggio
      width: 96,
      height: 128
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
