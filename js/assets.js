window.App = window.App || {};

(function () {
  const { SPRITES } = App.CONFIG;

  function placeholder(name) {
    const c = document.createElement("canvas");
    c.width = 96;
    c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#17345f";
    ctx.fillRect(20, 22, 54, 90);
    ctx.fillStyle = "#efc9a6";
    ctx.fillRect(30, 0, 34, 32);
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.fillText(name[0].toUpperCase(), 44, 62);
    return c;
  }

  App.loadSpriteImages = function loadSpriteImages(onComplete) {
    const loaded = {};
    const entries = Object.entries(SPRITES);
    let done = 0;

    const finish = () => {
      done += 1;
      if (done === entries.length) onComplete(loaded);
    };

    entries.forEach(([key, value]) => {
      const img = new Image();
      let settled = false;

      const useFallback = () => {
        if (settled) return;
        settled = true;
        loaded[key] = placeholder(key);
        finish();
      };

      img.onload = () => {
        if (settled) return;
        settled = true;
        loaded[key] = img;
        finish();
      };
      img.onerror = useFallback;
      img.src = value.image;

      setTimeout(useFallback, 2000);
    });
  };
})();
