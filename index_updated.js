// index.js

const express = require('express');
const { addToCart, updateCartItemQuantity, removeFromCart, getCart } = require('./cart');

const app = express();
app.use(express.json());

// Route to add item to the cart
app.post('/cart', (req, res) => {
    const item = req.body;
    addToCart(item);
    res.status(201).send('Item added to cart');
});

// Route to update item quantity
app.put('/cart/:id', (req, res) => {
    const itemId = req.params.id;
    const { quantity } = req.body;
    updateCartItemQuantity(itemId, quantity);
    res.send('Item quantity updated');
});

// Route to remove item from the cart
app.delete('/cart/:id', (req, res) => {
    const itemId = req.params.id;
    removeFromCart(itemId);
    res.send('Item removed from cart');
});

// Route to get the current cart
app.get('/cart', (req, res) => {
    res.json(getCart());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
