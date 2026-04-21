import { SPRITES } from "./config.js";

const placeholder = () => {
  const c = document.createElement("canvas");
  c.width = 24;
  c.height = 24;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#333";
  ctx.fillRect(5, 4, 14, 16);
  ctx.fillStyle = "#f6d365";
  ctx.fillRect(9, 0, 6, 6);
  return c;
};

export async function loadSpriteImages() {
  const loaded = {};

  await Promise.all(
    Object.entries(SPRITES).map(([key, value]) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded[key] = img;
          resolve();
        };
        img.onerror = () => {
          // Safe fallback so the game is playable if files are missing.
          loaded[key] = placeholder();
          resolve();
        };
        img.src = value.image;
      })
    )
  );

  return loaded;
}
