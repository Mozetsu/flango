import { ministring } from './ministring.js';

export class Player {
	constructor(usr, room, mark) {
		this._id = ministring(16, 'numbers');
		this.room = room._id;
		this.username = usr;
		this.mark = mark;
		this.moves = [];
	}
}
