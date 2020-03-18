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

const room = {
	tie: 0,
	freeCells: 9,
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



module.exports = { winCombinations, room };
