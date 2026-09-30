import "./styles/main.css";
import { Game } from "./game.js";
import { render, update } from "./ui.js";

const root = document.querySelector("#app");
let mounted = false;

const game = new Game((view) => {
  if (mounted) update(root, view);
});

render(root, game);
mounted = true;
