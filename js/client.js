import { Room } from './room.js';
import { click, react, disableGame } from './methods.js';

const room = new Room('Mozetsu');

document.querySelector('.room-id').innerHTML = room._id;

const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) => t.addEventListener('click', selectTile));

function selectTile() {
	click(room, this);
	const winner = room.checkWin(room.win, room.playerOne);
	if (winner) {
		const { arr } = winner;
		console.log(arr);
		arr.forEach((i) => document.querySelector(`.tile:nth-child(${i})`).classList.add('playerOne-win'));
		return disableGame(selectTile);
	}
}

const emojis = document.querySelectorAll('.emoji');
emojis.forEach((e) =>
	e.addEventListener('click', function () {
		react(this);
	})
);
