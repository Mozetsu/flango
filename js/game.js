export class Game {
	constructor() {




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
		for (let combination of arr) {
			if (arrayContainsArray(combination, player.moves)) return { _id: player.id, arr: combination };
		}
		return false;
	}
}
