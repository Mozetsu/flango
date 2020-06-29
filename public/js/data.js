export const win = [
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

export const allowed = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const marks = {
	cross: function (player) {
		return `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M25 25L108 108M108 25L25 108" stroke="var(--${player}-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
	</svg>`;
	},
	circle: function (player) {
		return `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="68.5" cy="68.5" r="51" stroke="var(--${player}-primary)" stroke-width="25"/>
	</svg>`;
	},
};

export function displayEmojis() {
	const emojiPopup = document.querySelector('#emoji-card');
	emojiPopup.style.opacity = 1;
	document.querySelectorAll('.emoji').forEach((emoji) => (emoji.style.pointerEvents = 'all'));
}

export function hideEmojis() {
	const emojiPopup = document.querySelector('#emoji-card');
	emojiPopup.style.opacity = 0;
	document.querySelectorAll('.emoji').forEach((emoji) => (emoji.style.pointerEvents = 'none'));
}

function arrayContainsArray(arr1, arr2) {
	const tmp = [];
	arr1.forEach((a) => {
		if (arr2.find((b) => b === a)) tmp.push(a);
	});
	return tmp.length === arr1.length;
}

export function checkWin(arr, player) {
	// not enough plays to win
	if (player.moves.length < 3) return { str: '', arr: [] };

	// array to store possible winning combinations
	const tmp = [];

	for (let combination of arr) {
		if (arrayContainsArray(combination, player.moves)) {
			tmp.push(...combination);
		}
	}
	const parsedArr = [...new Set(tmp)]; // removes duplicates
	return { str: player.str, arr: parsedArr };
}
