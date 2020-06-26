class Room {
	constructor(player) {
		this.win = [
			// rows
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			// columns
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			// diagoanl
			[1, 5, 9],
			[3, 5, 7],
		];

		this._id = player.room;

		this.allowedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		this.playerOne = player;

		this.playerTwo = null;

		this.players = [player._id];

		this.playing = null;

		this.score = {
			playerOne: 0,
			playerTwo: 0,
			tie: 0,
		};
	}
}

module.exports = Room;
