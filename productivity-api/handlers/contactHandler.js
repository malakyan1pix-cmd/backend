const {contacts, getNextContactId } = require('../data');
const readJSON = require('../utils/readJSON');

async function contactHandler (req, res, segment) {
    if (req.method === 'GET' && !segment[1]) {
        res.writeHead(200, {
            'Content-Type' : 'application/json'
        });

        res.end(JSON.stringify(contacts));

    } else if (req.method === 'GET' && segment[1]) {   
        const id = Number(segment[1]);
        const contact = contacts.find((contact) => contact.id === id);

        if (!contact) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Contact not found'
            }));
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(contact));

    } else if (req.method === 'POST' && !segment[1]) {
        try {
            const data = await readJSON(req);

            if (!data.name || !data.email) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Name and email are required'
                }));
                return;
            }

            const contact = {
                id: getNextContactId(),
                name: data.name,
                email: data.email,
                phone: data.phone ?? null
            };

            contacts.push(contact);

            res.writeHead(201, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(contact));

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
        const contact = contacts.find((contact) => contact.id === id);

        if (!contact) {
            res.writeHead(404, {
                'Content-Type' : 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Contact not found'
            }));
            return;
        }

        try {
            const data = await readJSON(req);
            
            if (data.name !== undefined) {
                contact.name = data.name;
            }
            if (data.email !== undefined) {
               contact.email = data.email;
            }
            if (data.phone !== undefined) {
                contact.phone = data.phone;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(contact));

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
        const index = contacts.findIndex((contact) => contact.id === id);

        if (index === -1) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Contact not found'
            }));
            return;
        }

        contacts.splice(index, 1);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            message: 'Contact deleted'
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

module.exports = contactHandler;