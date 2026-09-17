const net = require('node:net');
const PORT = 6000;

const players = [];
const board = Array(9).fill('_');

let currentPlayer = 'X';

const server = net.createServer((socket) => {
    if (players.length >= 2) {
        socket.write('server is full\n');
        socket.end();
        return;
    }

    const player = {
        socket, 
        symbol: players.length === 0 ? 'X' : 'O',
        buffer: ''
    };

    players.push(player);

    console.log(`[server] player ${players.length} connected`);

    socket.on('data', (data) => {
        player.buffer += data.toString();

        const lines = player.buffer.split('\n');
        player.buffer = lines.pop();

        for (const line of lines) {
            handleMessage(player, line.trim());
        }
    });

    socket.on('close', () => {
        const index = players.indexOf(player);

        if (index === -1) return;

        players.splice(index, 1);

        if (players.length === 1) {
            players[0].socket.write('OPPONENT_LEFT\n');
            players[0].symbol = 'X';
        }

        board.fill('_');
        currentPlayer = 'X';

        console.log(`[server] player ${player.symbol} disconnected`);
    });

    if (players.length === 2) {
        console.log (`[server] game starting`);

        for (const player of players) {
            player.socket.write(`SYMBOL|${player.symbol}\n`);
            player.socket.write(`BOARD|${board.join(',')}\n`);
            player.socket.write(`TURN|${currentPlayer}\n`);
        }
    } else {
        console.log('[server] waiting for opponent');
    }
});

server.listen(PORT, () => {
    console.log(`[server] listening on :${PORT}`);
});




function handleMessage (player, message) {
    if (!message.startsWith('MOVE|')) {
        return;
    }

    const value = message.split('|')[1];
    const cell = Number(value);

    if (player.symbol !== currentPlayer) {
        player.socket.write('REJECTED|not your turn\n');
        return;
    }

    if (!Number.isInteger(cell) || cell < 0 || cell > 8) {
        player.socket.write('REJECTED|invalid cell\n');
        return;
    }

    if (board[cell] !== '_') {
        player.socket.write('REJECTED|cell is occupied\n');
        return;
    }

    board[cell] = player.symbol;

    broadcast(`BOARD|${board.join(',')}\n`);

    const winner = checkWinner();

    if (winner) {
        broadcast(`WIN|${winner}\n`);
        return;
    }

    if (isDraw()) {
        broadcast('DRAW\n');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    
    broadcast(`TURN|${currentPlayer}\n`);
}

function broadcast (message) {
    for (const player of players) {
        player.socket.write(message);
    } 
}

function checkWinner () {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    for (const [a, b, c] of winningLines) {
        if (
            board[a] !== '_' &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }
    return null;
}

function isDraw () {
    return board.every((cell) => cell !== '_');
}