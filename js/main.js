import { loadSpriteImages } from "./assets.js";
import { Game } from "./game.js";

const canvas = document.getElementById("game");

async function bootstrap() {
  const images = await loadSpriteImages();
  const game = new Game(canvas, images);

  // Sound hook for future effects.
  const audio = {
    jump() {},
    hit() {}
  };
  void audio;

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      game.triggerJump();
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      game.setDuck(true);
    }
    if (event.code === "Enter" && game.state === "gameover") {
      event.preventDefault();
      game.restart();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") {
      event.preventDefault();
      game.setDuck(false);
    }
  });

  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    game.click(x, y);
  });

  let last = performance.now();

  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    game.update(dt);
    game.render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

bootstrap();
