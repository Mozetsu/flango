function addPlayer(room, player) {
	if (room.players.length === 2) {
		return { server: 'Room is full' };
	}

	const freePlayer = room.playerOne === null ? 'playerOne' : 'playerTwo';
	const takenPlayer = room.playerOne !== null ? 'playerOne' : 'playerTwo';

	// populate new player
	room[freePlayer] = player;
	room.players.push(player._id);

	// define players opponent and mark
	room[freePlayer].opponent = room[takenPlayer]._id;
	room[takenPlayer].opponent = room[freePlayer]._id;
	room['playerOne'].mark = 'cross';
	room['playerTwo'].mark = 'circle';
}

module.exports = { addPlayer };
