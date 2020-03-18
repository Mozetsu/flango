const room = {
	tie: 0,
	freeCells: 9,
	playing: undefined,
	players: 0,
	playerOne: {
		id: undefined,
		username: undefined,
		mark: 'times',
		moves: [],
		score: 0
	},
	playerTwo: {
		id: undefined,
		username: undefined,
		mark: 'circle',
		moves: [],
		score: 0
	}
};

const winCombinations = [
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
	[3, 5, 7]
];

// gets a random value between two numbers (min and max included)
const randomIntFromInterval = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function arrayContainsArray(arr1, arr2) {
	const verifyArr = [];
	arr1.forEach(elem1 => {
		if (arr2.find(elem2 => elem2 == elem1)) verifyArr.push(elem1);
	});
	return verifyArr.length === arr1.length;
}

function checkWin(win, moves, user, cells) {
	for (let combination of win) {
		if (arrayContainsArray(combination, moves)) return { result: 'win', username: user, winArray: combination };
	}
	if (cells === 0) return { result: 'tie' };
}

module.exports = { room, winCombinations, checkWin, randomIntFromInterval };
