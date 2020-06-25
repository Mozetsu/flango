import { ministring } from './ministring.js';
import { Player } from './player.js';

export class Room {
	constructor(owner) {
		this._id = ministring(6, 'numbers, uppercase');

		// this.allowedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.allowedPositions = [2, 4, 5, 6, 7, 8, 9];

		this.playerOne = new Player(owner, this, this.cross('playerOne'));

		this.playerTwo = null;

		this.players = [this.playerOne._id];

		this.playing = null;

		this.score = {
			playerOne: 0,
			playerTwo: 0,
			tie: 0,
		};
	}

	circle(player) {
		return `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="68.5" cy="68.5" r="51" stroke="var(--${player}-primary)" stroke-width="25"/>
		</svg>`;
	}

	cross(player) {
		return `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M25 25L108 108M108 25L25 108" stroke="var(--${player}-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
		</svg>`;
	}

	addPlayer(player) {
		const availablePlayer = this.playerOne._id !== null ? 'playerTwo' : 'playerOne';
		this[availablePlayer] = player;
	}
}
