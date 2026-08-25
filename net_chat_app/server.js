const net = require('node:net');

const PORT = 3000;

const users = new Map();

const server = net.createServer((socket) => {
    let username = null;
    let buffer = '';

    socket.write('Enter username:\n');

    socket.on('data', (data) => {
        buffer += data.toString();

        const messages = buffer.split('\n');
        buffer = messages.pop();

        for (const message of messages) {
            handleMessage(message.trim());
        }
    });

    socket.on('close', () => {
        if (username) {
            users.delete(username);
            sendSystemMessage(`${username} left`);
        }
    })

    socket.on('error', (error) => {
        console.log(`Socket error: ${error.message}`);
    });

    function handleMessage (message) {
        if (!message) return;
        if (!username) {
            if (!message) {
                socket.write('Enter username:\n');
                return;
            }

            if (users.has(message)) {
                socket.write('Enter another name:\n');
                return;
            }

            username = message;
            users.set(username, socket);
            socket.write(`Connected as ${username}.\n`);
            sendSystemMessage(`${username} joined`);
            return;
        }
        
        if (message.startsWith('/')) {
            handleCommand(message);
            return;
        }

        handleBroadcast(message);
    }

    function handleCommand (command) {
        const parts = command.split(' ');
        const commandName = parts[0];

        if (commandName === '/msg') {
            const targetName = parts[1];
            const message = parts.slice(2).join(' ');

            if (!targetName || !message) {
                socket.write('Usage: /msg <username> <message>\n');
                return;
            }

            handlePrivateMessage(targetName, message);
        }

        if (commandName === '/who') {
            const userList = [...users.keys()].join('\n');
            socket.write(`Connected users:\n${userList}\n`);
        }
    }

    function handleBroadcast (message) {
        socket.write(`[You]: ${message}\n`);
        sendToAll(`[${username}]: ${message}`, socket);
    }

    function handlePrivateMessage (targetName, message) {
        const targetSocket = users.get(targetName);

        if (!targetSocket) {
            socket.write(`User "${targetName}" is not connected\n`);
            return;
        }

        targetSocket.write(`[${username} -> You]: ${message}\n`);
        socket.write(`[You -> ${targetName}]: ${message}\n`);
    }

    function sendToAll (message, exceptSocket = null){
        for (const [name, socket] of users) {
            if (socket === exceptSocket) {
                continue;
            }
            socket.write(message + '\n');
        }
    }

    function sendSystemMessage (message) {
        sendToAll(`_____${message}_____`, socket);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});