import { Board } from './scripts/game.js';
import { Settings } from './scripts/settings.js';

let settings = new Settings( new Board() );

document.getElementById('grid-target').addEventListener('contextmenu', e => {
    e.preventDefault();
})