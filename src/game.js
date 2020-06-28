function addPlayer(room, player) {
	const freePlayer = room.playerOne === null ? 'playerOne' : 'playerTwo';
	const takenPlayer = room.playerOne !== null ? 'playerOne' : 'playerTwo';

	// populate new player
	room[freePlayer] = player;
	room.players.push(player._id);

	// define players opponent and mark
	if (room[takenPlayer] !== null) {
		room[takenPlayer].opponent._id = room[freePlayer]._id;
		room[freePlayer].opponent._id = room[takenPlayer]._id;
	}

	if (room['playerOne'] !== null) {
		room['playerOne'].mark = 'cross';
	}

	if (room['playerTwo'] !== null) {
		room['playerTwo'].mark = 'circle';
	}

	console.log(room);
	return { free: freePlayer, taken: takenPlayer };
}

function removePlayer(room, playerId) {
	let player = null;
	let opponent = null;

	if (room.players.length === 0) return;

	if (room.players.length === 1 && room['playerOne']) player = 'playerOne';
	else player = 'playerTwo';

	if (room.players.length === 2) {
		player = playerId === room['playerOne']._id ? 'playerOne' : 'playerTwo';
		opponent = player === 'playerOne' ? 'playerTwo' : 'playerOne';
		room[opponent].opponent = {
			username: null,
			mark: null,
			moves: [],
			score: 0,
		};
	}

	const usr = room[player].username;
	room[player] = null;

	const i = room.players.findIndex((e) => e === playerId);
	room.players.splice(i, 1);

	return usr;
}

module.exports = { addPlayer, removePlayer };
