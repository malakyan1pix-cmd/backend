const TaskQueue = require('./task_queue');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const queue = new TaskQueue(2);

queue.on('job:start', ({ id }) => {
    console.log(`start ${id}`);
});

queue.on('job:complete', ({ id, result }) => {
    console.log(`done ${id} -> ${result}`);
});

queue.on('job:error', ({ id, error }) => {
    console.log(`failed ${id}: ${error.message}`);
});

queue.on('queue:empty', () => {
    console.log('all jobs finished');
});



queue.add('A', () =>
    delay(5000).then(() => 'result-A')  //300
);

queue.add('B', () =>
    delay(2000).then(() => 'result-B')  //100
);

queue.add('C', () =>
    delay(4000).then(() => {
        throw new Error('boom');   //200
    })
);

queue.add('D', () =>
    delay(1000).then(() => 'result-D')  //50
);

queue.add('E', () =>
    delay(3000).then(() => 'result-E')   //150
);