require('dotenv').config({ quiet: true });
const http = require('node:http');
const noteHandler = require('./handlers/noteHandler');
const taskHandler = require('./handlers/taskHandler');
const contactHandler = require('./handlers/contactHandler');

const PORT = process.env.PORT || 4001;

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const segment = url.pathname.split('/').filter(Boolean);

        if (segment[0] === 'notes') {
            await noteHandler(req, res, segment);
 
        } else if (segment[0] === 'tasks') {
            await taskHandler(req, res, segment);

        } else if (segment[0] === 'contacts') {
            await contactHandler(req, res, segment);

        } else {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
            error: 'Route not found' 
            }));
        }
    } catch (err) {
        console.log(err);

        if (!res.headersSent) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
  
            res.end(JSON.stringify({
                error: 'Internal server error'
            }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});