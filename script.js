// ===============================================
// Flavorites - IA#2 JavaScript Solutions
// Nicoi Carnegie | 2202835 | CIT2011
// ===============================================

const cart = JSON.parse(localStorage.getItem('cart')) || [];

// IA#2 - DOM Manipulation & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.mobile-menu')) {
        document.querySelector('.mobile-menu').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });

    // Load cart on cart.html
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        document.getElementById('clear-cart')?.addEventListener('click', clearCart);
    }

    // Checkout button
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Registration & Login validation
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', registerUser);
    }
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', loginUser);
    }
});

// IA#2 - Add to Cart with proper calculations
function addToCart(e) {
    const card = e.target.closest('.product-card');
    const id = card.dataset.id;
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.querySelector('.price').textContent.replace(/[$,]/g, ''));

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
}

// Display cart with subtotal, tax (16% GCT), discount logic
function displayCart() {
    const tbody = document.querySelector('.cart-table tbody');
    tbody.innerHTML = '';

    let subtotal = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toLocaleString()}</td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
            <td>$${itemTotal.toLocaleString()}</td>
            <td><button class="btn" style="background:#ff4444;" onclick="removeFromCart(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    // IA#2 - Correct arithmetic calculations
    const discount = subtotal > 10000 ? subtotal * 0.10 : 0;
    const tax = (subtotal - discount) * 0.16;
    const total = subtotal - discount + tax;

    document.getElementById('subtotal').textContent = '$' + subtotal.toLocaleString();
    document.getElementById('discount').textContent = '-$' + discount.toLocaleString();
    document.getElementById('tax').textContent = '$' + tax.toFixed(0);
    document.getElementById('total').textContent = '$' + total.toFixed(0);
}

function updateQuantity(index, qty) {
    cart[index].quantity = parseInt(qty);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function clearCart() {
    if (confirm('Clear all items from cart?')) {
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Simple registration (stores in localStorage)
function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!email.includes('@') || password.length < 6) {
        document.getElementById('register-error').style.display = 'block';
        document.getElementById('register-error').textContent = 'Invalid email or password (min 6 chars)';
        return;
    }

    const user = { name, email, username, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html';
}

function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.username === username && user.password === password) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}