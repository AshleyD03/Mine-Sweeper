import { Animation } from './animation.js'
import { Preset } from './preset.js'

// Tile element for each minesweeper tile
class tile {
    constructor (board, x, y) {

        // Store origin board
        if (!board) return console.log('Error - tile created without board')
        if (typeof x !== 'number' || typeof y !== 'number') return console.log('Error - tile crated without cords')
        this.__board__ = board;

        // Create tile body & append
        this.body = document.createElement('button');
        this.body.setAttribute('class', 'tile');
        this.body.classList.add('material-icons')

        // Provide status of tile
        this.status; // 'neutral' || 'flagged' || 'checked'
        this.updateStatus = (name='neutral', material=false, text='') => {

            // Remove old classes
            Array.from(['neutral', 'flagged', 'checked', 'bombed', 'material-icons'])
            .forEach(s => this.body.classList.remove(s))

            if (material) this.body.classList.add('material-icons')

            // Apply new status
            this.status = name;
            this.body.innerHTML = text;
            this.body.classList.add(this.status);

            return true
        }
        this.updateStatus('neutral')

        // Value is either numb (bombs arround) || a bomb
        this.hasBomb = false;

        // Boolean value to represent if is target of selector
        this.isTarget = false;

        this.checkNeighbours = () =>{

            let ifExists = (array, key) => {
                try {
                    let get = array[key]
                    return get 
                } catch {
                    return null
                }
            }

            let tiles = this.__board__.tiles;
            let x = this._x;
            let y = this._y;

            let neighbours = []

            // Check row above
            let topRow = ifExists(tiles, (y-1));
            if (topRow) {
                for (let i = -1; i < 2; i++) {
                    let tile =ifExists(topRow, x+i)
                    if (tile) neighbours.push(tile)
                }
            }

            // Check row bellow
            let botRow = ifExists(tiles, (y+1));
            if (botRow) {
                for (let i = -1; i < 2; i++) {
                    let tile =ifExists(botRow, x+i)
                    if (tile) neighbours.push(tile)
                }
            }

            // Check side elements
            let left = ifExists(tiles[y], (x+1));
            if (left) neighbours.push(left);

            let right = ifExists(tiles[y], (x-1));
            if (right) neighbours.push(right)

            
            let count = 0;
            neighbours.forEach(tile => {
                if (tile.hasBomb === true) count++
            })

            return {count, neighbours}
        }
        
        this.setColorTheme = ({a='FFC266', b=a, c=null}) => {
            let style = this.body.getAttribute('style');
            this.body.setAttribute('style', `${style}; color: ${b}; border-color: ${a}`);
            if (c) this.body.style.background = c;
        }

        // Left click event
        let onLeftClick = (e) => {
            let button = e.button;
            if (this.status === 'neutral') {

                if (this.hasBomb === true) {
                    this.setColorTheme(this.__board__.tileColorSet['bomb'])
                    this.updateStatus('bombed', true);
                    this.__board__.revealBombs()
                    return
                }

                let {count, neighbours} = this.checkNeighbours();

                if (this.__board__.tileColorSet[count]) {
                    this.setColorTheme(this.__board__.tileColorSet[count])
                }

                

                // Begin loop algorithm
                if (count === 0 && !this.hasBomb) {    
                    count = '';

                    neighbours.forEach(tile => {
                        setTimeout(function() {
                            tile.body.click()
                        }, 1)
                    })   
                }

                this.updateStatus('checked', false, count);
                this.__board__.addspaceChecks(1);
                this.__board__.checkWinCondition();
            }
        }
        this.body.addEventListener('click', onLeftClick)

        // Right click event
        let onRightClick = (e) => {
            e.preventDefault()
            let settings = this.__board__.settings

            switch (this.status) {
                case 'neutral':
                    this.updateStatus('flagged', true);
                    settings.flagAdd(x, y);
                    break

                case 'flagged':
                    this.updateStatus('neutral');
                    settings.flagRemove(x, y);
                    break
            }

            return false
        }
        this.body.addEventListener('contextmenu', onRightClick)
        
        this._x = x;
        this._y = y;
        
        this.__board__.grid.appendChild(this.body);
    }

    _setFocus (bool) {
        if (bool) {
            this.isTarget = true;
            this.body.classList.add('selector-target')
        } else
        {
            this.isTarget = false;
            this.body.classList.remove('selector-target')
        }
    }
}

class selector {
    constructor (board) {
        
        this.__board__ = board;
        this.__active = false;

        // Set key values
        this.maxY, this.maxX, this.posY, this.posX, this.currentTile, this.__tiles__;

        this.__initialise= () => {
            this.__tiles__ = board.tiles;
            this.maxY = this.__tiles__.length ?? 0;
            this.maxX = this.__tiles__[0].length ?? 0;
            this.posY = 0;
            this.posX = 0;
            this.currentTile = this.__tiles__[this.posY][this.posX];
            this.__active = true;
            this.__moveEffect__();
        }

        this.__makeMove__ = (cur, max) => (a) => {
            if (!a || typeof a !== 'number') return
            
            let b = this[cur] + a;
            if (b < 0 || b >= this[max]) return
    
            this[cur] = b;
            this.__moveEffect__();
        }
        

        this._moveX = this.__makeMove__('posX', 'maxX');
        this._moveY = this.__makeMove__('posY', 'maxY');

        this.__onKeyPress__ = e => {
    
            let preset = Preset.controls;

            switch (e.key) {
                case (preset.up):
                    this._moveY(-1);
                    break;
                case (preset.left):
                    this._moveX(-1);
                    break;
                case (preset.down):
                    this._moveY(1);
                    break;
                case (preset.right):
                    this._moveX(1)
                    break;
                case (preset.leftClick):
                    this.currentTile.body.dispatchEvent(new Event('click'))
                    break;
                case (preset.rightClick):
                    this.currentTile.body.dispatchEvent(new Event('contextmenu'))
                    break;

            }
        }
        window.addEventListener('keypress', this.__onKeyPress__)
    }

    __moveEffect__ () {
        if (!this.__active) return
        let oldTile = this.currentTile;
        let newTile = this.__tiles__[this.posY][this.posX];

        oldTile._setFocus(false);
        newTile._setFocus(true);

        this.currentTile = newTile;
    }
}

class board {
    constructor () {
        
        // Super construction from animation
        this.__animation__ = new Animation('grid-target');

        // Init selector
        this.__selector__ = new selector (this);

        // Preset values for game
        this.values = {
            x: 6, 
            y: 6, 
            m: 6
        }

        // Connect settings
        this.settings;
        
        // Grid element and tiles array
        this.grid = document.getElementById('grid-target');
        this.tiles = [];
        this.tileColorSet = Preset.color_presets.tiles;

        // Check win condition
        let spaceChecks = 0;  
        this.setspaceChecks = (a) => spaceChecks = a;
        this.addspaceChecks = (a) => spaceChecks += a;

        // Create a new board, deleting the original board
        this.createBoard = () => {
            // Get board values
            let {x, y, m} = this.values;

            // Clear and create size
            this.grid.innerHTML = '';

            // Set columns
            this.grid.style.display = 'grid';
            this.grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
            
            // Create tiles to fill board
            this.tiles = [];
            for (let iY = 0; iY < y; iY++) {
                this.tiles.push([])
                for (let iX = 0; iX < x; iX++) {
                    let newTile = new tile(this, iX, iY);
                    this.tiles[iY].push(newTile);
                }
            }

            let bombLocations = [];
            let notBombs = 0;
            // Add bomb to a tile
            let addBomb = (x, y) => {
                try {
                    
                    if (!this.tiles[y][x].hasBomb) {
                        this.tiles[y][x].hasBomb = true;
                        return true
                    }
                    else return false
                }
                catch {
                    return false
                }
            }

            let loop = 0;
            do {
                let randX = Math.floor(Math.random() * x);
                let randY = Math.floor(Math.random() * y);
                console.log(randX, randY)

                let added = addBomb(randX, randY);

                if (added) {
                    loop -=- 1;
                    bombLocations.push({
                        x: randX,
                        y: randY
                    })
                }
            } while (loop < m)
            notBombs = x * y - m;

            // Reset left clicks
            spaceChecks = 0;

            this.revealBombs = () => {
                bombLocations.forEach(loc => {
                    let tile = this.tiles[loc.y][loc.x];
                    tile.setColorTheme(this.tileColorSet['bomb'])
                    tile.updateStatus('bombed', true);
                })
            }
            this.checkWinCondition = () => {
                if (spaceChecks === notBombs) {
                    window.alert('Won')
                }
            }

            // Now connect selector
            this.__selector__.__initialise();
        }; 

        
        
        
    }
    
}

export const Board = board;