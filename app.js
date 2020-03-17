// game()
const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const player = {
	name: 'Lucas',
	mark: 'times',
	moves: [],
	score: 0
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

// client
const gameCells = document.querySelectorAll('.cell');
const turnContainer = document.querySelector('.turn');
const restartBtn = document.querySelector('#restart');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoScore = document.getElementById('player-two-score');

restartBtn.addEventListener('click', startGame);
gameCells.forEach(cell => cell.addEventListener('click', pickCell));

function pickCell() {
	// add item if empty
	if (!this.hasChildNodes()) {
		const tmp = document.createElement('i');
		tmp.classList = `${marks[player.mark]}`;
		this.appendChild(tmp);
		player.moves.push(this.id);
		checkWin(winCombinations, player.moves);
	}
}

function checkWin(win, moves) {
	win.forEach(combination => {
		// win
		if (arrayContainsArray(combination, moves)) endGame(combination);
	});
}

function endGame(arr) {
	turnContainer.style.display = 'none';
	restartBtn.style.display = 'inline';

	player.score++;
	playerOneScore.innerText = player.score;

	gameCells.forEach(cell => {
		cell.removeEventListener('click', pickCell);
		cell.style.cursor = 'auto';
	});

	arr.forEach(elem => {
		const cell = document.getElementById(elem);
		cell.style.background = '#d1eeff';
	});
}

function startGame() {
	restartBtn.style.display = 'none';
	turnContainer.style.display = 'flex';

	// resets player's moves
	player.moves.length = 0;

	// resets UI
	gameCells.forEach(cell => {
		cell.innerHTML = '';
		cell.style.background = '#fff';
		cell.style.cursor = 'pointer';
		cell.addEventListener('click', pickCell);
	});
}

function arrayContainsArray(arr1, arr2) {
	const verifyArr = [];
	arr1.forEach(elem1 => {
		if (arr2.find(elem2 => elem2 == elem1)) verifyArr.push(elem1);
	});
	return verifyArr.length === arr1.length;
}
