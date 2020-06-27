class Room {
	constructor(player) {
		this._id = player.room;

		this.playerOne = player;

		this.playerTwo = null;

		this.players = [player._id];

		this.playing = null;
	}
}

module.exports = Room;
