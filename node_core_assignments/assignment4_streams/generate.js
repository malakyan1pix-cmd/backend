const fs = require('node:fs');
const output = fs.createWriteStream('server.log');
const messages = {
    ERROR: [
        'Connection timed out',
        'Database unavailable',
        'Failed to connect',
        'Internal server error'
    ],
    WARN: ['Retry attempt 2',
        'High memory usage',
        'Slow response detected',
        'Connection unstable'
    ],
    INFO: [
        'Request handled in 42ms',
        'User logged in',
        'Request received',
        'Connection established'
    ]
}

function randomLevel() {
    const random = Math.random();
    if (random < 0.05) {
        return 'ERROR'
    }
    if (random < 0.20) {
        return 'WARN';
    }
    return 'INFO';
}
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let currentTime = new Date('2026-08-10T14:00:00Z');
for (let i = 0; i < 100_000; i++) {
    const level = randomLevel();
    const message = randomItem(messages[level]);
    const timestamp = currentTime.toISOString().replace('.000', '');
    const line = `${timestamp} [${level}] ${message}\n`;
    output.write(line);
    const seconds = Math.floor(Math.random() * 10) + 1;
    currentTime = new Date(currentTime.getTime() + seconds * 1000);

}
output.end();
console.log('server.log generated successfully');