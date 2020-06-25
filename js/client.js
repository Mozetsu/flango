import { Room } from './room.js';
import { click, react, enableGame, disableGame } from './methods.js';

const room = new Room('Mozetsu');

document.querySelector('.room-id').innerHTML = room._id;

const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) => t.addEventListener('click', selectTile));

function selectTile() {
	click(room, this); // add position to player moves
	const { arr } = room.checkWin(room.win, room.playerOne);
	if (arr.length > 0) {
		arr.forEach((e) => document.querySelector(`.tile:nth-child(${e})`).classList.add('playerOne-win'));
		return disableGame(selectTile);
	}
}

const emojis = document.querySelectorAll('.emoji');
emojis.forEach((e) =>
	e.addEventListener('click', function () {
		react(this);
	})
);
