const EventEmitter = require('node:events');
const { run } = require('node:test');

class TaskQueue extends EventEmitter {
    #queue;
    #running;
    #concurrency;
    #isActive;

    constructor (concurrency) {
        super();
        this.#concurrency = concurrency;
        this.#queue = [];
        this.#running = 0;
        this.#isActive = false;
    }
    
    add (id, jobFn) {
        this.#queue.push( { id, jobFn });
        this.#isActive = true;
        this.#processQueue();
    }

    #processQueue () {
        while (this.#running < this.#concurrency && this.#queue.length > 0) {
            const { id, jobFn } = this.#queue.shift();
            this.#running++;
            this.emit('job:start', {id});

            Promise.resolve()
            .then(() => jobFn())
            .then(result => {
                this.emit('job:complete', {id, result});
            })
            .catch(error => {
                this.emit('job:error', {id, error});
            })
            .finally(() => {
                this.#running--;
                this.#processQueue();
            });
        }
        if (this.#queue.length === 0 && this.#running === 0 && this.#isActive) {
            this.emit('queue:empty');
            this.#isActive = false;
        }
    }
}

module.exports = TaskQueue;