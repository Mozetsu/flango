const win = [
	// rows
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
	// columns
	[1, 4, 7],
	[2, 5, 8],
	[3, 6, 9],
	// diagoanl
	[1, 5, 9],
	[3, 5, 7],
];

export const marks = {
	cross: function (player) {
		return `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M25 25L108 108M108 25L25 108" stroke="var(--${player}-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
	</svg>`;
	},
	circle: function (player) {
		return `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="68.5" cy="68.5" r="51" stroke="var(--${player}-primary)" stroke-width="25"/>
	</svg>`;
	},
};

export function selectTile(player, tile, allowedArr = { allowedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9] }) {
	const pos = parseInt(tile.classList[1]);
	// if position is allowed and not played before
	if (allowedArr.allowedPositions.includes(pos) && !player.moves.includes(pos)) {
		// find elem index and removes it
		const i = allowedArr.allowedPositions.findIndex((e) => e === pos);
		allowedArr.allowedPositions.splice(i, 1);
		player.moves.push(pos);
		player.moves.sort();
		tile.innerHTML = marks[player.mark]('playerOne');
	}

	const { arr } = checkWin(undefined, player);

	if (arr.length > 0) {
		arr.forEach((e) => document.querySelector(`.tile:nth-child(${e})`).classList.add('playerOne-win'));
		return disableGame(selectTile);
	}
}

export function enableGame(player) {
	player.moves.length = 0;

	// clears all game tiles and adds event listener
	document.querySelectorAll('.tile').forEach((t) => {
		t.innerHTML = '';
		t.classList.remove(t.classList[2]);
		t.style.pointerEvents = 'all';
	});

	// hide restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 0;
	restartBtn.style.pointerEvents = 'none';
}

export function disableGame() {
	// removes event listener from game tiles
	document.querySelectorAll('.tile').forEach((t) => {
		t.style.pointerEvents = 'none';
		t.classList.pointerEvents = 'none';
	});

	// display restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 1;
	restartBtn.style.pointerEvents = 'all';
}

export function react(emoji) {
	if (document.querySelector('.playerOne').children[2].style.opacity !== '1') {
		const selected = emoji.innerHTML;
		// show reaction
		document.querySelector('.playerOne').children[2].innerHTML = selected;
		document.querySelector('.playerOne').children[2].style.opacity = 1;
		// hide reaction
		setTimeout(() => {
			document.querySelector('.playerOne').children[2].style.opacity = 0;
		}, 1500);
	}
}

export function setupScoreboard(player) {
	const p1 = document.querySelector('.playerOne').querySelector('.username').children[0];
	p1.innerHTML = player.username;

	// const p2 = document.querySelector('.playerTwo').querySelector('.username').children[0];
	// p2.innerHTML = room.playerOne.opponent;
}

export function playerJoined(player) {
	const notification = document.querySelector('.notification');

	notification.children[0].children[0].innerHTML = player;
	notification.children[0].innerHTML += 'has joined the game';
	notification.classList.toggle('notification-playerOne');
	notification.style.opacity = 1;

	setTimeout(() => {
		notification.style.opacity = 0;
	}, 1500);
}

export function playerLeft(player) {
	const notification = document.querySelector('.notification');

	notification.children[0].children[0].innerHTML = player;
	notification.children[0].innerHTML += 'has left the game';
	notification.classList.toggle('notification-playerTwo');
	notification.style.opacity = 1;

	setTimeout(() => {
		notification.style.opacity = 0;
	}, 1500);
}

// ##################################################################

function arrayContainsArray(arr1, arr2) {
	const tmp = [];
	arr1.forEach((a) => {
		if (arr2.find((b) => b === a)) tmp.push(a);
	});
	return tmp.length === arr1.length;
}

// arr -> win combinations array
export function checkWin(arr = win, player) {
	const tmp = [];
	for (let combination of arr) {
		if (arrayContainsArray(combination, player.moves)) {
			tmp.push(...combination);
		}
	}
	const parsedArr = [...new Set(tmp)]; // removes duplicates
	return { _id: player.id, arr: parsedArr };
}
