const net = require('node:net');

const PORT = 3000;
const HOST = 'localhost'

const socket = net.createConnection({ port: PORT, host: HOST});

let buffer = '';
let username = '';

socket.on('data', (data) => {
    buffer += data.toString();

    const messages = buffer.split('\n');
    buffer = messages.pop();

    for (const message of messages) {
        handleServerMessage(message.trim());
    }
});

socket.on('close', () => {
    console.log('Connection closed.');
});

socket.on('error', (error) => {
    console.log(`Socket error: ${error.message}`);
});

process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    handleInput(input);
});

function handleServerMessage (message) {
    console.log(message);

    if (message === 'Enter username:' || 
        message === 'Enter another name:'
    ) {
        return;
    }
    let parts = message.split(' ');
    if (parts[0] === 'Connected' && parts[1] === 'as') {
        username = parts[2].slice(0, -1);
    }
}

function handleInput (input) {
    if (!input) return;
    sendMessage(input);
}

function sendMessage (message) {
    socket.write(message + '\n');
}