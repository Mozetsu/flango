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
tiles.forEach((t) => {
	t.style.pointerEventes = 'none';
	t.addEventListener('click', click);
});

function click() {
	// check if play is valid
	const { valid, end, tie } = game.select(
		{ str: 'playerOne', moves: player.moves, mark: player.mark },
		this.classList[1]
	);

	// if valid, emit play
	if (valid) socket.emit('player-action', { action: 'select_tile', tile: this.classList[1], moves: player.moves });

	// player one wins
	if (end && !tie) {
		player.score++;
		document.querySelector(`.playerOne`).querySelector('.score').innerHTML = player.score;
	}

	// tie
	if (tie) {
		player.tie++;
		document.querySelector(`.tie`).querySelector('.score').innerHTML = player.tie;
	}
}

// emojis
document.querySelectorAll('.emoji').forEach((e) =>
	e.addEventListener('click', function () {
		const { allowed } = game.emoji('playerOne', this.classList[1]);
		if (allowed) socket.emit('player-action', { action: 'emoji', emoji: this.classList[1] });
	})
);

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => {
	socket.emit('player-action', { action: 'restart_game' });
	player.opponent.moves.length = 0;
	game.enable(player);
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
		game.disable(0);
		return (player.mark = mark);
	}

	player.mark = mark;
	player.opponent.username = opponent;
	player.opponent.mark = mark === 'cross' ? 'circle' : 'cross';
	game.enable(player);
	game.playerJoined(opponent);
	game.setupRoom(player, opponent);
});

socket.on('player-action', (data) => {
	// tile click -----------------------------------
	if (data.action.toString() === 'select_tile') {
		player.opponent.moves.push(data.tile);

		const { valid, end, tie } = game.select(
			{ str: 'playerTwo', mark: player.opponent.mark, moves: player.opponent.moves },
			data.tile
		);

		if (valid && !end) return game.enable(0);

		// player two wins
		if (end && !tie) {
			player.opponent.score++;
			document.querySelector(`.playerTwo`).querySelector('.score').innerHTML = player.opponent.score;
			return;
		}

		// tie
		if (tie) {
			player.tie++;
			document.querySelector(`.tie`).querySelector('.score').innerHTML = player.tie;
		}
	}

	// emoji -----------------------------------
	if (data.action.toString() === 'emoji') {
		console.log(data.emoji);

		game.emoji('playerTwo', data.emoji);
	}

	// restart -----------------------------------
	if (data.action.toString() === 'restart_game') {
		player.opponent.moves.length = 0;
		game.enable(player);
	}
});

socket.on('player-left', () => {
	// reset scores
	player.moves.length = 0;
	player.score = 0;
	player.tie = 0;
	player.opponent.moves.length = 0;
	player.opponent.score = 0;

	// reset player one score
	document.querySelector('.playerOne').querySelector('.score').innerHTML = '0';
	// reset tie score
	document.querySelector('.tie').querySelector('.score').innerHTML = '0';
	// reset player two
	document.querySelector('.playerTwo').querySelector('.username').children[0].innerHTML = 'PLAYER TWO';
	document.querySelector('.playerTwo').querySelector('.score').innerHTML = '0';
	game.playerLeft(player.opponent.username);
	return game.disable(0);
});

socket.on('unable-to-join', ({ server }) => console.log(server));
