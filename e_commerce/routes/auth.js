const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/fileDB');

const router = express.Router();

const SECRET = process.env.SECRET || 'something';

router.post('/register', async (req, res) => {
    const { username, password} = req.body;

    if (!username || !password) {
        return res.
        status(400)
        .json({error: 'Username and password are required'});
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
    return res
        .status(400)
        .json({ error: 'Username and password must be strings' });
}

    const users = await readData('users.json');
    if (users.find((u) => u.username === username)) {
        return res
        .status(409)
        .json({ error: 'Username already exists'});
    }

    const newUser = {
        id: users.length ? Math.max(...users.map(p => p.id)) + 1 : 1,
        username,
        passwordHash: await bcrypt.hash(password, 10),
        role: 'customer'
    };

    users.push(newUser);
    await writeData('users.json', users);

    res.status(201).json({
        id: newUser.id,
        username: newUser.username, 
        role: newUser.role
    });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res
        .status(400)
        .json({ error: 'Username and password must be strings' });
    }

    const users = await readData('users.json');

    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res
        .status(401)
        .json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        }, 
        SECRET, 
        {expiresIn: '2h'},
    );

    res.json({ token});
});

module.exports = router;