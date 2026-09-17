const net = require('node:net');
const readline = require('node:readline');

const socket = net.connect(6000, 'localhost');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let symbol = null;

let buffer = '';

socket.on('data', (data) => {
    buffer += data.toString();

    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const message of lines) {
        if (message.trim() !== '') {
            handleMessage(message.trim());
        }
    }
});

function handleMessage(message) {
    const [command, data] = message.split('|');

    if (command === 'SYMBOL') {
        symbol = data;
        console.log(`You are ${symbol}.`);
    }

    if (command === 'BOARD') {
        const board = data.split(',');

        console.log(`
 ${board[0]} | ${board[1]} | ${board[2]}
-----------
 ${board[3]} | ${board[4]} | ${board[5]}
-----------
 ${board[6]} | ${board[7]} | ${board[8]}
`);
    }

    if (command === 'TURN') {
        if (data === symbol) {
            askMove();
        } else {
            console.log(`Opponent's turn.`);
        }
    }

    if (command === 'REJECTED') {
        console.log(`Move rejected: ${data}`);
        askMove();
    }

    if (command === 'WIN') {
        console.log(`${data} wins!`);
        rl.close();
        socket.end();
    }

    if (command === 'DRAW') {
        console.log('Draw!');
        rl.close();
        socket.end();
    }

    if (command === 'OPPONENT_LEFT') {
        console.log('Opponent left the game.');
        rl.close();
        socket.end();
    }
}

function askMove() {
    rl.question('Your turn. Enter a cell (0-8): ', (answer) => {
        socket.write(`MOVE|${answer}\n`);
    });
}

socket.on('close', () => {
    console.log('Connection closed.');
    rl.close();
});