import "./styles/main.css";

import { Game } from "./game.js";
import { render } from "./ui.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error(
    "Hisabati could not start because #app was not found in index.html."
  );
}

let game;

function update(view) {
  if (!game) {
    return;
  }

  render(root, game);
}

game = new Game(update);

render(root, game);