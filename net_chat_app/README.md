# TCP Chat Application

## Project Overview

This project is a TCP chat application built with Node.js using the built-in `net` module.

Multiple clients can connect to the server from separate terminals, choose unique usernames, send broadcast messages, and send private messages to specific users.

The application also includes two additional features:


- `/who` command
- Join/leave notifications

No third-party networking or chat libraries are used.

## Message Protocol and Framing

The application uses a simple text-based protocol.

Every message ends with `\n`, which is used as the message delimiter.

Because TCP does not guarantee that one `data` event contains exactly one message, both the server and client use a buffer. Incoming data is added to the buffer, split by `\n`, and complete messages are processed. If a message is incomplete, the remaining part stays in the buffer until more data arrives.

The protocol uses the following commands:

`/msg <username> <message>`
Sends a private message to one connected user.

`/who`
Shows all currently connected users.

Any message without a command prefix is treated as a broadcast message.

## Usernames

A client must choose a username before being able to chat.

Empty usernames are rejected, and two clients cannot use the same username at the same time. If a username is already taken, the server asks the client to choose another name.

## Broadcast Messages

A normal message is sent to all connected users except the sender.

Example:￼
```text
hello everyone
```

The sender sees:
```text
[You]: hello everyone
```

Other users see:
```text
[Alice]: hello everyone
```

## Private Messages

A private message is sent using:
```text
/msg Bob Hello Bob!
```

The sender sees:
```￼
[You -> Bob]: Hello Bob!
```

The recipient sees:
```text
[Alice -> You]: Hello Bob!
```

If the target user is not connected, the sender receives an error message instead of the message being silently dropped.

## Additional Features

**`/who`**
Shows all currently connected users.

Example:
`/who`

Response:
```text
Connected users:
Alice
Bob
Charlie
```

**Join and Leave Notifications**

When a user connects, other users receive:
```text
_____Alice joined_____
```

When a user disconnects, other users receive:
```
_____Alice left_____
```

## Error and Disconnect Handling
Each client socket has an error event handler so that an individual socket error does not crash the server.

The server also handles the close event. When a client disconnects, its username is removed from the connected users map and the other users are notified.

## How to Run
Start the server:
```bash
node server.js
```

Then open two or more separate terminals and start a client in each:
```bash
node client.js
```

Choose a unique username when prompted.

Example:
```text￼
Terminal 1: Alice
Terminal 2: Bob
Terminal 3: Charlie
```
