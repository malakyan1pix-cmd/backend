const express = require('express');
const { readData, writeData } = require("../utils/fileDB");
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res
        .status(400)
        .json({ error: 'Items must be a non-empty array' });
    }

    const productIds = items.map((item) => Number(item.productId));

    if (new Set(productIds).size !== productIds.length) {
        return res
        .status(400)
        .json({ error: "Duplicate products are not allowed" });
    }

    const products = await readData('products.json');

    let total = 0;
    const orderItems = [];

    for (const item of items) {
        const productId = Number(item.productId);

        if (!Number.isInteger(productId)) {
            return res
            .status(400)
            .json({ error: "Invalid productId" });
        }

         if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return res
            .status(400)
            .json({ error: "Quantity must be a positive integer" });
        }

        const product = products.find((p) => p.id === productId);

        if (!product) {
            return res
            .status(400)
            .json({ error: `Product ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
            return res
            .status(400)
            .json({ error: "Not enough stock for product" });
        }

        total += product.price * item.quantity;

        orderItems.push({
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            price : product.price
        });
    }

    items.forEach((item) => {
        const p = products.find(
            (p) => p.id === Number(item.productId)
        );
        p.stock -= item.quantity;
    });

    await writeData('products.json', products);

    const orders = await readData('orders.json');

    const newOrder = {
        id: Math.max(...orders.map(p => p.id)) + 1,
        userId: req.user.id,
        items: orderItems,
        total,
        createdAt: new Date().toString(),
    };

    orders.push(newOrder);

    await writeData('orders.json', orders);

    res.status(201).json(newOrder);
});

router.get('/', authenticate, async (req, res) => {
    const orders = await readData('orders.json');

    if (req.user.role === 'admin') {
        return res.status(200).json(orders);
    }
    
    const userOrders = orders.filter(
        (order) => order.userId === req.user.id
    );

    res.status(200).json(userOrders);

});

router.get('/:id', authenticate, async (req, res) => {
    const orders = await readData('orders.json');

    const orderId = Number(req.params.id);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return res.
        status(404)
        .json({ error: "Order not found" });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res
        .status(403)
        .json({ error: "Forbidden" });
    }

    return res.status(200).json(order);
});

module.exports = router;