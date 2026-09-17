const { notes, getNextNoteId } = require('../data');
const readJSON = require('../utils/readJSON');

async function noteHandler (req, res, segment) {
    if (req.method === 'GET' && !segment[1]) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(notes));

    } else if (req.method === 'GET' && segment[1]) {
        const id = Number(segment[1]);
        const note = notes.find((note) => note.id === id);

        if (!note) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Note not found'
            }));
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(note));

    } else if (req.method === 'POST' && !segment[1]) {
        try {
            const data = await readJSON(req);

            if (!data.title || !data.content) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Title and content are required'
                }));
                return;
            }

            const note = {
                id: getNextNoteId(),
                title: data.title,
                content: data.content
                
            };

            notes.push(note);

            res.writeHead(201, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(note));

        } catch (err) {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Invalid JSON'
            }));
        }

    } else if (req.method === 'PUT' && segment[1]) {
        const id = Number(segment[1]);
        const note = notes.find((note) => note.id === id);

        if (!note) {
            res.writeHead(404, {
                'Content-Type' : 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Note not found'
            }));
            return;
        }

        try {
            const data = await readJSON(req);
            
            if (data.title !== undefined) {
                note.title = data.title;
            }

            if (data.content !== undefined) {
                note.content = data.content;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(note));

        } catch (err) {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Invalid JSON'
            }));
        }


    } else if (req.method === 'DELETE' && segment[1]) {
        const id = Number(segment[1]);
        const index = notes.findIndex((note) => note.id === id);

        if (index === -1) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Note not found'
            }));
            return;
        }

        notes.splice(index, 1);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            message: 'Note deleted'
        }));


    } else {
        res.writeHead(405, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
        error: 'Method not allowed'
        }));
    }
}

module.exports = noteHandler;