import { Room } from './room.js';
import { click, react, enableGame, disableGame, setupScoreboard, playerJoined, playerLeft } from './game.js';

const room = new Room('MOZETSU');

setupScoreboard(room);

// tiles
const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) => t.addEventListener('click', selectTile));

// room id
document.querySelector('.room-id').innerHTML = room._id;

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => enableGame(room, selectTile));

function selectTile() {
	click(room, this); // add position to player moves
	const { arr } = room.checkWin(room.win, room.playerOne);
	if (arr.length > 0) {
		arr.forEach((e) => document.querySelector(`.tile:nth-child(${e})`).classList.add('playerOne-win'));
		return disableGame(selectTile);
	}
}

// emojis
document.querySelectorAll('.emoji').forEach((e) =>
	e.addEventListener('click', function () {
		react(this);
	})
);
