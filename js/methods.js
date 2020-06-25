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

export function enableGame(fn) {
	document.querySelectorAll('.tile').forEach((t) => {
		t.style.pointerEvents = 'all';
		t.addEventListener('click', fn);
	});
}

export function disableGame(fn) {
	document.querySelectorAll('.tile').forEach((t) => {
		t.style.pointerEvents = 'none';
		t.removeEventListener('click', fn);
	});
}
