import { ministring } from './ministring.js';

export class Player {
	constructor(usr, room, mark) {
		this._id = ministring(16, 'numbers');
		this.room = room._id;
		this.username = usr;
		this.mark = mark;
		this.moves = [];
	}

	click(room, tile) {
		const pos = parseInt(tile.classList[1]);
		// if position is allowed and not played before
		if (room.allowedPositions.includes(pos) && !this.moves.includes(pos)) {
			// find elem index and removes it
			const i = room.allowedPositions.findIndex((e) => e === pos);
			room.allowedPositions.splice(i, 1);
			this.moves.push(pos);
			this.moves.sort();
			tile.innerHTML = this.mark;
		}
	}
}
