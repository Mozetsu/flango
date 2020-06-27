import { win, marks, allowed } from './data.js';

export const opponentMoves = [];
export const opponentMark = null;

export function selectTile(player, i) {
	const tile = document.querySelector(`.tile:nth-child(${i})`);
	const n = parseInt(tile.classList[1]);

	// position not allowed and played before
	if (!allowed.includes(n) || player.moves.includes(n)) return { allowed: false };

	// position allowed and not played before
	if (allowed.includes(n) && !player.moves.includes(n)) {
		disableGame(0);
		// find elem index and removes it
		const i = allowed.findIndex((e) => e === n);
		allowed.splice(i, 1);
		console.log(allowed);
		player.moves.push(n);
		player.moves.sort();
		tile.innerHTML = marks[player.mark](player.str);
	}

	const { str, arr } = checkWin(win, player);

	if (arr.length > 0) {
		arr.forEach((e) => document.querySelector(`.tile:nth-child(${e})`).classList.add(`${str}-win`));
		disableGame(1);
		return { allowed: true, end: true };
	}

	return { allowed: true, end: false };
}

export function enableGame(player) {
	if (!player) {
		return document.querySelectorAll('.tile').forEach((t) => (t.style.pointerEvents = 'all'));
	}

	player.moves.length = 0;
	allowed.length = 0;
	allowed.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

	// hide restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 0;
	restartBtn.style.pointerEvents = 'none';

	// clears all game tiles and adds event listener
	document.querySelectorAll('.tile').forEach((t) => {
		t.innerHTML = '';
		t.classList.remove(t.classList[2]);
		t.style.pointerEvents = 'all';
	});
}

export function disableGame(state) {
	if (!state) {
		return document.querySelectorAll('.tile').forEach((t) => (t.style.pointerEvents = 'none'));
	}

	// display restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 1;
	restartBtn.style.pointerEvents = 'all';

	// removes event listener from game tiles
	document.querySelectorAll('.tile').forEach((t) => {
		t.style.pointerEvents = 'none';
	});
}

export function displayEmoji(player, emoji) {
	if (document.querySelector(`.${player}`).children[2].style.opacity !== '1') {
		// show emoji
		document.querySelector(`.${player}`).children[2].innerHTML = emoji;
		document.querySelector(`.${player}`).children[2].style.opacity = 1;
		// hide emoji
		setTimeout(() => {
			document.querySelector(`.${player}`).children[2].style.opacity = 0;
			return { allowed: true };
		}, 1500);
	}
	return { allowed: false };
}

export function setupRoom(player) {
	// player one
	const p1 = document.querySelector('.playerOne').querySelector('.username').children[0];
	p1.innerHTML = player.username;

	// // player two
	// const p2 = document.querySelector('.playerTwo').querySelector('.username').children[0];
	// p2.innerHTML = room.playerOne.opponent;

	// room id
	document.querySelector('.room-id').innerHTML = player.room;
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
function checkWin(arr, player) {
	// not enough plays to win
	if (player.moves.length < 3) return { str: '', arr: [] };

	// array to store possible winning combinations
	const tmp = [];

	for (let combination of arr) {
		if (arrayContainsArray(combination, player.moves)) {
			tmp.push(...combination);
		}
	}

	const parsedArr = [...new Set(tmp)]; // removes duplicates

	return { str: player.str, arr: parsedArr };
}
