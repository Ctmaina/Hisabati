import "./styles/main.css";

import { Game } from "./game.js";

import {
  render,
  update,
  setHisabatiGame
} from "./ui.js";

const root =
  document.querySelector(
    "#app"
  );

if (!root) {
  throw new Error(
    "Hisabati could not start because #app was not found in index.html."
  );
}

let game;

function handleChange(view) {
  if (!game) {
    return;
  }

  /*
   * IMPORTANT:
   * Do NOT call render() here.
   *
   * render() creates the complete application
   * again and would destroy the current screen,
   * forms and navigation state.
   *
   * update() only refreshes the existing UI.
   */

  update(
    root,
    view
  );
}

game =
  new Game(
    handleChange
  );

setHisabatiGame(
  game
);

render(
  root,
  game
);