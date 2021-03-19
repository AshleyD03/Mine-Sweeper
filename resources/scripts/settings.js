import { Animation } from './animation.js'
import { Clock } from './clock.js'

/* 
    Class used to controll page settings in scoped enviroment.
    Requires board for settings to run.
*/

class settings {
    constructor (board=null) {

        // Super construction from animation
        this.__animation__ = new Animation ('settings')
        // Home Board
        this.__board__ = board;
        // Initialise clock
        this.__clock__ = new Clock('alaramval')



        // Get value elements
        let yElement = document.getElementById('input-y');
        let xElement = document.getElementById('input-x');
        let mineElement = document.getElementById('input-mines');
        this.getValues = () => {
            let values = {
                y: yElement.value,
                x: xElement.value,
                m: mineElement.value
            };
            return values;
        };


        
        // Submit body parts
        this.body = document.getElementById('settings');
        this.bar = document.getElementById('bar');
        this.submit = document.getElementById('submit');
        document.getElementById('settings-space').style.height = `${this.bar.offsetHeight}px`;



        // Reveal settings button
        this.canSee = true
        let changeVisiblity = (canSee = !this.canSee) => { 

            if (canSee !== true && canSee !== false) canSee = !this.canSee

            // Go visible
            if (canSee === true) {
                this.canSee = true;
                this.__animation__.appear()
                this.__board__.__animation__.disappear()
                this.__clock__.pause()
            } else 

            // Hide
            if (canSee === false) {
                this.canSee = false;
                this.__animation__.disappear()
                this.__board__.__animation__.appear()
                this.__clock__.unPause();
            }

        }   
        document.getElementById('open-settings').addEventListener('click', changeVisiblity)



        // Record flag changes
        this.flagList = [];
        let flagLength = 0;

        this.flagSetLength = (length=flagLength) => {
            let node = document.getElementById('flagval');
            flagLength = length;
            node.innerHTML = length;
        }
        this.flagAdd = (x, y) => {
            this.flagList.push({x: x, y: y})
            flagLength -= 1;
            this.flagSetLength()
        };

        this.flagRemove = (x, y) => {
            let index = this.flagList.indexOf(f => (f.y === y && f.x === x))
            this.flagList.splice(index, 1)
            flagLength += 1;
            this.flagSetLength()
        }
            
      


        // Begin game section
        this.startGame = (e) => {
            // Set board values and create board
            let values = this.getValues();
            this.__board__.values = values;

            // Hide settings nad reveal board
            this.__board__.createBoard()
            this.__board__.__animation__.appear(e.settings)
            this.__animation__.disappear(e.settings);
            this.canSee = false;

            // Begin timer
            this.__clock__.time = 0;
            this.__clock__.start()

            // Set flags
            this.flagSetLength(parseInt(values.m))

        }



        this.submit.addEventListener('click', this.startGame)
        this.startGame({settings: {duration: 0}})

        this.__board__.settings = this;
    }
}

export let Settings = settings;