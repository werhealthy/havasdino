import { GAME_WIDTH, GROUND_Y, OBSTACLE_TYPES } from "./config.js";

const COLORS = {
  invoice: "#ffffff",
  reminder: "#ffe5b4",
  notification: "#f06292",
  money: "#7ac943",
  bigInvoice: "#ffcc80"
};

export class Obstacle {
  constructor(type) {
    this.type = type;
    this.x = GAME_WIDTH + 12;
    this.y = GROUND_Y - type.h;
    this.w = type.w;
    this.h = type.h;
  }

  update(dt, speed) {
    this.x -= speed * dt;
  }

  isOffscreen() {
    return this.x + this.w < -8;
  }

  getHitbox() {
    return {
      x: this.x + 2,
      y: this.y + 2,
      w: this.w - 4,
      h: this.h - 3
    };
  }

  draw(ctx) {
    const key = this.type.key;
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));
    ctx.fillStyle = COLORS[key] || "#fff";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#1f1f1f";

    if (key === "invoice" || key === "bigInvoice") {
      for (let i = 3; i < this.h - 2; i += 4) ctx.fillRect(2, i, this.w - 5, 1);
      ctx.fillRect(this.w - 4, 0, 4, 4);
    } else if (key === "reminder") {
      ctx.fillRect(0, this.h - 2, this.w, 2);
      ctx.fillRect(2, 2, this.w - 4, this.h - 6);
    } else if (key === "notification") {
      ctx.fillRect(2, 2, this.w - 4, this.h - 4);
      ctx.fillStyle = "#fff";
      ctx.fillRect(this.w / 2 - 1, 4, 2, this.h - 8);
      ctx.fillRect(this.w / 2 - 1, this.h - 3, 2, 2);
    } else if (key === "money") {
      ctx.fillStyle = "#3b6e22";
      ctx.fillRect(2, 2, this.w - 4, this.h - 4);
      ctx.fillStyle = "#c6f68d";
      ctx.fillRect(this.w / 2 - 2, 1, 4, this.h - 2);
    }

    ctx.restore();
  }
}

export function pickObstacle(score) {
  const options = [];
  for (const [key, type] of Object.entries(OBSTACLE_TYPES)) {
    if (score >= type.minScore) {
      if (type.rare && Math.random() > type.rare) continue;
      options.push({ ...type, key });
    }
  }
  const choice = options[Math.floor(Math.random() * options.length)] || {
    ...OBSTACLE_TYPES.invoice,
    key: "invoice"
  };
  return new Obstacle(choice);
}
