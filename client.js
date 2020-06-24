import { pickTile } from './js/game.js';

const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) => t.addEventListener('click', pickTile));
