// import { ministring } from './ministring.js';

export class Player {
	constructor(username) {
		this._id = null;
		// this.room = ministring(6, 'numbers, uppercase');
		this.room = 'M5DT71';
		this.username = username;
		this.mark = null;
		this.opponent = null;
		this.moves = [];
	}
}
