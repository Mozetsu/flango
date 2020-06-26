class Room {
	constructor(player) {
		this.win = [
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

		this._id = player.room;

		this.allowedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		this.playerOne = player;

		this.playerTwo = null;

		this.players = [player._id];

		this.playing = null;

		this.score = {
			playerOne: 0,
			playerTwo: 0,
			tie: 0,
		};
	}

	circle(player) {
		return `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="68.5" cy="68.5" r="51" stroke="var(--${player}-primary)" stroke-width="25"/>
		</svg>`;
	}

	cross(player) {
		return `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M25 25L108 108M108 25L25 108" stroke="var(--${player}-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
		</svg>`;
	}

	addPlayer(player) {
		const availablePlayer = this.playerOne._id !== null ? 'playerTwo' : 'playerOne';
		this[availablePlayer] = player;
	}

	arrayContainsArray(arr1, arr2) {
		const tmp = [];
		arr1.forEach((a) => {
			if (arr2.find((b) => b === a)) tmp.push(a);
		});
		return tmp.length === arr1.length;
	}

	// arr -> win combinations array
	checkWin(arr, player) {
		const tmp = [];
		for (let combination of arr) {
			if (this.arrayContainsArray(combination, player.moves)) {
				tmp.push(...combination);
			}
		}
		const parsedArr = [...new Set(tmp)]; // removes duplicates
		return { _id: player.id, arr: parsedArr };
	}
}

module.exports = Room;
