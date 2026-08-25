const EventEmitter = require('node:events');

class Downloader extends EventEmitter {
    constructor() {
        super();
    }

    download() {
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const percent = step * 10;

            this.emit('progress', percent);
            if (step === 10) {
                clearInterval(timer);
                this.emit('done');
            }
            
        }, 500);
    }
}
module.exports = Downloader;