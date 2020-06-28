import { win, marks, allowed, checkWin } from './data.js';

export function enable(player) {
	if (!player) {
		document.querySelector('.restart').pointerEvents = 'all';
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

export function disable(state) {
	if (!state) {
		document.querySelector('.restart').style.pointerEvents = 'none';
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

export function select(player, i) {
	const tile = document.querySelector(`.tile:nth-child(${i})`);
	const n = parseInt(tile.classList[1]);

	// position not allowed and played before
	if (!allowed.includes(n) || player.moves.includes(n)) return { valid: false };

	// position allowed and not played before
	if (allowed.includes(n) && !player.moves.includes(n)) {
		disable(0);
		const i = allowed.findIndex((e) => e === n);
		allowed.splice(i, 1);
		player.moves.push(n);
		player.moves.sort();
		tile.innerHTML = marks[player.mark](player.str);
	}

	const { arr, str } = checkWin(win, player);

	// win
	if (arr.length > 0) {
		arr.forEach((e) => document.querySelector(`.tile:nth-child(${e})`).classList.add(`${str}-win`));
		disable(1);
		return { valid: true, end: true };
	}

	// tie
	if (allowed.length === 0) {
		disable(1);
		return { valid: true, end: true, tie: true };
	}

	// next play
	return { valid: true, end: false };
}

export function emoji(player, emoji) {
	if (document.querySelector(`.${player}`).children[2].style.opacity !== '1') {
		// show emoji
		document.querySelector(`.${player}`).children[2].innerHTML = emoji;
		document.querySelector(`.${player}`).children[2].style.opacity = 1;
		// hide emoji
		setTimeout(() => {
			document.querySelector(`.${player}`).children[2].style.opacity = 0;
		}, 1500);
		return { allowed: true };
	}
	return { allowed: false };
}

export function setupRoom(playerOne, playerTwo) {
	if (playerTwo) {
		// player two
		const p2 = document.querySelector('.playerTwo').querySelector('.username').children[0];
		p2.innerHTML = playerOne.opponent.username;
		return;
	}

	// player one
	const p1 = document.querySelector('.playerOne').querySelector('.username').children[0];
	p1.innerHTML = playerOne.username;

	// room id
	document.querySelector('.room-id').innerHTML = playerOne.room;
}

export function playerJoined(player) {
	const notification = document.querySelector('.notification');

	notification.children[0].innerHTML = player;
	notification.children[1].innerHTML = 'has joined the game';
	notification.classList.toggle('notification-playerOne');
	notification.style.opacity = 1;

	setTimeout(() => {
		notification.style.opacity = 0;
	}, 1500);

	setTimeout(() => {
		notification.classList.toggle('notification-playerOne');
	}, 1700);
}

export function playerLeft(player) {
	const notification = document.querySelector('.notification');

	notification.children[0].innerHTML = player;
	notification.children[1].innerHTML = 'has left the game';
	notification.classList.toggle('notification-playerTwo');
	notification.style.opacity = 1;

	setTimeout(() => {
		notification.style.opacity = 0;
	}, 1500);

	setTimeout(() => {
		notification.classList.toggle('notification-playerTwo');
	}, 1700);
}
