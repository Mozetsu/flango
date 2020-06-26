const cross = `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 25L108 108M108 25L25 108" stroke="var(--playerOne-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
</svg>`;

const circle = `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="68.5" cy="68.5" r="51" stroke="var(--playerOne-primary)" stroke-width="25"/>
</svg>`;

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
		room['playerOne'].mark = cross;
	}

	if (room['playerTwo'] !== null) {
		room['playerTwo'].mark = circle;
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

module.exports = { cross, circle, addPlayer, removePlayer };
