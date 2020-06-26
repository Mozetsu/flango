import { selectTile, react, enableGame, setupScoreboard, playerJoined, playerLeft } from './game.js';
import { Player } from './Player.js';

const player = new Player(window.prompt('Username').toString().toUpperCase());

setupScoreboard(player);

// tiles
const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) =>
	t.addEventListener('click', function () {
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
		react(this);
	})
);

// socket ######################################################################
const socket = io();

socket.emit('player-connected');

socket.on('player-id', ({ _id }) => {
	console.log(_id);
	player._id = _id;
	socket.emit('join-room', { player });
});

socket.on('player-mark', ({ mark }) => (player.mark = mark));

socket.on('unable-to-join', ({ server }) => console.log(server));
