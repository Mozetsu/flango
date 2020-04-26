const circle = `<svg width="137" height="137" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="68.5" cy="68.5" r="51" stroke="var(--player-two-primary)" stroke-width="25"/>
                </svg>`;

const cross = `<svg width="133" height="133" viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M25 25L108 108M108 25L25 108" stroke="var(--player-one-primary)" stroke-width="25" stroke-linecap="square" stroke-linejoin="round"/>
               </svg>`;

export function pickTile() {
	const tile = this;
	if (!tile.hasChildNodes()) tile.innerHTML = cross;
}
