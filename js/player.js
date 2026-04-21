import { GROUND_Y, GRAVITY, SPRITES } from "./config.js";

export class Player {
  constructor(kind, image) {
    this.kind = kind;
    this.spriteDef = SPRITES[kind];
    this.image = image;
    this.x = 42;
    this.baseW = 24;
    this.baseH = 24;
    this.width = this.baseW;
    this.height = this.baseH;
    this.y = GROUND_Y - this.height;
    this.vy = 0;
    this.ducking = false;
    this.dead = false;
    this.animTimer = 0;
    this.animIndex = 0;
  }

  onGround() {
    return this.y >= GROUND_Y - this.height - 0.01;
  }

  jump() {
    if (!this.dead && this.onGround()) {
      this.vy = -560;
    }
  }

  setDuck(on) {
    this.ducking = on && this.onGround() && !this.dead;
    if (this.ducking) {
      this.height = 20;
      this.width = 28;
      this.y = GROUND_Y - this.height;
    } else {
      this.height = this.baseH;
      this.width = this.baseW;
      this.y = Math.min(this.y, GROUND_Y - this.height);
    }
  }

  die() {
    this.dead = true;
    this.setDuck(false);
  }

  update(dt, speed) {
    if (!this.dead) {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y > GROUND_Y - this.height) {
        this.y = GROUND_Y - this.height;
        this.vy = 0;
      }
    }

    this.animTimer += dt * (0.7 + speed / 200);
    if (this.animTimer >= 0.15) {
      this.animTimer = 0;
      this.animIndex = (this.animIndex + 1) % 3;
    }
  }

  getHitbox() {
    const padX = this.ducking ? 6 : 5;
    const padY = this.ducking ? 3 : 2;
    return {
      x: this.x + padX,
      y: this.y + padY,
      w: this.width - padX * 2,
      h: this.height - padY * 2
    };
  }

  currentFrame() {
    const frames = this.spriteDef.frames;
    if (this.dead) return frames.gameOver;
    if (!this.onGround()) return frames.jump;
    if (this.ducking) return frames.duck;
    return frames.run[this.animIndex] || frames.idle;
  }

  draw(ctx) {
    const frame = this.currentFrame();
    ctx.drawImage(
      this.image,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      Math.round(this.x),
      Math.round(this.y),
      frame.w,
      frame.h
    );
  }
}
