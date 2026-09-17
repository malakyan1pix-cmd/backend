const { tasks, getNextTaskId} = require('../data');
const readJSON = require('../utils/readJSON');

async function taskHandler (req, res, segment) {
    if (req.method === 'GET' && !segment[1]) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(tasks));

    } else if (req.method === 'GET' && segment[1]) {
        const id = Number(segment[1]);
        const task = tasks.find((task) => task.id === id);

        if (!task) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Task not found'
            }));
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(task));


    } else if (req.method === 'POST' && !segment[1]) {
        try {
            const data = await readJSON(req);

            if (!data.title) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Title is required'
                }));
                return;
            }

            const task = {
                id: getNextTaskId(),
                title: data.title,
                completed: data.completed ?? false
                
            };

            tasks.push(task);

            res.writeHead(201, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(task));

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
        const task = tasks.find((task) => task.id === id);

        if (!task) {
            res.writeHead(404, {
                'Content-Type' : 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Task not found'
            }));
            return;
        }

        try {
            const data = await readJSON(req);
            
            if (data.title !== undefined) {
                task.title = data.title;
            }

            if (data.completed !== undefined) {
                task.completed = data.completed;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(task));

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
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                error: 'Task not found'
            }));
            return;
        }

        tasks.splice(index, 1);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            message: 'Task deleted'
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

module.exports = taskHandler;