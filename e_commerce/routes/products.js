const express = require('express');
const { readData, writeData } = require('../utils/fileDB');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    let products = await readData('products.json');

    const { category, sort } = req.query; 

    if (category) products = products.filter((p) => p.category === category);
    if (sort === 'price') products = products.sort((a, b) => a.price - b.price);

    res.json(products);

});


router.get('/:id', async(req, res) => {
    const products = await readData('products.json');
    const productId = Number(req.params.id);

    const product = products.find((p) => p.id === productId);
    if (!product) {
        return res
        .status(404)
        .json( {error: 'Product not found' });
    }

    res.json(product);
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || !price) {
        return res
        .status(400)
        .json({ error: 'Name and price are required' });
    }

    if (!Number.isFinite(price) || price <= 0) {
        return res
        .status(400)
        .json({ error: 'Price must be a positive number' });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res
        .status(400)
        .json({ error: 'Stock must be a non-negative integer' });
    }


    const products = await readData('products.json');

    const NewProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        category: category || 'other',
        stock: stock ?? 0
    };

    products.push(NewProduct);
    await writeData('products.json', products);

    res.status(201).json(NewProduct);
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    const products = await readData('products.json');

    const index = products.findIndex(
        (p) => p.id === Number(req.params.id)
    );

    if (index === -1) {
        return res
        .status(404)
        .json({ error: 'Product not found' });
    }

    products[index] = {
        ...req.body, 
        id: products[index].id
    };

    await writeData('products.json', products);

    res.status(200).json(products[index]);
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    let products = await readData('products.json');
    const exists = products.some((p) => p.id === Number(req.params.id));
    if (!exists) {
        return res
        .status(404)
        .json({ error: 'Product not found' });
    }

    products = products.filter((p) => p.id !== Number(req.params.id));
    await writeData('products.json', products);

    res.status(204).end();
});

module.exports = router;