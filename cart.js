// cart.js

let cart = [];

// Function to add an item to the cart
function addToCart(item) {
    cart.push(item);
}

// Function to update the quantity of an item in the cart
function updateCartItemQuantity(itemId, newQuantity) {
    cart = cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
}

// Function to remove an item from the cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
}

// Function to get the total items in the cart
function getCart() {
    return cart;
}

module.exports = { addToCart, updateCartItemQuantity, removeFromCart, getCart };
