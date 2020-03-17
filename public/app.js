// game()
const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const player = {
	room: '7314',
	username: 'Player One',
	opponent: 'Player Two',
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
const playerOneName = document.querySelector('.player-one-username');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoName = document.querySelector('.player-two-username');
const playerTwoScore = document.getElementById('player-two-score');
const gameCellsWrapper = document.querySelector('.grid-wrapper');
const gameCells = document.querySelectorAll('.cell');
const turnContainer = document.querySelector('.turn');
const restartBtn = document.querySelector('#restart');

gameCells.forEach(cell => cell.addEventListener('click', pickCell));
restartBtn.addEventListener('click', () => {
	startGame();
	socket.emit('restart-game', { room: player.room });
});

function pickCell(pos) {
	// add item if empty
	if (!this.hasChildNodes()) {
		const tmp = document.createElement('i');
		tmp.classList = `${marks[player.mark]}`;
		this.appendChild(tmp);
		player.moves.push(this.id);
		checkWin(winCombinations, player.moves);
		socket.emit('player-action', { room: player.room, username: player.username, moves: player.moves });
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

// socket
const socket = io();

socket.on('connect', () => {
	// client
	const currentPlayer = window.prompt('Enter your Username');
	playerOneName.innerText = `${currentPlayer}`;
	player.username = currentPlayer;

	// const room = generate({ characters: 'number', length: 4 });
	socket.emit('create-room', { room: player.room, username: player.username });
});

socket.on('room-connection', ({ players }) => {
	const opponent = players.find(elem => elem !== player.username);
	if (opponent !== undefined) {
		player.opponent = opponent;
		playerTwoName.innerText = opponent;
	}
});

socket.on('player-move', playerObj => {
	console.log(playerObj);
	const lastMove = playerObj.moves[playerObj.moves.length - 1];
	// console.log(lastMove);
	const cell = gameCellsWrapper.children[lastMove - 1];
	console.log(cell);
	const tmp = document.createElement('i');
	tmp.classList = `${marks[player.mark]}`;
	cell.appendChild(tmp);
	checkWin(winCombinations, playerObj.moves);
});

socket.on('restart', () => {
	startGame();
});
