class clock {
    constructor (id) {
        this.body = document.getElementById(id);
        this.time = 0;
        this.looper = null;
        this.target = 999;

        this.start = (begin) => {
            
            if (typeof begin !== 'number') this.time === 0;
            else this.time = begin;

            let loop = (resolve, reject) => {
                this.looper = setInterval(() => {
            
                    this.time -=- 1;
                    let len = 3 - this.time.toString().length;
                    if (len < 0) len = 0;
                    this.body.innerHTML = `${('0').repeat(len)}${this.time}`;

                    if (this.time >= this.target) {
                        resolve(true)
                        clearInterval(this.looper)
                    } 
    
                }, 1000)
            }

            return new Promise(loop);
        }

        this.pause = () => {
            clearInterval(this.looper)
        }
        
        this.unPause = () => {
            this.start(this.time)
        }
    }
}

export let Clock = clock;