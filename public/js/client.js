import { marks, selectTile, react, enableGame, setupScoreboard, playerJoined, playerLeft } from './game.js';
import { Player } from './Player.js';

const socket = io();

const player = new Player(window.prompt('Username').toString().toUpperCase());

setupScoreboard(player);

// tiles
const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) =>
	t.addEventListener('click', function () {
		socket.emit('player-action', { action: 'select_tile', tile: this.classList[1] });
		selectTile(player, this);
	})
);

// room id
document.querySelector('.room-id').innerHTML = player.room;

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => enableGame(player));

// emojis
document.querySelectorAll('.emoji').forEach((e) =>
	e.addEventListener('click', function () {
		socket.emit('player-action', { action: 'emoji', emoji: this.innerHTML });
		react('playerOne', this.innerHTML);
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
		const tileHTML = document.querySelector(`.tile:nth-child(${data.tile})`);
		const mark = player.mark === 'cross' ? marks.circle('playerTwo') : marks.cross('playerTwo');
		tileHTML.innerHTML = mark;
	}

	if (data.action.toString() === 'emoji') {
		console.log(data);
		react('playerTwo', data.emoji);
	}
});

socket.on('unable-to-join', ({ server }) => console.log(server));
