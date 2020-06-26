function addPlayer(room, player) {
	const freePlayer = room.playerOne === null ? 'playerOne' : 'playerTwo';
	const takenPlayer = room.playerOne !== null ? 'playerOne' : 'playerTwo';

	// populate new player
	room[freePlayer] = player;
	room.players.push(player._id);

	// define players opponent and mark
	if (room[takenPlayer] !== null) {
		room[takenPlayer].opponent = room[freePlayer]._id;
		room[freePlayer].opponent = room[takenPlayer]._id;
	}

	if (room['playerOne'] !== null) {
		room['playerOne'].mark = 'cross';
	}

	if (room['playerTwo'] !== null) {
		room['playerTwo'].mark = 'circle';
	}

	return freePlayer;
}

function removePlayer(room, playerId) {
	const player = playerId === room['playerOne']._id ? 'playerOne' : 'playerTwo';
	const opponent = playerId !== room['playerOne']._id ? 'playerOne' : 'playerTwo';

	room[player] = null;
	if (room[opponent] !== null) room[opponent].opponent = null;

	const i = room.players.findIndex((e) => e === playerId);
	room.players.splice(i, 1);

	room.score = { playerOne: 0, playerTwo: 0, tie: 0 };
}

module.exports = { addPlayer, removePlayer };
