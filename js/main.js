window.App = window.App || {};

(function () {
  const canvas = document.getElementById("game");
  if (!canvas) return;

  function start(images) {
    const game = new App.Game(canvas, images);

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
      game.click(event.clientX - rect.left, event.clientY - rect.top);
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

  App.loadSpriteImages(start);
})();
