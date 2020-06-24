import { Game } from './game.js';
import { Player } from './player.js';

const playerOne = new Player();

const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) =>
	t.addEventListener('click', function () {
		playerOne.pickTile(this);
	})
);
