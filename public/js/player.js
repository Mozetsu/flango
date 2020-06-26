// import { ministring } from './ministring.js';

export class Player {
	constructor(usr) {
		this._id = null;
		// this.room = ministring(6, 'numbers, uppercase');
		this.room = 'B0T5J7';
		this.username = usr;
		this.mark = null;
		this.opponent = null;
		this.moves = [];
	}
}
