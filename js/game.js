window.App = window.App || {};

(function () {
  const { GAME_HEIGHT, GAME_WIDTH, GROUND_Y, SPRITES } = App.CONFIG;
  const BEST_KEY = "invoice_escape_best";

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function getBestScore() {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch {
      // ignore storage failures (private mode / restrictive file context)
    }
  }

  class Game {
    constructor(canvas, images) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.images = images;
      this.state = "menu";
      this.selected = "francesco";
      this.player = null;
      this.obstacles = [];
      this.score = 0;
      this.best = getBestScore();
      this.speed = 155;
      this.groundOffset = 0;
      this.spawnTimer = 0;
      this.nextSpawn = 0.9;
      this.bgScroll = 0;
      this.input = { duck: false };

      this.menuButtons = [
        { key: "francesco", x: 72, y: 85, w: 110, h: 24, label: "Play as Francesco" },
        { key: "boss", x: 202, y: 85, w: 110, h: 24, label: "Play as Boss" }
      ];
    }

    setState(next) { this.state = next; }

    startRun(charKey) {
      this.selected = charKey;
      this.player = new App.Player(charKey, this.images[charKey]);
      this.obstacles = [];
      this.score = 0;
      this.speed = 155;
      this.spawnTimer = 0;
      this.nextSpawn = 0.8;
      this.groundOffset = 0;
      this.bgScroll = 0;
      this.setState("playing");
    }

    restart() { this.startRun(this.selected); }

    triggerJump() {
      if (this.state === "menu") return this.startRun(this.selected);
      if (this.state === "gameover") return this.restart();
      if (this.player) this.player.jump();
    }

    setDuck(on) {
      this.input.duck = on;
      if (this.state === "playing" && this.player) this.player.setDuck(on);
    }

    click(px, py) {
      if (this.state === "menu") {
        const x = (px / this.canvas.clientWidth) * GAME_WIDTH;
        const y = (py / this.canvas.clientHeight) * GAME_HEIGHT;
        const hit = this.menuButtons.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
        if (hit) this.startRun(hit.key);
      } else if (this.state === "gameover") this.restart();
    }

    update(dt) {
      if (this.state !== "playing") return;

      this.score += dt * 32;
      this.speed = Math.min(330, this.speed + dt * 2.8);
      this.groundOffset = (this.groundOffset + dt * this.speed) % 16;
      this.bgScroll = (this.bgScroll + dt * (this.speed * 0.18)) % (GAME_WIDTH + 100);

      this.player.setDuck(this.input.duck);
      this.player.update(dt, this.speed);

      this.spawnTimer += dt;
      if (this.spawnTimer > this.nextSpawn) {
        const last = this.obstacles[this.obstacles.length - 1];
        const clear = !last || last.x < GAME_WIDTH - (75 + Math.random() * 45);
        if (clear) {
          this.obstacles.push(App.pickObstacle(this.score));
          this.spawnTimer = 0;
          const difficulty = Math.max(0.44, 0.92 - this.speed / 700);
          this.nextSpawn = difficulty + Math.random() * 0.5;
        }
      }

      this.obstacles.forEach((o) => o.update(dt, this.speed));
      this.obstacles = this.obstacles.filter((o) => !o.isOffscreen());

      const playerHitbox = this.player.getHitbox();
      if (this.obstacles.some((o) => overlap(playerHitbox, o.getHitbox()))) {
        this.player.die();
        this.setState("gameover");
        this.best = Math.max(this.best, Math.floor(this.score));
        saveBestScore(this.best);
      }
    }

    drawBackground() {
      const ctx = this.ctx;
      ctx.fillStyle = "#f7e0ad";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "#e2c98f";
      for (let i = 0; i < 4; i += 1) {
        const x = ((i * 120 - this.bgScroll * 0.45) % (GAME_WIDTH + 60));
        ctx.fillRect(x, 90, 20, 22);
        ctx.fillRect(x + 4, 80, 8, 10);
        ctx.fillRect(x + 12, 84, 6, 9);
      }
      ctx.fillStyle = "#b89658";
      ctx.fillRect(0, GROUND_Y + 4, GAME_WIDTH, 30);
      ctx.fillStyle = "#8f6f3f";
      for (let i = -1; i < GAME_WIDTH / 16 + 2; i += 1) {
        ctx.fillRect(i * 16 - this.groundOffset, GROUND_Y + 5, 8, 2);
      }
      ctx.strokeStyle = "#28211c";
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 4.5);
      ctx.lineTo(GAME_WIDTH, GROUND_Y + 4.5);
      ctx.stroke();
    }

    drawHud() {
      const ctx = this.ctx;
      ctx.fillStyle = "#1f1b18";
      ctx.font = "10px 'Courier New', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`SCORE ${Math.floor(this.score).toString().padStart(5, "0")}`, GAME_WIDTH - 8, 14);
      ctx.fillText(`BEST ${Math.floor(this.best).toString().padStart(5, "0")}`, GAME_WIDTH - 8, 26);
      if (!this.player) return;
      const other = this.selected === "boss" ? "francesco" : "boss";
      const frame = SPRITES[other].frames.idle;
      const img = this.images[other];
      ctx.globalAlpha = 0.9;
      ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, 8, 6, 16, 24);
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
      ctx.fillText(`Watching: ${SPRITES[other].label}`, 30, 18);
    }

    drawMenu() {
      const ctx = this.ctx;
      ctx.textAlign = "center";
      ctx.fillStyle = "#2a2018";
      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.fillText("INVOICE ESCAPE", GAME_WIDTH / 2, 28);
      ctx.font = "10px 'Courier New', monospace";
      ctx.fillText("Run forever. Never answer that reminder email.", GAME_WIDTH / 2, 42);

      const boss = SPRITES.boss.frames.run[1];
      const fr = SPRITES.francesco.frames.run[1];
      ctx.drawImage(this.images.boss, boss.x, boss.y, boss.w, boss.h, 132, 48, 24, 36);
      ctx.drawImage(this.images.francesco, fr.x, fr.y, fr.w, fr.h, 220, 48, 24, 36);

      this.menuButtons.forEach((btn) => {
        ctx.fillStyle = "#fff5dc";
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        ctx.strokeStyle = "#1e1e1e";
        ctx.strokeRect(btn.x + 0.5, btn.y + 0.5, btn.w - 1, btn.h - 1);
        ctx.fillStyle = "#1d1d1d";
        ctx.font = "10px 'Courier New', monospace";
        ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 15);
      });

      ctx.font = "9px 'Courier New', monospace";
      ctx.fillText("Tip: if you can see this, there is still an unpaid invoice behind you.", GAME_WIDTH / 2, 150);
    }

    drawGameOver() {
      const ctx = this.ctx;
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff2cd";
      ctx.fillRect(96, 52, 192, 54);
      ctx.strokeStyle = "#1f1f1f";
      ctx.strokeRect(96.5, 52.5, 191, 53);
      ctx.fillStyle = "#221b15";
      ctx.font = "bold 13px 'Courier New', monospace";
      ctx.fillText("GAME OVER", GAME_WIDTH / 2, 71);
      ctx.font = "10px 'Courier New', monospace";
      ctx.fillText("The invoice found you.", GAME_WIDTH / 2, 84);
      ctx.fillText("Press Space or Enter to restart", GAME_WIDTH / 2, 97);
    }

    render() {
      this.drawBackground();
      if (this.state === "menu") return this.drawMenu();
      this.obstacles.forEach((o) => o.draw(this.ctx));
      if (this.player) this.player.draw(this.ctx);
      this.drawHud();
      if (this.state === "gameover") this.drawGameOver();
    }
  }

  App.Game = Game;
})();
