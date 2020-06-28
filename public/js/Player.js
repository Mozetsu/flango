export class Player {
	constructor(room, username) {
		this._id = null;
		this.room = room;
		this.username = username;
		this.mark = null;
		this.opponent = {
			_id: null,
			username: null,
			mark: null,
			moves: [],
			score: 0,
		};
		this.score = 0;
		this.tie = 0;
		this.moves = [];
	}
}
