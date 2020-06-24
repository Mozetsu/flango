import { Game } from './game.js';

export class Player {
	constructor() {
		this.id = undefined;
		this.username = undefined;
		this.mark = undefined;
		this.moves = [];
		this.score = 0;
	}

	pickTile(tile) {
		if (!tile.hasChildNodes()) tile.innerHTML = Game.cross;
	}
}
