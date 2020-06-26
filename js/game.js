export function enableGame(room, fn) {
	// reset allowed positions and player moves array
	room.playerOne.moves.length = 0;
	room.allowedPositions.length = 0;
	room.allowedPositions.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

	// clears all game tiles and adds event listener
	document.querySelectorAll('.tile').forEach((t) => {
		t.innerHTML = '';
		t.classList.remove(t.classList[2]);
		t.style.pointerEvents = 'all';
		t.addEventListener('click', fn);
	});

	// hide restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 0;
	restartBtn.style.pointerEvents = 'none';
}

export function disableGame(fn) {
	// removes event listener from game tiles
	document.querySelectorAll('.tile').forEach((t) => {
		t.style.pointerEvents = 'none';
		t.removeEventListener('click', fn);
	});

	// display restart button
	const restartBtn = document.querySelector('.restart');
	restartBtn.style.opacity = 1;
	restartBtn.style.pointerEvents = 'all';
}

export function click(room, tile) {
	const pos = parseInt(tile.classList[1]);
	// if position is allowed and not played before
	if (room.allowedPositions.includes(pos) && !room.playerOne.moves.includes(pos)) {
		// find elem index and removes it
		const i = room.allowedPositions.findIndex((e) => e === pos);
		room.allowedPositions.splice(i, 1);
		room.playerOne.moves.push(pos);
		room.playerOne.moves.sort();
		tile.innerHTML = room.playerOne.mark;
	}
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

export function setupScoreboard(room) {
	const p1 = document.querySelector('.playerOne').querySelector('.username').children[0];
	p1.innerHTML = room.playerOne.username;

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
