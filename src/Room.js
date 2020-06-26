class Room {
	constructor(player) {
		this._id = player.room;

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
