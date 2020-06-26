import * as game from './game.js';
import { Player } from './Player.js';

const socket = io();

const player = new Player(window.prompt('Username').toString().toUpperCase());

game.setupScoreboard(player);

// tiles
const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) =>
	t.addEventListener('click', function () {
		game.selectTile({ str: 'playerOne', moves: player.moves, mark: player.mark }, this.classList[1]);
		socket.emit('player-action', { action: 'select_tile', tile: this.classList[1], moves: player.moves });
	})
);

// room id
document.querySelector('.room-id').innerHTML = player.room;

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => game.enableGame(player));

// emojis
document.querySelectorAll('.emoji').forEach((e) =>
	e.addEventListener('click', function () {
		socket.emit('player-action', { action: 'emoji', emoji: this.innerHTML });
		game.react('playerOne', this.innerHTML);
	})
);

// socket ######################################################################

socket.emit('player-connected');

socket.on('player-id', ({ _id }) => {
	console.log(_id);
	player._id = _id;
	socket.emit('join-room', { player });
});

socket.on('player-mark', ({ mark }) => (player.mark = mark));

socket.on('player-action', (data) => {
	if (data.action.toString() === 'select_tile') {
		const opponentMark = player.mark === 'cross' ? 'circle' : 'cross';
		game.selectTile({ str: 'playerTwo', mark: opponentMark, moves: player.moves }, data.tile);
	}

	if (data.action.toString() === 'emoji') {
		console.log(data);
		game.react('playerTwo', data.emoji);
	}
});

socket.on('unable-to-join', ({ server }) => console.log(server));
