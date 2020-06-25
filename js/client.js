import { Room } from './room.js';

const room = new Room('Mozetsu');
console.log(room);

document.querySelector('.room-id').innerHTML = room._id;

const tiles = document.querySelectorAll('.tile');
tiles.forEach((t) =>
	t.addEventListener('click', function () {
		room.playerOne.click(room, this);
	})
);
