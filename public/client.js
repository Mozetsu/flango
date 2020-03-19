import ministring from './js/ministring.js';

const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const player = {
	room: '7314',
	description: undefined,
	id: undefined,
	username: undefined,
	opponent: undefined,
	mark: undefined,
	moves: [],
	isEnd: false
};

// twemoji.parse(document.querySelector('.container'), {
// 	folder: 'svg',
// 	ext: '.svg'
// });

// scoreboard
const playerOneName = document.querySelector('.player-one-username');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoName = document.querySelector('.player-two-username');
const playerTwoScore = document.getElementById('player-two-score');
const tieScore = document.getElementById('tie');

// game cells
const gameCellsWrapper = document.querySelector('.grid-wrapper');
const gameCells = document.querySelectorAll('.cell');

// notifications
const yourTurnNtf = document.querySelector('.your-turn');
const opponentTurnNtf = document.querySelector('.waiting-opponent');
const restartBtn = document.querySelector('#restart');

function pickCell() {
	// add item if cell is empty
	if (!this.hasChildNodes()) {
		this.classList.add('playerOne');
		const tmp = document.createElement('i');
		tmp.classList = `${marks[player.mark]}`;
		this.appendChild(tmp);
		player.moves.push(this.id);

		// socket
		socket.emit('player-action', {
			room: player.room,
			username: player.username,
			description: player.description,
			moves: player.moves
		});
	}
}

function disableGame() {
	opponentTurnNtf.style.display = 'flex';
	yourTurnNtf.style.display = 'none';
	gameCells.forEach(cell => {
		cell.removeEventListener('click', pickCell);
		cell.style.cursor = 'auto';
	});
}

function enableGame() {
	yourTurnNtf.style.display = 'flex';
	opponentTurnNtf.style.display = 'none';
	gameCells.forEach(cell => {
		cell.addEventListener('click', pickCell);
		cell.style.cursor = 'pointer';
	});
}

function endGame(description, score, arr, playerLeft) {
	// you win
	if (description !== 'tie' && description === player.description) playerOneScore.innerText = score;
	// opponent wins
	if (description !== 'tie' && description !== player.description) playerTwoScore.innerText = score;
	// tie
	if (description === 'tie') tieScore.innerText = score;

	if (!description) playerTwoScore.innerText = 0;

	yourTurnNtf.style.display = 'none';
	opponentTurnNtf.style.display = 'none';

	playerLeft ? (opponentTurnNtf.style.display = 'flex') : (restartBtn.style.display = 'inline');

	gameCells.forEach(cell => {
		cell.removeEventListener('click', pickCell);
		cell.style.cursor = 'auto';
	});

	if (arr) {
		arr.forEach(i => {
			const cell = document.getElementById(i);
			cell.classList.contains('playerOne') ? (cell.style.background = '#d1eeff') : (cell.style.background = '#ffd1e7');
		});
	}
}

function restartGame() {
	player.isEnd = false;

	restartBtn.style.display = 'none';

	// resets UI
	gameCells.forEach(cell => {
		cell.addEventListener('click', pickCell);
		cell.innerHTML = '';
		cell.classList = 'cell';
		cell.style.background = '#fff';
	});
}

restartBtn.addEventListener('click', () => {
	socket.emit('restart-game', { room: player.room });
});

// socket
const socket = io();

socket.on('connect', () => {
	// client
	const userInput = window.prompt('Enter your Username');

	player.username = userInput.replace(/\s/g, '');

	playerOneName.innerText = `${player.username}`;
	playerOneScore.classList.add(player.username);

	disableGame();

	socket.emit('create-room', { playerRoom: player.room, username: player.username });
});

socket.on('room-connection', ({ room, data }) => {
	player.isEnd = false;

	if (player.description === 'playerOne') {
		player.opponent = data.playerTwo.username;
		player.mark = data.playerOne.mark;
	} else {
		player.opponent = data.playerOne.username;
		player.mark = data.playerTwo.mark;
	}

	// check for opponent
	if (player.opponent) {
		playerTwoName.innerText = player.opponent;
	} else {
		playerTwoName.innerText = 'Player Two';
	}
});

socket.on('private', ({ description, id }) => {
	player.description = description;
	player.id = id;
});

function test() {
	yourTurnNtf.style.display = 'none';
	opponentTurnNtf.style.display = 'none';
	restartBtn.style.display = 'inline';
}

socket.on('player-turn', ({ firstPlayer }) => {
	if (!player.isEnd && firstPlayer === player.description) enableGame();
	if (!player.isEnd && firstPlayer !== player.description) disableGame();
});

socket.on('player-move', ({ username, moves }) => {
	const lastMove = moves[moves.length - 1];
	const cell = gameCellsWrapper.children[lastMove - 1];
	const tmp = document.createElement('i');

	// current player played
	if (username === player.username) {
		tmp.classList = `${marks[player.mark]}`;
		cell.classList.add('playerOne');
	} else {
		// opponent played
		const tmpArray = Object.keys(marks);
		const opponentMark = tmpArray.find(mark => mark !== player.mark);
		tmp.classList = `${marks[opponentMark]}`;
		cell.classList.add('playerTwo');
	}

	cell.appendChild(tmp);

	if (!player.isEnd) {
		socket.emit('next-turn', { room: player.room });
		disableGame();
	}
});

socket.on('game-end', ({ description, score, arr }) => {
	console.log('game ended!');
	player.isEnd = true;
	endGame(description, score, arr, 0);
});

socket.on('restart', () => {
	restartGame();
});

socket.on('player-left', data => {
	console.log(data);
	player.opponent = undefined;

	playerTwoName.innerText = 'Player Two';
	tieScore.innerText = '0';
	playerOneScore.innerText = '0';
	playerTwoScore.innerText = '0';

	player.isEnd = true;

	// resets UI
	gameCells.forEach(cell => {
		cell.removeEventListener('click', pickCell);
		cell.innerHTML = '';
		cell.classList = 'cell';
		cell.style.background = '#fff';
	});

	endGame(undefined, undefined, undefined, 1);
});