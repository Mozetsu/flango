class Player {
	constructor(_id, username, room) {
		this._id = _id;
		this.room = room._id;
		this.username = username;
		this.mark = room.cross('playerOne');
		this.opponent = null;
		this.moves = [];
	}
}

module.exports = Player;
