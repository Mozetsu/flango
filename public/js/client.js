import * as game from './game.js';
import { Player } from './Player.js';

const player = new Player(
	window.prompt('Room').toString().toUpperCase(),
	window.prompt('Username').toString().toUpperCase()
);

game.setupRoom(player, 0);

const socket = io();

// tiles event
const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) => t.addEventListener('click', tileClick));

function tileClick() {
	// check if play is allowed
	const { allowed, end } = game.selectTile(
		{ str: 'playerOne', moves: player.moves, mark: player.mark },
		this.classList[1]
	);
	// if allowed, send socket io event
	if (allowed) socket.emit('player-action', { action: 'select_tile', tile: this.classList[1], moves: player.moves });
	// player one wins
	if (end) {
		player.score++;
		document.querySelector(`.playerOne`).querySelector('.score').innerHTML = player.score;
	}
}

// emojis
document.querySelectorAll('.emoji').forEach((e) =>
	e.addEventListener('click', function () {
		const { allowed } = game.displayEmoji('playerOne', this.innerHTML);
		if (allowed) socket.emit('player-action', { action: 'emoji', emoji: this.innerHTML });
	})
);

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => {
	socket.emit('player-action', { action: 'restart_game' });
	player.opponent.moves.length = 0;
	game.enableGame(player);
});

// socket ###############################################################################################
// functions ############################################################################################

socket.emit('player-connected');

socket.on('player-id', ({ _id }) => {
	player._id = _id;
	socket.emit('join-room', { player });
});

socket.on('player-data', ({ mark, opponent }) => {
	if (!opponent) {
		game.disableGame(0);
		return (player.mark = mark);
	}

	player.mark = mark;
	player.opponent.username = opponent;
	player.opponent.mark = mark === 'cross' ? 'circle' : 'cross';
	game.enableGame(player);
	game.playerJoined(opponent);
	game.setupRoom(player, opponent);
});

socket.on('player-action', (data) => {
	// tile click -----------------------------------
	if (data.action.toString() === 'select_tile') {
		player.opponent.moves.push(data.tile);

		const { allowed, end } = game.selectTile(
			{ str: 'playerTwo', mark: player.opponent.mark, moves: player.opponent.moves },
			data.tile
		);

		if (allowed && !end) {
			game.enableGame(0);
		}

		// player two wins
		if (end) {
			player.opponent.score++;
			document.querySelector(`.playerTwo`).querySelector('.score').innerHTML = player.opponent.score;
		}
	}

	// emoji -----------------------------------
	if (data.action.toString() === 'emoji') {
		game.displayEmoji('playerTwo', data.emoji);
	}

	// restart -----------------------------------
	if (data.action.toString() === 'restart_game') {
		player.opponent.moves.length = 0;
		game.enableGame(player);
	}
});

socket.on('player-left', () => {
	player.moves.length = 0;
	player.score = 0;
	player.opponent.moves.length = 0;
	player.opponent.score = 0;
	// remove player one score
	document.querySelector('.playerOne').querySelector('.score').innerHTML = '0';
	// remove player two username
	document.querySelector('.playerTwo').querySelector('.username').children[0].innerHTML = 'PLAYER TWO';
	// remove player score
	document.querySelector('.playerTwo').querySelector('.score').innerHTML = '0';
	game.disableGame(0);
	return game.playerLeft(player.opponent.username);
});

socket.on('unable-to-join', ({ server }) => console.log(server));
